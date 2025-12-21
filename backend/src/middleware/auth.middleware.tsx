import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import type { Context, MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'
import { setCookie, getCookie } from 'hono/cookie'
import { get } from 'node:https'

/**
 * Hono Context に Supabase クライアントを格納するためのモジュール拡張
 * ミドルウェアで supabase が設定されると、全ハンドラーで c.get('supabase') で取得可能
 */
declare module 'hono' {
   interface ContextVariableMap {
      supabase: SupabaseClient
   }
}

/**
 * Context から Supabase クライアントを取得するヘルパー関数
 */
export const getSupabase = (c: Context) => {
   return c.get('supabase')
}

/**
 * 環境変数の型定義
 */
type SupabaseEnv = {
   SUPABASE_URL: string
   SUPABASE_PUBLISHABLE_KEY: string
}

/**
 * Supabase 認証ミドルウェア
 * すべてのリクエストで実行され、以下の処理を行う：
 * 1. Supabase クライアントを初期化してコンテキストに設定
 * 2. Cookie から認証トークンを読み込む
 * 3. セッションを検証・リフレッシュ
 * 4. 新しいトークンを Cookie に保存
 */
export const supabaseMiddleware = (): MiddlewareHandler => {
   return async (c, next) => {
      // 環境変数から Supabase の設定を取得
      const supabaseEnv = env<SupabaseEnv>(c)
      const supabaseUrl = supabaseEnv.SUPABASE_URL
      const supabaseAnonKey = supabaseEnv.SUPABASE_PUBLISHABLE_KEY

      // URL チェック
      if (!supabaseUrl) {
         throw new Error('SUPABASE_URL missing!')
      }

      // 公開キーチェック
      if (!supabaseAnonKey) {
         throw new Error('SUPABASE_PUBLISHABLE_KEY missing!')
      }

      // Supabase クライアント初期化
      // Cookie の読み書きを Hono の cookie ユーティリティで管理
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
         cookies: {
            // Cookie ヘッダーから認証トークンを読み込む
            getAll() {
               const cookies = parseCookieHeader(c.req.header('Cookie') ?? '')
               // value が undefined の場合は空文字列に変換
               return cookies.map(cookie => ({
                  name: cookie.name,
                  value: cookie.value ?? ''
               }))
            },
            // レスポンスに新しいトークンを Cookie として設定
            setAll(cookiesToSet) {
               cookiesToSet.forEach(({ name, value, options }) => {
                  // sameSite の型を Hono の CookieOptions に合わせる
                  const sameSite = options?.sameSite === true ? 'Strict'
                     : options?.sameSite === false ? undefined
                        : options?.sameSite as 'Strict' | 'Lax' | 'None' | undefined

                  setCookie(c, name, value, {
                     ...options,
                     sameSite,
                  })
               })
            },
         },
      })

      // Context に Supabase クライアントを設定（後続ハンドラーで使用可能）
      c.set('supabase', supabase)

      // サインアップ・サインインエンドポイントはセッション検証をスキップ
      if (c.req.path === '/api/signup/' || c.req.path === '/api/signin/') {
         await next();
      }

      const access_token = getCookie(c, 'access_token');
      const refresh_token = getCookie(c, 'refresh_token');

      // Cookie から access_token を取得してユーザー情報を検証
      if (access_token) {
         const access_token = getCookie(c, 'access_token');
         const { data, error } = await supabase.auth.getUser(access_token);
         // ユーザー取得エラー時の処理
         if (error) {
            console.error('Error getting user:', error.message);
            return c.json({ error: 'Unauthorized' }, 401);
         }
         await next();
      } else {
         if (refresh_token) {
            console.log("access_token is empty but refreshable.")
            const { data, error } = await supabase.auth.refreshSession({
               refresh_token
            });
            if (error || !data?.session) {
               return c.json({ error: 'Unauthorized' }, 401);
            }
            const { access_token: newAccess, refresh_token: newRefresh, expires_at } = data.session;

            setCookie(c, 'access_token', newAccess, {
               expires: expires_at ? new Date(expires_at * 1000) : undefined,
            });
            setCookie(c, 'refresh_token', newRefresh);
            if (c.req.path === '/api/getsession/') {
               return c.json(data.session);
            }
            await next();
         }
      }
      return c.json({ error: 'Unauthorized' }, 401);
   }
}
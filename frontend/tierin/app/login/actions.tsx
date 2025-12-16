'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * ログイン処理を行うServer Action
 * バックエンドAPIにリクエストを送信し、レスポンスのCookieを設定する
 */
export async function loginAction(formData: FormData) {
   const email = formData.get('email') as string;
   const password = formData.get('password') as string;

   try {
      // バックエンドAPIにログインリクエストを送信
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:3000'}/api/signin/`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
         // バックエンドのparseBodyが想定する通常のフォーム形式で送信
         body: new URLSearchParams({
            'email': email,
            'password': password,
         })
      });

      if (!response.ok) {
         const data = await response.json().catch(() => ({}));
         return {
            error: data.message || 'ログインに失敗しました',
         };
      }

      const data = await response.json();

      // Cookieを設定
      const cookie = await cookies();
      cookie.set('access_token', data.access_token, {
         httpOnly: true,
         expires: new Date(Date.now() + data.expires_at),
      });

      cookie.set('refresh_token', data.refresh_token, {
         httpOnly: true,
         expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日間有効
      });

   } catch (err) {
      return {
         error: err instanceof Error ? err.message : 'ネットワークエラーが発生しました',
      };
   }
   // ログイン成功後にホームページへリダイレクト
   redirect('/');
   return {
      success: true,
   };
}

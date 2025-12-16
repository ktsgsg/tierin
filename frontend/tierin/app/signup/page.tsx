'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signupAction } from './signupAction';
import { redirect } from 'next/navigation';

/**
 * 新規登録ページコンポーネント
 * Server Actionを使用してSSRで新規登録処理を行う
 */
export default function SignUpPage() {
   // エラーメッセージとローディング状態の管理
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   let flag_redirect = true;//リダイレクト用フラグ

   /**
    * フォーム送信処理
    * Server Actionを呼び出してバックエンドAPIと通信し、Cookieを設定
    */
   const handleSubmit = async (formData: FormData) => {
      setError('');
      setIsLoading(true);

      try {
         // Server Actionを実行（SSRで処理される）
         const result = await signupAction(formData);
         if (result.error) {
            if (result.error === 'Only Meijo University email addresses are allowed.') {
               setError('名城大学のメールアドレスのみ登録可能です。');
            } else {
               setError('新規登録に失敗しました');
            }
            flag_redirect = false;//リダイレクトしない
         }
      } catch (err) {
         //エラー内容によってメッセージを設定
         setError(err instanceof Error ? err.message : '新規登録に失敗しました');
      } finally {
         console.log('Sign in attempt finished');
         setIsLoading(false);
      }
      //リダイレクトフラグが立っていればリダイレクト
      if (flag_redirect) {
         redirect('/signup/sent');
      }
   };

   return (
      <div className="auth-page">
         {/* 新規登録フォームコンテナ */}
         <div className="auth-card">
            <h1 className="auth-title">新規登録</h1>

            {/* Server Actionを使用したフォーム */}
            <form action={handleSubmit} className="auth-form">
               {/* メールアドレス入力欄 */}
               <div>
                  <label htmlFor="email" className="auth-label">
                     メールアドレス
                  </label>
                  <input
                     type="email"
                     id="email"
                     name="email"
                     required
                     className="auth-input"
                     placeholder="example@example.com"
                  />
               </div>

               {/* パスワード入力欄 */}
               <div>
                  <label htmlFor="password" className="auth-label">
                     パスワード
                  </label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     required
                     className="auth-input"
                     placeholder="パスワードを入力"
                  />
               </div>

               {/* エラーメッセージ表示 */}
               {error && <div className="auth-error">{error}</div>}

               {/* 新規登録ボタン */}
               <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-button"
               >
                  {isLoading ? '登録中...' : '新規登録'}
               </button>
            </form>

            {/* ログインページへのリンク */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
               <p style={{ fontSize: '0.9rem', color: '#666666' }}>
                  既にアカウントをお持ちの方は{' '}
                  <Link href="/login" style={{ color: '#56D6E4', textDecoration: 'underline' }}>
                     ログイン
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginAction } from './actions';

/**
 * ログインページコンポーネント
 * Server Actionを使用してSSRでログイン処理を行う
 */
export default function LoginPage() {
   // エラーメッセージとローディング状態の管理
   const [error, setError] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   /**
    * フォーム送信処理
    * Server Actionを呼び出してバックエンドAPIと通信し、Cookieを設定
    */
   const handleSubmit = async (formData: FormData) => {
      setError('');
      setIsLoading(true);

      try {
         // Server Actionを実行（SSRで処理される）
         const result = await loginAction(formData);

         if (result.error) {
            setError(result.error);
         }
      } catch (err) {
         setError(err instanceof Error ? err.message : 'ログインに失敗しました');
      } finally {
         console.log('Login attempt finished');
         setIsLoading(false);
      }
   };

   return (
      <div className="auth-page">
         {/* ログインフォームコンテナ */}
         <div className="auth-card">
            <h1 className="auth-title">ログイン</h1>

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

               {/* ログインボタン */}
               <button type="submit" disabled={isLoading} className="auth-button">
                  {isLoading ? 'ログイン中...' : 'ログイン'}
               </button>
            </form>

            {/* 新規登録リンク */}
            <p className="auth-subtext">
               アカウントをお持ちでない方は{' '}
               <Link href="/signup" className="auth-link">
                  新規登録
               </Link>
            </p>

            {/* パスワード忘却時の案内 */}
            <div className="auth-note">
               現在、パスワードリセット機能はまだ実装されておりません。申し訳ございません。
               <br />
               パスワードを忘れてしまった場合は、
               <a href="mailto:241205181@ccmailg.meijo-u.ac.jp" className="auth-link">
                  241205181@ccmailg.meijo-u.ac.jp
               </a>
               にご連絡の上、アカウントのリセットをお願いしてください。
            </div>
         </div>
      </div>
   );
}
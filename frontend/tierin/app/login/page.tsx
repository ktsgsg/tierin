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
      <div className="min-h-screen flex items-center justify-center bg-[#071428]">
         {/* ログインフォームコンテナ */}
         <div className="bg-[#0b1220] p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
               ログイン
            </h1>

            {/* Server Actionを使用したフォーム */}
            <form action={handleSubmit} className="space-y-4">
               {/* メールアドレス入力欄 */}
               <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                     メールアドレス
                  </label>
                  <input
                     type="email"
                     id="email"
                     name="email"
                     required
                     className="w-full px-3 py-2 bg-[#071428] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="example@example.com"
                  />
               </div>

               {/* パスワード入力欄 */}
               <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                     パスワード
                  </label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     required
                     className="w-full px-3 py-2 bg-[#071428] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="パスワードを入力"
                  />
               </div>

               {/* エラーメッセージ表示 */}
               {error && (
                  <div className="text-red-400 text-sm p-3 bg-red-900/20 rounded-md">
                     {error}
                  </div>
               )}

               {/* ログインボタン */}
               <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
               >
                  {isLoading ? 'ログイン中...' : 'ログイン'}
               </button>
            </form>

            {/* 新規登録リンク */}
            <div className="mt-4 text-center">
               <p className="text-gray-400 text-sm">
                  アカウントをお持ちでない方は{' '}
                  <Link href="/signup" className="text-blue-500 hover:text-blue-400 underline">
                     新規登録
                  </Link>
               </p>
            </div>

            {/* パスワード忘却時の案内 */}
            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-md">
               <p className="text-blue-300 text-sm">
                  現在、パスワードリセット機能はまだ実装されておりません。申し訳ございません。
                  <br className="block my-2" />
                  パスワードを忘れてしまった場合は、
                  <a href="mailto:241205181@ccmailg.meijo-u.ac.jp" className="text-blue-400 hover:text-blue-300 underline">
                     241205181@ccmailg.meijo-u.ac.jp
                  </a>
                  にご連絡の上、アカウントのリセットをお願いしてください。
               </p>
            </div>
         </div>
      </div>
   );
}

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
      <div className="min-h-screen flex items-center justify-center bg-[#071428]">
         {/* 新規登録フォームコンテナ */}
         <div className="bg-[#0b1220] p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold text-white mb-6 text-center">
               新規登録
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

               {/* 新規登録ボタン */}
               <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
               >
                  {isLoading ? '登録中...' : '新規登録'}
               </button>
            </form>

            {/* ログインページへのリンク */}
            <div className="mt-4 text-center">
               <p className="text-gray-400 text-sm">
                  既にアカウントをお持ちの方は{' '}
                  <Link href="/login" className="text-blue-500 hover:text-blue-400 underline">
                     ログイン
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}

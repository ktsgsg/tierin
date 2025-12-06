'use client';

import Link from 'next/link';

/**
 * メール送信完了ページ
 * 新規登録メールを送信したことをユーザーに知らせる
 */
export default function SignupSentPage() {
   return (
      <div className="min-h-screen flex items-center justify-center bg-[#071428]">
         <div className="bg-[#0b1220] p-8 rounded-lg shadow-lg w-full max-w-md text-center">
            <h1 className="text-2xl font-bold text-white mb-4">確認メールを送信しました</h1>
            <p className="text-gray-300 mb-6">
               登録用の確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
            </p>
            <Link
               href="/login"
               className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
               ログイン画面に戻る
            </Link>
         </div>
      </div>
   );
}

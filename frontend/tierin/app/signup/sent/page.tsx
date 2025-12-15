'use client';

import Link from 'next/link';

/**
 * メール送信完了ページ
 * 新規登録メールを送信したことをユーザーに知らせる
 */
export default function SignupSentPage() {
   return (
      <div className="auth-page">
         <div className="auth-card text-center">
            <h1 className="auth-title mb-2">確認メールを送信しました</h1>
            <p className="text-gray-300 mb-6">
               登録用の確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
            </p>
            <Link href="/login" className="auth-button inline-block text-center">
               ログイン画面に戻る
            </Link>
         </div>
      </div>
   );
}

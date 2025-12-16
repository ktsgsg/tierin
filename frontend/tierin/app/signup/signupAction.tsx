'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * 新規登録処理を行うServer Action
 * バックエンドAPIにリクエストを送信し、レスポンスのCookieを設定する
 */
export async function signupAction(formData: FormData) {
   const email = formData.get('email') as string;
   const password = formData.get('password') as string;

   try {
      // バックエンドAPIにログインリクエストを送信
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:3000'}/api/signup/`, {
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
            error: data.error,
         };
      }

      return { success: true };

   } catch (err) {
      return {
         error: err instanceof Error ? err.message : 'ネットワークエラーが発生しました',
      };
   }
}

"use server";

import { error } from 'console';
import { cookies } from 'next/headers'

/**
 * いいねの更新を実行するサーバーアクション
 * @param contents_id - いいねするコンテンツのID
 * @param isIncrement - いいねをするか外すかのフラグ ("true" または "false")
 * @returns いいねしたコンテンツを含むオブジェクト もしくは，エラー用オブジェクト
 */
export async function favAction(contents_id: string, isIncrement: string) {

   // URLクエリパラメータを構築
   const params = new URLSearchParams();
   if (isIncrement) params.append("isIncrement", isIncrement);
   if (contents_id) params.append("contents_id", contents_id);

   // 認証用のCookieを取得
   const cookieStore = await cookies()
   const cookie = cookieStore.get('access_token') ? `access_token=${cookieStore.get('access_token')?.value}; refresh_token=${cookieStore.get('refresh_token')?.value}` : '';

   console.log('Cookie:', cookie);
   console.log('Full URL:', 'http://localhost:3000/api/fav/update?' + params.toString());
   //恐らくcookieが悪い恐らく恐らく
   const res = await fetch('http://localhost:3000/api/fav/update?' + params.toString(), {
   method: "GET",
   credentials: 'include',
   headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
   },
   });

   console.error("res: ", res);

   if (!res.ok) {
      return {
         error: false,
         status: res.status,
      };
   }
   return res.json();
}
"use server";
import { cookies } from 'next/headers';

export async function favAction(contents_id: string, isIncrement: string) {
   const params = new URLSearchParams({
      contents_id,
      isIncrement,
   });

   // 認証用のCookieを取得
   const cookieStore = await cookies()
   const cookie = cookieStore.get('access_token') ? `access_token=${cookieStore.get('access_token')?.value}; refresh_token=${cookieStore.get('refresh_token')?.value}` : '';

   // バックエンドAPIに更新リクエストを送信
   const res = await fetch(`http://172.30.0.2:3000/api/fav?${params.toString()}`, {
      method: "GET",
      credentials: 'include',
      headers: {
         'Cookie': cookie,
      },
   });
   console.log('Status:', res.status);
   if (!res.ok) {
      const errorData = await res.json();
      console.error('Error:', errorData);
      return {
         error: true,
         status: res.status,
         message: errorData.error || res.statusText,
      };
   }
   const data = await res.json();
   console.log('Success:', data);
   return {
      error: false,
      contents: data.contents,
   };
}
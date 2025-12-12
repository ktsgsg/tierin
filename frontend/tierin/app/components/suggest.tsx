"use server";
import { headers } from 'next/headers'
import { cookies } from 'next/headers'

type query = {
   name: string;
   teacher: string;
}

type subject = {
   id: string;
   code: string;
   name: string;
   place_and_time: string;
   teachers: string;
   url: string;
}

export const getSubjectsCode = async (query: query) => {
   // 認証用のCookieを取得
   const cookieStore = await cookies()
   const cookie = cookieStore.get('access_token') ? `access_token=${cookieStore.get('access_token')?.value}; refresh_token=${cookieStore.get('refresh_token')?.value}` : '';

   console.log(query);

   const response = await fetch("http://api:3000/api/database/subject?" + new URLSearchParams({
      name: query.name,
      teachers: query.teacher
   }), {
      headers: {
         'Content-Type': 'application/json',
         'Cookie': cookie,
      },
   });

   if (!response.ok) {
      return [];
   }

   const data = await response.json() as subject[];
   console.log(data);
   return data;
}
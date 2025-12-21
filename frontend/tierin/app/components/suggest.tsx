"use server";
import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { fetchSubjects } from '@/lib/searchUtils';

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
   console.log(query);

   // 共通関数を使って教科情報を取得
   const data = await fetchSubjects({
      name: query.name,
      teacher: query.teacher
   });

   console.log(data);
   return data;
}
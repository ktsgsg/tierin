"use server";

import { cookies } from 'next/headers';
import { SubjectData } from '@/app/search/types';

/**
 * 認証用Cookieを取得する共通関数
 */
export async function getAuthCookie(): Promise<string> {
   const cookieStore = await cookies();
   const accessToken = cookieStore.get('access_token')?.value;
   const refreshToken = cookieStore.get('refresh_token')?.value;

   if (!accessToken) return '';

   return `access_token=${accessToken}; refresh_token=${refreshToken}`;
}

/**
 * APIリクエストのベースヘッダーを取得する共通関数
 */
export async function getApiHeaders(): Promise<HeadersInit> {
   const cookie = await getAuthCookie();
   return {
      'Content-Type': 'application/json',
      'Cookie': cookie,
   };
}

/**
 * 教科コードから教科情報を取得する共通関数
 * @param subject_code - 教科コード
 * @returns 教科データ
 */
export async function fetchSubjectByCode(subject_code: string): Promise<SubjectData | null> {
   try {
      const headers = await getApiHeaders();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api:3000';

      const response = await fetch(
         `${apiUrl}/api/database/subject?code=${subject_code}`,
         { headers }
      );

      if (!response.ok) {
         console.error(`Failed to fetch subject for code ${subject_code}`);
         return null;
      }

      const data = await response.json();
      return data[0] || null;
   } catch (error) {
      console.error('Error fetching subject:', error);
      return null;
   }
}

/**
 * 教科情報を検索する共通関数（サジェスト用）
 * @param query - 検索クエリ（name, teacher）
 * @returns 教科データの配列
 */
export async function fetchSubjects(query: { name?: string; teacher?: string }): Promise<SubjectData[]> {
   try {
      const headers = await getApiHeaders();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api:3000';

      const params = new URLSearchParams();
      if (query.name) params.append('name', query.name);
      if (query.teacher) params.append('teachers', query.teacher);

      const response = await fetch(
         `${apiUrl}/api/database/subject?${params.toString()}`,
         { headers }
      );

      if (!response.ok) {
         console.error('Failed to fetch subjects');
         return [];
      }

      return await response.json();
   } catch (error) {
      console.error('Error fetching subjects:', error);
      return [];
   }
}

/**
 * サジェスト用の教科情報を取得する共通関数
 * @param query - 検索クエリ
 * @returns 教科データの配列
 */
export async function fetchSubjectSuggestions(query: {
   code?: string;
   name?: string;
   teachers?: string;
   select?: string;
}): Promise<SubjectData[]> {
   try {
      const headers = await getApiHeaders();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api:3000';

      const params = new URLSearchParams();
      if (query.code) params.append('code', query.code);
      if (query.name) params.append('name', query.name);
      if (query.teachers) params.append('teachers', query.teachers);
      if (query.select) params.append('select', query.select);

      const response = await fetch(
         `${apiUrl}/api/suggest/subject?${params.toString()}`,
         { headers }
      );

      if (!response.ok) {
         console.error('Failed to fetch subject suggestions');
         return [];
      }

      return await response.json();
   } catch (error) {
      console.error('Error fetching subject suggestions:', error);
      return [];
   }
}

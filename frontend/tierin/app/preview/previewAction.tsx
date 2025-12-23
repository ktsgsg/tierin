'use server';

import { cookies } from 'next/headers';
import { getAuthCookie } from '@/lib/searchUtils';

export type PreviewData = {
   metadata: {
      resources: string[];
      [key: string]: any;
   };
   [key: string]: any;
};

/**
 * プレビューデータを取得するサーバーアクション
 * @param contents_id - コンテンツID
 * @returns プレビューデータ
 */
export async function getPreviewData(contents_id: string): Promise<PreviewData | null> {
   if (!contents_id) {
      return null;
   }

   try {
      // 共通関数を使って認証用のCookieを取得
      const cookie = await getAuthCookie();

      const response = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL || 'http://api:3000'}/api/preview/contents?contents_id=${contents_id}`,
         {
            cache: 'no-store',
            headers: {
               'Cookie': cookie,
            },
         }
      );

      if (!response.ok) {
         return null;
      }

      const data = await response.json();
      return data;
   } catch (error) {
      console.error('Failed to fetch preview data:', error);
      return null;
   }
}

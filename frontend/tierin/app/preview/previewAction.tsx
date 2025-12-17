'use server';

import { cookies } from 'next/headers';

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
      // 認証用のCookieを取得
      const cookieStore = await cookies();
      const cookie = cookieStore.get('access_token')
         ? `access_token=${cookieStore.get('access_token')?.value}; refresh_token=${cookieStore.get('refresh_token')?.value}`
         : '';

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

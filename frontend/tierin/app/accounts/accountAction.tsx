'use server';

import { cookies } from 'next/headers';
import { SearchItem } from '../search/types';

export interface AccountData {
   email: string;
   likedResources: SearchItem[];
   myResources: SearchItem[];
}

const toSearchItem = (item: any): SearchItem => {
   const contentsId = String(item?.contents_id ?? item?.id ?? '');
   const extensions = Array.isArray(item?.extensions)
      ? item.extensions
      : typeof item?.extensions === 'string'
         ? item.extensions.split(',').filter(Boolean)
         : [];

   return {
      contents_id: contentsId,
      title: item?.title ?? '不明なタイトル',
      url: `/preview/?contents_id=${contentsId}`,
      subject: item?.subject ?? '不明',
      teacher: item?.teacher ?? '不明',
      year: Number(item?.year ?? 0),
      type: (item?.contents_type ?? item?.type ?? 'past') as 'past' | 'lecture',
      extensions,
      likes: Number(item?.likes ?? item?.stars ?? 0),
   };
};

export async function getAccountData(): Promise<AccountData | null> {
   // 認証用のCookieを取得
   const cookieStore = await cookies();
   const cookie = cookieStore.get('access_token')
      ? `access_token=${cookieStore.get('access_token')?.value}; refresh_token=${cookieStore.get('refresh_token')?.value}`
      : '';

   const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://api:3000'}/api/accounts/`,
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
   const liked = Array.isArray(data?.liked_contents) ? data.liked_contents.map(toSearchItem) : [];
   const mine = Array.isArray(data?.contents) ? data.contents.map(toSearchItem) : [];
   const accountData: AccountData = {
      email: data.user.email ?? '',
      myResources: mine,
      likedResources: liked,
   };
   return accountData;
}

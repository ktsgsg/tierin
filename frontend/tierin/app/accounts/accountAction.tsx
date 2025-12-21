'use server';

import { SearchItem } from '../search/types';
import { getAuthCookie, fetchSubjectByCode } from '@/lib/searchUtils';

export interface AccountData {
   email: string;
   likedResources: SearchItem[];
   myResources: SearchItem[];
}

// コンテンツAPIのレスポンス型
interface ContentItem {
   contents_id?: string;
   id?: string;
   title?: string;
   subject_code?: string;
   subject?: string;
   teacher?: string;
   year?: number;
   contents_type?: 'past' | 'lecture';
   type?: 'past' | 'lecture';
   extensions?: string | string[];
   likes?: number;
   stars?: number;
}

/**
 * コンテンツAPIの結果をSearchItemに変換する
 * subject_codeから科目情報を取得して、科目名と先生名を設定する
 */
const toSearchItem = async (item: ContentItem): Promise<SearchItem | null> => {
   const contentsId = String(item?.contents_id ?? item?.id ?? '');
   const extensions = Array.isArray(item?.extensions)
      ? item.extensions
      : typeof item?.extensions === 'string'
         ? item.extensions.split(',').filter(Boolean)
         : [];

   // 教科コードから教科情報を取得
   const subjectData = item?.subject_code
      ? await fetchSubjectByCode(item.subject_code)
      : null;

   return {
      contents_id: contentsId,
      title: item?.title ?? '不明なタイトル',
      url: `/preview/?contents_id=${contentsId}`,
      subject: subjectData?.name ?? item?.subject ?? '不明',
      teacher: subjectData?.teachers?.replace(/　/g, ' ') ?? item?.teacher ?? '不明',
      year: Number(item?.year ?? 0),
      type: (item?.contents_type ?? item?.type ?? 'past') as 'past' | 'lecture',
      extensions,
      likes: Number(item?.likes ?? item?.stars ?? 0),
   };
};

export async function getAccountData(): Promise<AccountData | null> {
   // 共通関数を使って認証用のCookieを取得
   const cookie = await getAuthCookie();

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

   // 各コンテンツを非同期で変換（教科情報を取得）
   const likedPromises = Array.isArray(data?.liked_contents)
      ? data.liked_contents.map(toSearchItem)
      : [];
   const minePromises = Array.isArray(data?.contents)
      ? data.contents.map(toSearchItem)
      : [];

   // 全ての非同期処理が完了するのを待つ
   const likedResults = await Promise.all(likedPromises);
   const mineResults = await Promise.all(minePromises);

   // nullを除去
   const liked = likedResults.filter((item): item is SearchItem => item !== null);
   const mine = mineResults.filter((item): item is SearchItem => item !== null);

   const accountData: AccountData = {
      email: data.user.email ?? '',
      myResources: mine,
      likedResources: liked,
   };
   return accountData;
}

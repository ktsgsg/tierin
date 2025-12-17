'use server';

import { cookies } from 'next/headers';

export interface Resource {
   id: number;
   title: string;
   subject: string;
   year: number;
   type: string;
}

export interface MyResource extends Resource {
   likes: number;
}

export interface AccountData {
   email: string;
   likedResources: Resource[];
   myResources: MyResource[];
}

export async function getAccountData(): Promise<AccountData | null> {
   // TODO: ここにAPI呼び出しを実装してください
   // 例:
   // const cookieStore = await cookies();
   // const accessToken = cookieStore.get('access_token')?.value;
   // 
   // if (!accessToken) {
   //    return null;
   // }
   //
   // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account`, {
   //    headers: {
   //       'Cookie': `access_token=${accessToken}`
   //    }
   // });
   //
   // if (!response.ok) {
   //    return null;
   // }
   //
   // return await response.json();
   const cookieStore = await cookies();
   // 仮のダミーデータを返す
   return {
      email: 'example@ccmailg.meijo-u.ac.jp',
      likedResources: [
         { id: 1, title: '微分積分 中間試験 過去問', subject: '微分積分', year: 2024, type: '過去問' },
         { id: 2, title: '線形代数 期末試験解答例', subject: '線形代数', year: 2023, type: '過去問' },
         { id: 3, title: 'プログラミング基礎 講義資料', subject: 'プログラミング基礎', year: 2024, type: '授業資料' },
      ],
      myResources: [
         { id: 1, title: '物理学実験 レポート例', subject: '物理学実験', year: 2024, type: '授業資料', likes: 12 },
         { id: 2, title: '化学基礎 小テスト解答', subject: '化学基礎', year: 2024, type: 'その他', likes: 8 },
      ],
   };
}

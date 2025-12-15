"use server";

import { cookies } from 'next/headers'

/**
 * フロントエンドで表示する検索結果アイテムの型
 */
type PreviewItem = {
   contents_id: string; // コンテンツID
   title: string; // 資料タイトル
   url: string; // 資料へのリンクURL
   subject: string | "不明"; // 教科名（取得できない場合は"不明"）
   teacher: string | "不明"; // 教員名（取得できない場合は"不明"）
   year: number; // 作成年度
   type: "past" | "lecture"; // 種別（過去問または授業資料）
   extensions: string[]; // 含まれるファイル拡張子の配列
   likes: number; // いいね数
};

/**
 * バックエンドAPIから返される検索結果の型
 */
type SearchResult = {
   title: string; // 資料タイトル
   contents_id: string; // コンテンツID
   subject_code: string; // 教科コード
   year: number; // 作成年度
   contents_type: "past" | "lecture"; // 種別
   extensions: string; // 拡張子（カンマ区切り文字列）
   stars: number; // いいね数
};

/**
 * 教科データの型
 */
type subjectData = {
   id: string; // 教科ID
   code: string; // 教科コード
   name: string; // 教科名
   place_and_time: string; // 場所と時間
   teachers: string; // 教員名
   url: string; // 教科URL
};

/**
 * 資料検索を実行するサーバーアクション
 * @param formData - 検索条件を含むフォームデータ
 * @returns 検索結果アイテムの配列を含むオブジェクト
 */
export async function searchAction(formData: FormData) {

   // フォームデータから検索条件を取得
   const title = formData.get("title") as string;
   const subject_code = formData.get("subject_code") as string;
   const year = formData.get("year") as string;
   const contents_type = formData.get("contents_type") as string;
   const subject_name = formData.get("subject") as string;
   const teacher = formData.get("teacher") as string;

   // URLクエリパラメータを構築（値がある項目のみ追加）
   const params = new URLSearchParams();
   if (title) params.append("title", title);
   if (subject_code) params.append("subject_code", subject_code);
   if (year) params.append("year", year);
   if (contents_type) params.append("contents_type", contents_type);
   if (subject_name) params.append("subject_name", subject_name);
   if (teacher) params.append("teacher", teacher);

   // 認証用のCookieを取得
   const cookieStore = await cookies()
   const cookie = cookieStore.get('access_token') ? `access_token=${cookieStore.get('access_token')?.value}; refresh_token=${cookieStore.get('refresh_token')?.value}` : '';

   // バックエンドAPIに検索リクエストを送信
   const response = await fetch('http://172.30.0.2:3000/api/search?' + params.toString(), {
      headers: {
         'Content-Type': 'application/json',
         'Cookie': cookie,
      },
   });

   // エラー時は空の結果を返す
   if (!response.ok) {
      return {
         items: [] as PreviewItem[],
      };
   }

   const data = await response.json();
   console.log('Search results:', data);
   console.log('params:', params.toString());

   // 各検索結果を非同期で変換（教科情報を取得してフロントエンド用の形式に整形）
   const itemsPromise = await data.map(async (item: SearchResult) => {
      // 教科コードから教科情報を取得
      const subjectdata: subjectData = await getSubject(item.subject_code, cookie);
      if (subjectdata) {
         // 教科情報が取得できなかったらパス
         // フロントエンド用のデータ形式に変換
         const view_item: PreviewItem = {
            contents_id: item.contents_id,
            title: item.title,
            url: "/preview/?contents_id=" + item.contents_id,
            subject: subjectdata.name,
            teacher: subjectdata.teachers.replace(/　/g, " "), // 全角スペースを半角に変換
            year: item.year,
            type: item.contents_type,
            extensions: item.extensions.split(','), // カンマ区切り文字列を配列に変換
            likes: item.stars,
         };
         return view_item;
      }
   });
   // 全ての非同期処理が完了するのを待つ
   const items: PreviewItem[] = await Promise.all(itemsPromise);
   // undefinedが混入する可能性があるため除去
   const filteredItems = items.filter((item): item is PreviewItem => item !== undefined);
   return {
      items: filteredItems,
   };


}

/**
 * 教科コードから教科情報を取得する関数
 * @param subject_code - 教科コード
 * @param cookie - 認証用Cookie
 * @returns 教科データ
 */
async function getSubject(subject_code: string, cookie: string): Promise<subjectData> {
   // バックエンドAPIから教科情報を取得
   const response = await fetch('http://172.30.0.2:3000/api/database/subject?code=' + subject_code, {
      headers: {
         'Content-Type': 'application/json',
         'Cookie': cookie,
      },
   });
   const data = await response.json();
   // 配列の最初の要素を返す
   return data[0];
}
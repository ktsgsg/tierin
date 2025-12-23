"use server";

import { SearchItem, SearchResultApi, SubjectData } from './types';
import { getApiHeaders, fetchSubjectByCode } from '@/lib/searchUtils';

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

   // 共通関数を使って認証ヘッダーを取得
   const headers = await getApiHeaders();

   // バックエンドAPIに検索リクエストを送信
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:3000'}/api/search?` + params.toString(), {
      headers,
   });

   // エラー時は空の結果を返す
   if (!response.ok) {
      return {
         items: [],
      };
   }

   const data = await response.json();

   // 各検索結果を非同期で変換（教科情報を取得してフロントエンド用の形式に整形）
   const itemsPromise = data.map(async (item: SearchResultApi) => {
      // 共通関数を使って教科コードから教科情報を取得
      const subjectdata: SubjectData | null = await fetchSubjectByCode(item.subject_code);
      if (subjectdata) {
         // フロントエンド用のデータ形式に変換
         const view_item: SearchItem = {
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
      return null;
   });
   // 全ての非同期処理が完了するのを待つ
   const items: (SearchItem | null)[] = await Promise.all(itemsPromise);
   // nullが混入する可能性があるため除去
   const filteredItems = items.filter((item): item is SearchItem => item !== null);
   return {
      items: filteredItems,
   };


}
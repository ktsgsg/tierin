import { SupabaseClient } from '@supabase/supabase-js';

/**
 * 検索パラメータの型定義
 */
export interface SearchParams {
   title?: string;
   subject_code?: string;
   year?: string;
   contents_type?: string;
   subject_name?: string;
   teacher?: string;
}

/**
 * 教科コードを取得する共通関数
 * @param supabase - Supabaseクライアント
 * @param params - 検索パラメータ
 * @returns 教科コードの配列、または undefined（パラメータが指定されていない場合）
 */
export async function getSubjectCodes(
   supabase: SupabaseClient,
   params: Pick<SearchParams, 'teacher' | 'subject_name' | 'subject_code'>
): Promise<string[] | undefined> {
   const { teacher, subject_name, subject_code } = params;

   // subject関連のパラメータが1つもなければスキップ
   if (!teacher && !subject_name && !subject_code) {
      return undefined;
   }

   let query = supabase.from('subjects').select('code');

   if (teacher) {
      query = query.ilike('teachers', `%${teacher}%`);
   }
   if (subject_name) {
      query = query.ilike('name', `%${subject_name}%`);
   }
   if (subject_code) {
      query = query.ilike('code', `%${subject_code}%`);
   }

   const { data, error } = await query;

   if (error) {
      console.error('Error fetching subject codes:', error);
      throw new Error('Failed to fetch subject codes: ' + error.message);
   }

   return data?.map((item: any) => item.code) ?? [];
}

/**
 * コンテンツを検索する共通関数
 * @param supabase - Supabaseクライアント
 * @param params - 検索パラメータ
 * @param subjectCodes - 教科コードの配列（オプション）
 * @returns 検索結果の配列
 */
export async function searchContents(
   supabase: SupabaseClient,
   params: SearchParams,
   subjectCodes?: string[]
) {
   const { title, year, contents_type } = params;

   let query = supabase
      .from('contents')
      .select('*')
      .order('posting_time', { ascending: false });

   if (title) {
      query = query.ilike('title', `%${title}%`);
   }
   if (year) {
      query = query.eq('year', year);
   }
   if (contents_type) {
      query = query.eq('contents_type', contents_type);
   }
   if (subjectCodes && subjectCodes.length > 0) {
      query = query.in('subject_code', subjectCodes);
   }

   const { data, error } = await query;

   if (error) {
      console.error('Error searching contents:', error);
      throw new Error('Failed to search contents: ' + error.message);
   }

   return data ?? [];
}

/**
 * 教科情報を検索する共通関数（サジェスト用）
 * @param supabase - Supabaseクライアント
 * @param params - 検索パラメータ
 * @param select - 取得するフィールド（デフォルト: '*'）
 * @returns 教科情報の配列
 */
export async function searchSubjects(
   supabase: SupabaseClient,
   params: { code?: string; name?: string; teachers?: string },
   select: string = '*'
) {
   // selectパラメータのバリデーション
   if (select !== '*') {
      const allowedFields = ['code', 'name', 'teachers', 'url'];
      const fields = select.split(',').map(field => field.trim());
      for (const field of fields) {
         if (!allowedFields.includes(field)) {
            throw new Error(`Invalid field in select: ${field}`);
         }
      }
   }

   const { code = '', name = '', teachers = '' } = params;

   const { data, error } = await supabase
      .from('subjects')
      .select(select)
      .like('code', `%${code}%`)
      .like('name', `%${name}%`)
      .like('teachers', `%${teachers}%`);

   if (error) {
      console.error('Error searching subjects:', error);
      throw new Error('Failed to search subjects: ' + error.message);
   }

   return data ?? [];
}

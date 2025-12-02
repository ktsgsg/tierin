import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { useSupabase } from '../hooks/supabase/useSupabase.js'

export const search = new Hono()

search.get('/', async (c) => {
  console.log('Search page accessed')

  try {
    const { supabase } = useSupabase()
    
    /*// フォームデータを取得して処理する
    contents ={ 
      'contents_id': "", // ランダムなIDを生成,認識しやすいようにUUIDを使う
      'title': "", // タイトル ユニークでなくてもよし
      'user_id': "", // ユーザID(未実装)
      'subject_code': "", // 科目コード
      'year': "", // 年度
      'posting_time': "", // 投稿時間 現在時刻
      'contents_type': "", // このコンテンツの種類
      'extensions': "", // アップロードされたファイルの拡張子リスト
      'resources': [] // アップロードされたファイルの情報(名前)
    }*/

    // クエリパラメータを取得（存在しない場合は undefined）
    const titleParam = c.req.query('title')
    const subjectCodeParam = c.req.query('subject_code')
    const yearParam = c.req.query('year')
    const typeParam = c.req.query('contents_type')
    const subjectNameParam = c.req.query('subject_name')
    const teacherParam = c.req.query('teacher')

    // subject_codeをsubject関連のqueryが一つでもあれば取得
    let subject_codes: string[] | undefined
    if (teacherParam || subjectNameParam || subjectCodeParam) {
      let subjQuery: any = supabase.from('subjects').select('code')
      if (teacherParam) subjQuery = subjQuery.ilike('teachers', `%${teacherParam}%`)
      if (subjectNameParam) subjQuery = subjQuery.ilike('name', `%${subjectNameParam}%`)
      if (subjectCodeParam) subjQuery = subjQuery.ilike('code', `%${subjectCodeParam}%`)

      const { data: subjData, error: subjError } = await subjQuery
      if (subjError) {
        console.error('Supabase error (subjects):', subjError)
        return c.text('Supabase error occurred:' + subjError.message)
      }
      subject_codes = subjData?.map((item: any) => item.code) ?? []
    }

    // contentsをqueryに合うデータのみ取得
    let contentsQuery: any = supabase.from('contents').select('*').order('posting_time', { ascending: false })
    if (titleParam) contentsQuery = contentsQuery.ilike('title', `%${titleParam}%`)
    if (yearParam) contentsQuery = contentsQuery.eq('year', yearParam)
    if (typeParam) contentsQuery = contentsQuery.eq('contents_type', typeParam)
    if (subject_codes && subject_codes.length > 0) contentsQuery = contentsQuery.in('subject_code', subject_codes)

    const { data, error } = await contentsQuery
    if (error) {
      console.error('Supabase error (contents):', error)
      return c.text('Supabase error occurred:' + error.message)
    }

    return c.json(data ?? [])

  } catch (err: any) {
    console.error('Unexpected error:', err)
    return c.text("Unexpected error occurred:" + err.message)
  }
})


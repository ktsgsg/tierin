import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { useSupabase } from '../hooks/supabase/useSupabase.js'
import { getSubjectCodes, searchContents } from '../utils/searchUtils.js'
import type { SearchParams } from '../utils/searchUtils.js'

export const search = new Hono()

search.get('/', async (c) => {
  console.log('Search page accessed')

  try {
    const { supabase } = useSupabase()

    // クエリパラメータを取得して SearchParams 型に変換
    const params: SearchParams = {
      title: c.req.query('title'),
      subject_code: c.req.query('subject_code'),
      year: c.req.query('year'),
      contents_type: c.req.query('contents_type'),
      subject_name: c.req.query('subject_name'),
      teacher: c.req.query('teacher'),
    }

    // 共通関数を使って教科コードを取得
    const subject_codes = await getSubjectCodes(supabase, {
      teacher: params.teacher,
      subject_name: params.subject_name,
      subject_code: params.subject_code,
    })

    // 共通関数を使ってコンテンツを検索
    const data = await searchContents(supabase, params, subject_codes)

    return c.json(data)

  } catch (err: any) {
    console.error('Unexpected error:', err)
    return c.text("Unexpected error occurred:" + err.message, 500)
  }
})


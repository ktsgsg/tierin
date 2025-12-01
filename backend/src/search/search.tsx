import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { useSupabase } from '../hooks/supabase/useSupabase.js'

export const search = new Hono()

search.get('/', async (c) => {
  console.log('Search page accessed')

  try {
    const { supabase } = useSupabase()
    
    const query = c.req.query('q')

    const { data, error } = await supabase.from('contents').select('*').limit(100)

    if (error) {
      console.error('Supabase error:', error)
      return c.text("Supabase error occurred:" + error.message)
    }

    if (Array.isArray(data) && data.length > 0) {
      return c.json(data)
    } else {
      return c.text("No data found" + query)
    }

  } catch (err: any) {
    console.error('Unexpected error:', err)
    return c.text("Unexpected error occurred:" + err.message)
  }
})

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


import {Hono} from 'hono'
import { use, type FC } from 'hono/jsx'
import {useSupabase} from '../hooks/supabase/useSupabase.js';

export const about = new Hono()

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  )
}

const Top: FC<{ messages: string[] }> = (props: {
  messages: string[]
}) => {
  return (
    <Layout>
      <h1>ちえりんについて</h1>
      <p>ちえりんは、学校・資格・各種試験の過去問を利用者同士で共有・検索できるデータベースです。問題・解答・解説を蓄積し、学習を支援します。</p>
      <h2>主な特徴</h2>
      <ul>
        <li>キーワード・年度・カテゴリで過去問を検索できます。</li>
        <li>ユーザーが問題・解答・解説を投稿して共有できます。</li>
        <li>タグやフィルタで目的の問題を絞り込めます。</li>
      </ul>
      <h2>使い方（簡単）</h2>
      <ol>
        <li>検索ボックスまたはカテゴリから過去問を探す。</li>
        <li>問題を選んで解答・解説を確認する。</li>
        <li>アカウントを作成して、自分の過去問や解説を投稿する（任意）。</li>
      </ol>
      <h2>利用上の注意</h2>
      <p>著作権のある教材や公式問題を無断で転載しないでください。著作権侵害が疑われる投稿は削除されることがあります。投稿内容は投稿者の責任です。</p>
      <footer>
        <p>まずは検索をお試しください。アカウントを作成すると投稿やお気に入り管理ができます。</p>
        <div>
          <a href="/search" style={{ margin: 20 }}>過去問を検索</a>
          <a href="/signup" style={{ margin: 20 }}>アカウント作成</a>
        </div>
      </footer>
    </Layout>
  )
}

about.get('/', (c) => {
  const messages = ['Good Morning', 'Good Evening', 'Good Night']
  return c.html(<Top messages={messages} />)
})

about.get('/test', (c) => {
  const name = c.req.query('name') || 'Anonymous';
  const supabase = useSupabase().supabase;

  supabase
    .from('test')
    .insert({name: name }).then(({ data, error }) => {
      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log('Data inserted successfully:', name);
      }
    })

  return c.text('Add your name to the table')
})
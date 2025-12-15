import { Hono } from 'hono';
import * as fs from "node:fs/promises";
import * as crypt from "node:crypto";

import { useSupabase } from '../hooks/supabase/useSupabase.js';

export const posting = new Hono()

posting.post('/', async (c) => {

   let resources: string[] = [];
   let filenames: string[] = [];

   const formData = await c.req.formData()// フォームデータを取得
   //データの拡張子をチェックして，許可されたものだけ処理する
   const allowedTypes = ['video/mp4', 'image/png', 'image/jpeg', 'audio/mpeg', 'application/pdf'];
   const invalidFiles = (formData.getAll("file") as File[]).filter(file => !allowedTypes.includes(file.type));
   if (invalidFiles.length > 0) {
      return c.json({ error: "許可されていないファイル形式が含まれています。" }, 400);
   }
   //コンテンツ内の拡張子をリスト化
   const contentExtensions = (formData.getAll("file") as File[]).map(file => {
      const parts = file.name.split('.');
      return parts.length > 1 ? parts.pop()?.toLowerCase() : '';
   });
   //重複を除去
   const uniqueExtensions = Array.from(new Set(contentExtensions));
   console.log("Uploaded file extensions:", uniqueExtensions);

   const files = formData.getAll("file") as File[];// ファイルをすべて取得
   // アップロードされたファイルを保存
   files.forEach(file => {
<<<<<<< HEAD
      const resource = crypt.randomUUID() + '.' + file.name.split('.').pop();
      // 元のファイル名も保存
      const filename = file.name;
      filenames.push(filename);

      fs.writeFile("./storage/resources/"+resource,file.stream());
      resources.push(resource);
=======
      const filename = crypt.randomUUID() + "_" + file["name"];
      fs.writeFile("./storage/resources/" + filename, file.stream());
      resources.push(filename);
>>>>>>> develop
   });

   // フォームデータを取得して処理する
   const contents = {
      'contents_id': crypt.randomUUID(), // ランダムなIDを生成,認識しやすいようにUUIDを使う
      'title': formData.get("title"), // タイトル ユニークでなくてもよし
      'user_id': formData.get("userid") || 'anonymous', // とりあえず匿名ユーザーで
      'subject_code': formData.get("subject_code") || '0000', // 科目コード 仮で0
      'year': formData.get("year"), // 年度
      'posting_time': new Date().toISOString(), // 投稿時間 現在時刻
      'contents_type': formData.get("contents_type"), // このコンテンツの種類
<<<<<<< HEAD
      'extensions': contentExtensions, // アップロードされたファイルの拡張子リスト
      'resources': resources, // アップロードされたファイルの情報(実際のパス)
      'filenames': filenames // 元のファイル名リスト
=======
      'extensions': uniqueExtensions, // アップロードされたファイルの拡張子リスト
      'resources': resources // アップロードされたファイルの情報
>>>>>>> develop
   }

   //contentをDBに保存する
   const supabase = useSupabase().supabase;
   const { data, error } = await supabase
      .from('contents')
      .insert({
         'posting_time': contents.posting_time,
         'title': contents.title as string,
         'user_id': contents.user_id,
         'subject_code': contents.subject_code,
         'year': contents.year as string,
         'contents_id': contents.contents_id,
         'extensions': uniqueExtensions.toString(),
         'contents_type': contents.contents_type as string,
      });
   if (error) {
      console.error('Error inserting posting metadata:', error);
      return c.json({ error: "DBへの保存に失敗しました。" }, 500);
   }

   //contentを./storage/meta/uuid.jsonとして保存する
   await fs.writeFile("./storage/meta/" + contents.contents_id + ".json", JSON.stringify(contents, null, 2));
   // 結果を返す
   return c.json(contents);
})
posting.get('/', (c) => {
   return c.html(
      <body>
         <h1>Posting Search Test Page</h1>
         <p>This is a test page for posting search functionality.</p>
         <form method="post" action="http://localhost:3000/api/posting/" enctype="multipart/form-data">
            <label for="title">タイトル</label>
            <input type="text" id="title" name="title" /><br />
            <label for="subject">科目名</label>
            <input type="text" id="subject" name="subject" /><br />
            <label for="teacher">担任</label>
            <input type="text" id="teacher" name="teacher" /><br />
            <label for="year">年度</label>
            <input type="text" id="year" name="year" /><br />
            <p>資料の種類<br />
               <input type="radio" name="contents_type" value="old_exam" checked />過去問
               <input type="radio" name="contents_type" value="subject_resume" />授業資料
               <input type="radio" name="contents_type" value="other" />その他
            </p>
            <div>とりあえず4つ送れるようにした，フロントエンド側で操作してもっとたくさんのファイルを送れるようにする</div>
            <input type="file" id="file" name="file" accept='video/mp4 image/png image/jpeg application/pdf' /><br />
            <input type="file" id="file" name="file" accept='video/mp4 image/png image/jpeg application/pdf' /><br />
            <input type="file" id="file" name="file" accept='video/mp4 image/png image/jpeg application/pdf' /><br />
            <input type="file" id="file" name="file" accept='video/mp4 image/png image/jpeg application/pdf' /><br />
            <input type="submit" value="Search" /><br />
         </form>
      </body>
   );
})
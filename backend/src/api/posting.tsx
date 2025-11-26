import { Hono } from 'hono';
import * as fs from "node:fs/promises";
import * as crypt from "node:crypto";

export const posting = new Hono()

posting.post('/', async(c) => {
   
   let contents: string[] = [];

   const formData = await c.req.formData()// フォームデータを取得
   const files = formData.getAll("file") as File[];// ファイルをすべて取得

   // アップロードされたファイルを保存
   files.forEach(file => {
      const filename = crypt.randomUUID() + "_" + file["name"];
      fs.writeFile("./storage/resource/"+filename,file.stream());
      contents.push(filename);
   });
   // フォームデータを取得して処理する
   const content ={ 
      'contents_id': crypt.randomUUID(), // ランダムなIDを生成,認識しやすいようにUUIDを使う
      'title': formData.get("title"), // タイトル ユニークでなくてもよし
      'user_id': 'anonymous', // とりあえず匿名ユーザーで
      'subject_code': '0000', // 科目コード 仮で0
      'year': formData.get("year"), // 年度
      'posting_time': new Date().toISOString(), // 投稿時間 現在時刻
      'contents': contents // アップロードされたファイルの情報
   }
   //contentをDBに保存する処理を書くべきだが，とりあえず保留

   //contentを./storage/meta/uuid.jsonとして保存する
   await fs.writeFile("./storage/meta/"+content.contents_id+".json",JSON.stringify(content, null, 2));
   // 結果を返す
   return c.json(content);
})
posting.get('/', (c) => {
   return c.html(
      <body>
         <h1>Posting Search Test Page</h1>
         <p>This is a test page for posting search functionality.</p>
         <form method="post" action="http://localhost:3000/api/posting/" enctype="multipart/form-data">
            <label for="title">タイトル</label>
            <input type="text" id="title" name="title"/><br/>
            <label for="subject">科目名</label>
            <input type="text" id="subject" name="subject"/><br/>
            <label for="teacher">担任</label>
            <input type="text" id="teacher" name="teacher"/><br/>
            <label for="year">年度</label>
            <input type="text" id="year" name="year"/><br/>
            <div>とりあえず4つ送れるようにした，フロントエンド側で操作してもっとたくさんのファイルを送れるようにする</div>
            <input type="file" id= "file" name="file" accept='video/mp4 image/png image/jpeg audio/mpeg pdf'/><br/>
            <input type="file" id= "file" name="file" accept='video/mp4 image/png image/jpeg audio/mpeg pdf'/><br/>
            <input type="file" id= "file" name="file" accept='video/mp4 image/png image/jpeg audio/mpeg pdf'/><br/>
            <input type="file" id= "file" name="file" accept='video/mp4 image/png image/jpeg audio/mpeg pdf'/><br/>
            <input type="submit" value="Search" /><br/>
         </form>
      </body>
   );
})
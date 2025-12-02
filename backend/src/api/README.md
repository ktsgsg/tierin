**suggest API (`suggest.tsx`) の使い方**

概要
- `suggest.tsx` は候補サジェスト用の API を提供します。現在は `GET /api/suggest/subject` エンドポイントが実装されており、`subjects` テーブルを部分一致（LIKE）検索して結果を返します。

エンドポイント
- `GET /api/suggest/subject`

クエリパラメータ
- `select` (任意): 返却するフィールド。デフォルト `*`。許可されるフィールドは `code`, `name`, `teachers`, `url` のみです（不正なフィールドを指定すると 400 を返します）。複数指定はカンマ区切り。
- `code` (任意): `subjects.code` に対する部分一致（LIKE `%{code}%`）。
- `name` (任意): `subjects.name` に対する部分一致（LIKE `%{name}%`）。
- `teachers` (任意): `subjects.teachers` に対する部分一致（LIKE `%{teachers}%`）。

レスポンス
- 成功: HTTP 200 と JSON 配列。各要素は `select` で指定したカラムを含みます。
- エラー: 不正な `select` 指定 → HTTP 400。Supabase クエリエラー等 → HTTP 500 とエラーメッセージ。

例
- 全件取得（注意: テーブルが大きいと重い）
	- `GET /api/suggest/subject?select=*`
- 教科名に "数学" を含む行の `code` と `name` を取得
	- `GET /api/suggest/subject?select=code,name&name=数学`
- 先生名に "佐藤" を含む行を取得
	- `GET /api/suggest/subject?teachers=佐藤`

クライアント実装の注意点（サジェスト用途）
- 候補数が多い場合は全件取得ではなく、クライアントからの入力に応じてサーバー側で絞る設計（例: `/api/suggest/subject?name=た`）がおすすめです。
- 入力イベントはデバウンス（200〜300ms）して不要なリクエストを抑えてください。
- 最小入力長（例: 2 文字）を設けると不要な負荷を防げます。

前提 / 環境
- `suggest.tsx` は `useSupabase()` を使って Supabase クライアントを取得します。環境変数（`SUPABASE_URL` / `SUPABASE_ANON_KEY` 等）が正しく設定されている必要があります。`useSupabase.ts` の実装を参照してください。

セキュリティ & 運用メモ
- パブリックに叩けるエンドポイントの場合はレート制限を検討してください。
- 機密性の高いデータを返す場合は認可チェックを追加してください。

拡張案
- 複合検索（`q` パラメータで code/name/teachers を横断検索）や、返却件数制限（`limit`）を追加することができます。
- 高速化が必要な場合は Supabase 側でインデックスを張るか、全文検索サービス（Elasticsearch / pg_trgm）を検討してください。

以上を README に追記しました。


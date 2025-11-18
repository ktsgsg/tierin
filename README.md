**起動方法 (Node - ローカル実行)**

現在は `docker compose` を使わない方針とのことなので、ローカルの `node` で起動する手順をここに記載します。

作業はプロジェクト内の `tierin` ディレクトリで行ってください（このリポジトリは `tierin/tierin` にフロントエンド実装が入っています）。

前提
- Node.js >= 18 を推奨
- npm が使用可能（Node に同梱）

セットアップ

```bash
cd tierin
npm install
```

環境変数
- ルートの `tierin` ディレクトリ内に `.env` を用意してください。`src/hooks/supabase/useSupabase.ts` が以下の環境変数を参照します:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

開発モード（ホットリロード）

```bash
npm run dev
```

- `npm run dev` は `tsx watch src/index.tsx` を実行します。起動後、`http://localhost:3000` を開いて確認してください。

本番（簡易）

```bash
npm run build
npm run start
```

- `npm run build` は `tsc` を実行し、`dist/index.js` を生成します。`npm run start` は `node dist/index.js` を実行します。

よくあるトラブル
- `.env` のキーが不足していると起動時にエラーになります。`SUPABASE_URL` と `SUPABASE_ANON_KEY` を確認してください。
- `npm run dev` が動作しない場合は `node` と `npm` のバージョン、`tsx` がインストールされているか確認してください。

補足
- 既存の `docker-compose.yml` や `init.sql` を使った起動はここでは触れていません。将来的に Docker で一貫した環境を作る場合は別途手順を追加できます。

クイックコマンドまとめ

```bash
cd tierin
npm install
# .env を作る（例）
cat > .env <<'EOF'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
EOF

# 開発
npm run dev

# 本番ビルド + 起動
npm run build
npm run start
```

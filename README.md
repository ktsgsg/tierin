# tierin — 起動手順

## 前提
- Docker と Docker Compose プラグイン（`docker compose`）がインストールされていること
- リポジトリルートで操作すること（この README の場所）

## 使い方（簡単）
1. イメージをビルドしてコンテナをバックグラウンドで起動（本番風）
   ```
   docker compose up -d --build
   ```

2. 停止・削除
   ```
   docker compose down
   ```

## 開発モード（ホットリロード）
ソースをホストからコンテナへマウントしているため、ローカル編集で即反映させたい場合は dev サーバーを使います。
```
# サービスに対して開発コマンドを一時実行（ホットリロード）
docker compose run --service-ports --rm nextapp sh -c "npm run dev"
```
または compose 定義を一時的に書き換えて `command: npm run dev` にして `docker compose up --build` しても可。

## 本番風起動（.next をイメージ内でビルドして起動）
bind mount を使わずイメージ内のビルド成果物を使う場合（推奨: 本番運用）
1. docker compose の `nextapp` でボリューム（./tierin:/tierin）を外す
2. ビルド・起動:
   ```
   docker compose build nextapp
   docker compose up -d nextapp
   ```

## よく使うコマンド
- ログを追う: `docker compose logs -f`
- 特定サービスのログ: `docker compose logs -f nextapp`
- コンテナに入る: `docker compose exec nextapp sh`
- ビルドのみ: `docker compose build`
- イメージ再ビルド（キャッシュ無視）: `docker compose build --no-cache`

## トラブルシュート
- "Could not find a production build in the '.next' directory" → イメージ内で `next build` が走っていない、またはホストの bind mount によってイメージ内の `.next` が上書きされている可能性があります。開発時は `npm run dev` を使うか、本番では bind mount を外してイメージ内でビルドしてください。

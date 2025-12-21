# 検索システムのリファクタリング

## 概要

資料検索システムとサジェスト機能で共通のロジックを抽出し、コードの重複を削減しました。

## 共通化したファイル

### バックエンド

**`/backend/src/utils/searchUtils.ts`** - バックエンドの共通検索関数
- `getSubjectCodes()` - 教科コードを取得
- `searchContents()` - コンテンツを検索
- `searchSubjects()` - 教科情報を検索（サジェスト用）
- `SearchParams` - 検索パラメータの型定義

### フロントエンド

**`/frontend/tierin/lib/searchUtils.ts`** - フロントエンドの共通検索関数
- `getAuthCookie()` - 認証用Cookie取得
- `getApiHeaders()` - APIリクエストのヘッダー取得
- `fetchSubjectByCode()` - 教科コードから教科情報を取得
- `fetchSubjects()` - 教科情報を検索
- `fetchSubjectSuggestions()` - サジェスト用の教科情報を取得

## 変更されたファイル

### バックエンドAPI

1. **`/backend/src/api/search.tsx`**
   - `getSubjectCodes()` と `searchContents()` を使用
   - コード量を約60%削減

2. **`/backend/src/api/suggest.tsx`**
   - `searchSubjects()` を使用
   - バリデーションロジックも共通化

### フロントエンドアクション

1. **`/frontend/tierin/app/search/searchAction.tsx`**
   - `getApiHeaders()` と `fetchSubjectByCode()` を使用
   - 元の `getSubject()` 関数を削除

2. **`/frontend/tierin/app/components/suggest.tsx`**
   - `fetchSubjects()` を使用
   - Cookie取得処理を共通化

3. **`/frontend/tierin/app/preview/previewAction.tsx`**
   - `getAuthCookie()` を使用

4. **`/frontend/tierin/app/post/postAction.tsx`**
   - `getAuthCookie()` を使用

5. **`/frontend/tierin/app/accounts/accountAction.tsx`**
   - `getAuthCookie()` を使用

## メリット

### 1. コードの重複削減
- Cookie取得処理が複数のファイルで重複していたのを1箇所に集約
- 検索ロジックが重複していたのを共通関数化

### 2. 保守性の向上
- 検索ロジックの変更が1箇所で済む
- バグ修正が全体に反映される

### 3. 型安全性の向上
- `SearchParams` 型で検索パラメータを統一
- TypeScriptの型チェックが効く

### 4. テスタビリティの向上
- 小さな関数に分割されているため、単体テストが書きやすい

## 使用例

### バックエンド

```typescript
import { getSubjectCodes, searchContents, SearchParams } from '../utils/searchUtils.js'

const params: SearchParams = {
  title: 'データベース',
  subject_name: '情報',
  year: '2024',
}

const subjectCodes = await getSubjectCodes(supabase, params)
const results = await searchContents(supabase, params, subjectCodes)
```

### フロントエンド

```typescript
import { getApiHeaders, fetchSubjectByCode } from '@/lib/searchUtils'

// 認証ヘッダーを取得
const headers = await getApiHeaders()

// 教科情報を取得
const subject = await fetchSubjectByCode('INFO101')
```

## 今後の改善案

1. **キャッシング**
   - 教科情報のキャッシュ機能を追加
   - 同じ教科コードの重複リクエストを削減

2. **エラーハンドリング**
   - より詳細なエラー情報を返す
   - リトライ機能の追加

3. **パフォーマンス**
   - バッチ処理での教科情報取得
   - 並列リクエストの最適化

4. **テスト**
   - 共通関数の単体テストを追加
   - 統合テストの作成

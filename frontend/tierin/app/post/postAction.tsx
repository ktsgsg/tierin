"use server"
import { getSubjectsCode } from '@/app/components/suggest';
import { GetEmailHeader } from '@/app/components/headerAction';
import { cookies } from 'next/headers';
import { getAuthCookie } from '@/lib/searchUtils';

// アップロード結果の型
export type PostResult = {
  success: boolean;
  error?: string;
  errorType?: 'payload_too_large' | 'unauthorized' | 'server_error' | 'unknown';
};

export async function postAction(formData: FormData): Promise<PostResult> {
  const files = formData.getAll("file") as File[];
  const postTitle = formData.get("title") as string;
  const year = formData.get("year") as string;
  const type = formData.get("contents_type") as string;
  const subject_code = formData.get("subject_code") as string;

  //useridを
  const postId = await GetEmailHeader() || "unknown_user";

  // ファイルサイズの事前チェック（50MB制限）
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB

  let totalSize = 0;
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `ファイル "${file.name}" のサイズが大きすぎます（${Math.round(file.size / 1024 / 1024)}MB）。各ファイルは50MB以下にしてください。`,
        errorType: 'payload_too_large'
      };
    }
    totalSize += file.size;
  }

  if (totalSize > MAX_TOTAL_SIZE) {
    return {
      success: false,
      error: `合計ファイルサイズが大きすぎます（${Math.round(totalSize / 1024 / 1024)}MB）。合計100MB以下にしてください。`,
      errorType: 'payload_too_large'
    };
  }

  // フォームデータをバックエンドAPIに送信
  const postData = new FormData();
  postData.append("title", postTitle);
  postData.append("userid", postId);
  postData.append("year", year);
  postData.append("contents_type", type);
  postData.append("subject_code", subject_code);

  files.forEach((file) => postData.append("file", file));


  // 共通関数を使って認証用のCookieを取得
  const cookie = await getAuthCookie();
  console.log("Posting data:", postData);

  try {
    // バックエンドAPIに検索リクエストを送信
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:3000'}/api/posting/`, {
      headers: {
        'Cookie': cookie,
      },
      method: 'POST',
      body: postData,
    });

    // ステータスコードによるエラーハンドリング
    if (response.status === 413) {
      return {
        success: false,
        error: 'ファイルサイズが大きすぎます。ファイルを小さくするか、分割してアップロードしてください。',
        errorType: 'payload_too_large'
      };
    }

    if (response.status === 401) {
      return {
        success: false,
        error: '認証に失敗しました。再度ログインしてください。',
        errorType: 'unauthorized'
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData?.message || 'サーバーエラーが発生しました。しばらくしてから再度お試しください。',
        errorType: 'server_error'
      };
    }

    console.log("Response status:", await response.json());
    return { success: true };

  } catch (err) {
    console.error('Upload error:', err);

    // ネットワークエラーの場合（大容量ファイルでタイムアウトなど）
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return {
        success: false,
        error: 'ネットワークエラーが発生しました。ファイルサイズが大きすぎる可能性があります。',
        errorType: 'payload_too_large'
      };
    }

    return {
      success: false,
      error: '予期しないエラーが発生しました。',
      errorType: 'unknown'
    };
  }
}
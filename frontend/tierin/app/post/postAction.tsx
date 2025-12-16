"use server"
import { getSubjectsCode } from '@/app/components/suggest';
import { GetEmailHeader } from '@/app/components/headerAction';
import { cookies } from 'next/headers';

export async function postAction(formData: FormData) {
  const files = formData.getAll("file") as File[];
  const postTitle = formData.get("title") as string;
  const year = formData.get("year") as string;
  const type = formData.get("contents_type") as string;
  const subject_code = formData.get("subject_code") as string;

  //useridを
  const postId = await GetEmailHeader() || "unknown_user";

  // フォームデータをバックエンドAPIに送信
  const postData = new FormData();
  postData.append("title", postTitle);
  postData.append("userid", postId);
  postData.append("year", year);
  postData.append("contents_type", type);
  postData.append("subject_code", subject_code);

  files.forEach((file) => postData.append("file", file));


  // 認証用のCookieを取得
  const cookieStore = await cookies()
  const cookie = cookieStore.get('access_token') ? `access_token=${cookieStore.get('access_token')?.value}; refresh_token=${cookieStore.get('refresh_token')?.value}` : '';
  console.log("Posting data:", postData);
  // バックエンドAPIに検索リクエストを送信
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:3000'}/api/posting/`, {
    headers: {
      'Cookie': cookie,
    },
    method: 'POST',
    body: postData,
  });
  console.log("Response status:", await response.json());


}
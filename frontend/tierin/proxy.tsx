// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

export async function proxy(request: NextRequest) {
   // Middleware のロジック本体を記述する
   if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
      return NextResponse.next(); // ログインページへのアクセスは許可
   }
   // 認証状態を確認
   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:3000'}/api/getsession/`, {
      headers: request.headers,
   });
   //ログインしていなかったらログインページへリダイレクト
   if (response.status === 401) {// 未認証の場合
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
   }
   //cookieを更新
   const data = await response.json();
   //console.log('Middleware session data:', data);
   try {
      if (data.session.accsess_token) {
         const cookiesStore = await cookies();
         cookiesStore.set('access_token', data.session.access_token, {
            httpOnly: true,
            expires: new Date(Date.now() + data.session.expires_at),
         });
         cookiesStore.set('refresh_token', data.session.refresh_token, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日間有効
         });
      }
   } catch (error) {
      console.log('accsess_token is no need to update.');
   }

   //メールアドレスを取得
   const cooliesStore = await cookies();
   const access_token = cooliesStore.get('access_token')?.value || '';
   if (!access_token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
   }
   const supabaseResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api:3000'}/api/getsession/`, {
      headers: {
         'Content-Type': 'application/json',
         'Cookie': `access_token=${access_token}`,
      }
   });
   const supabaseData = await supabaseResponse.json();
   // ユーザーメールアドレスをリクエストヘッダーに追加
   const requestHeaders = new Headers(request.headers);
   requestHeaders.set('X-User-Email', supabaseData.user.email);

   return NextResponse.next({
      request: {
         headers: requestHeaders,
      }
   });
}

// Middlewareを実行するパスを指定
export const config = {
   matcher: [
      '/((?!.*\\..*|_next).*)'
   ],
};
// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

export async function middleware(request: NextRequest) {
   // Middleware のロジック本体を記述する
   const response = await fetch('http://api:3000/api/getsession/', {
      headers: request.headers,
   });
   if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
      return NextResponse.next(); // ログインページへのアクセスは許可
   }
   // 認証状態を確認
   //ログインしていなかったらログインページへリダイレクト
   if (response.status === 401) {// 未認証の場合
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
   }
   //cookieを更新
   const data = await response.json();
   const cookiesStore = await cookies();
   cookiesStore.set('access_token', data.session.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + data.session.expires_at),
   });
   cookiesStore.set('refresh_token', data.session.refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日間有効
   });
   return NextResponse.next(); // 以降の処理を継続する
}

// Middlewareを実行するパスを指定
export const config = {
   matcher: [
      '/((?!.*\\..*|_next).*)'
   ],
};
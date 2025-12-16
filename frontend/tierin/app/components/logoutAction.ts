'use server';

import { cookies } from 'next/headers';

export async function logoutAction() {
   const cookieStore = await cookies();

   // クッキーを削除
   cookieStore.delete('access_token');
   cookieStore.delete('refresh_token');

   return { success: true };
}

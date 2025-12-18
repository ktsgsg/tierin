import { Hono } from 'hono';
import * as fs from "node:fs/promises";
import * as crypt from "node:crypto";
import { setCookie, getCookie } from 'hono/cookie'

import { useSupabase } from '../hooks/supabase/useSupabase.js';

export const accounts = new Hono()

accounts.get('/', async (c) => {
   const supabase = c.get('supabase');
   const auth_token = getCookie(c, 'access_token');

   const user = await supabase.auth.getUser(auth_token);
   const { data, error } = await supabase.from('contents').select('*').eq('user_id', user.data.user?.email);

   if (error) {
      console.error('Supabase error (accounts):', error);
      return c.json({ error: 'Supabase error occurred:' + error.message }, 500);
   }

   //後の実装で，いいねしたコンテンツも返すようにする.

   return c.json({ user: user.data.user, contents: data });
});

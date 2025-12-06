import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie'

import { useSupabase } from '../hooks/supabase/useSupabase.js';

export const getsession = new Hono()

getsession.get('/', async (c) => {
   const supabase = c.get('supabase');
   const { data, error } = await supabase.auth.refreshSession({
      refresh_token: getCookie(c, 'refresh_token') || '',
   });
   if (error) {
      return c.json({ error: error.message }, 400);
   }
   return c.json(data);
});
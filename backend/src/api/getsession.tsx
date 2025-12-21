import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie'
import { SupabaseClient } from '@supabase/supabase-js';

export const getsession = new Hono()

getsession.get('/', async (c) => {
   const access_token = getCookie(c, 'access_token');
   const supabase: SupabaseClient = c.get('supabase');
   const { data, error } = await supabase.auth.getUser(access_token);
   return c.json(data);
});
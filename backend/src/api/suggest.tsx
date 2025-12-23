import { Hono } from 'hono';

import { useSupabase } from '../hooks/supabase/useSupabase.js';
import { searchSubjects } from '../utils/searchUtils.js';

export const suggest = new Hono()

suggest.get('/subject', async (c) => {
   try {
      const supabase = useSupabase().supabase;
      const select = c.req.query('select') || '*';
      const code = c.req.query('code') || '';
      const name = c.req.query('name') || '';
      const teachers = c.req.query('teachers') || '';

      // 共通関数を使って教科情報を検索
      const data = await searchSubjects(
         supabase,
         { code, name, teachers },
         select
      );

      return c.json(data);
   } catch (err: any) {
      console.error('Error in suggest/subject:', err);
      return c.json({ error: err.message }, err.message.includes('Invalid field') ? 400 : 500);
   }
});
import { Hono } from 'hono';

import { useSupabase } from '../hooks/supabase/useSupabase.js';

export const suggest = new Hono()

suggest.get('/subject', async (c) => {
   const supabase = useSupabase().supabase;
   const select = c.req.query('select') || '*';
   const code = c.req.query('code') || '';
   const name = c.req.query('name') || '';
   const teachers = c.req.query('teachers') || '';

   if (select !== '*') {
      const allowedFields = ['code', 'name', 'teachers', 'url'];
      const fields = select.split(',').map(field => field.trim());
      for (const field of fields) {
         if (!allowedFields.includes(field)) {
            return c.json({ error: `Invalid field in select: ${field}` }, 400);
         }
      }
   }

   const { data, error } = await supabase.from('subjects').select(select).like('code', `%${code}%`).like('name', `%${name}%`).like('teachers', `%${teachers}%`);
   if (error) {
      return c.json({ error: error.message }, 500);
   }
   return c.json(data);
});
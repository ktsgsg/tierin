import { Hono } from 'hono'
import * as fs from "node:fs/promises";
import { useSupabase } from '../hooks/supabase/useSupabase.js'

export const preview = new Hono()

preview.get('/contents', async (c) => {
   const supabase = useSupabase().supabase;
   const contents_id = c.req.query('contents_id');
   if (!contents_id) {
      return c.json({ error: 'contents_id is required' }, 400);
   }
   // Fetch content metadata from the database
   const { data, error } = await supabase
      .from('contents')
      .select('*')
      .eq('contents_id', contents_id)
      .single();

   if (error) {
      return c.json({ error: error.message }, 500);
   }

   if (!data) {
      return c.json({ error: 'Content not found' }, 404);
   }
   // Read additional metadata from the filesystem
   try {
      const metadata = await fs.readFile("./storage/meta/" + contents_id + ".json", 'utf-8');
      if (!metadata) {
         return c.json({ error: 'Metadata is empty' }, 404);
      }
      return c.json({ ...data, metadata: JSON.parse(metadata) });
   } catch (err) {
      return c.text('Error reading metadata: ' + err, 500);
   }
});
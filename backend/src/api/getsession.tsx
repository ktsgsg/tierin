import { Hono } from 'hono';
import {useSupabase} from '../hooks/supabase/useSupabase.js';
import { getCookie, setCookie } from 'hono/cookie'

export const getsession = new Hono()

getsession.get('/', async(c) => {
   return c.html(
      <html>
         <body>
            <h1>ログインできてるよ</h1>
            <div>ログインできてるよ</div>
         </body>
      </html>
   );
});
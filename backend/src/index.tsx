import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie'

import {about} from './about/page.js';
import {signup} from './api/signup.js';
import {signin} from './api/signin.js';
import {getsession} from './api/getsession.js';

import {useSupabase} from './hooks/supabase/useSupabase.js';

const app = new Hono();

//ログインしているかどうかを判断するミドルウェア
app.use('/api/*', async (c, next) => {
  //supabase接続
  const supabase = useSupabase().supabase;
  const auth_token = getCookie(c, 'auth_token');
  const userdata = await supabase.auth.getUser(auth_token||'');
  //表示しているページがログインページならそのままnextへ
  if (c.req.path === '/api/signin/' || c.req.path === '/api/signup/') {
    await next();
    return;
  }
  if (!userdata) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  if (userdata.error) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});

app.get('/', (c) => {
  return c.html(
    <html>
      <body>
        <h1>Welcome to Tierin</h1>
        <p>This is the main page.</p>
        <p>
          <a href="/about/">About Tierin</a>
        </p>
        <p>
          <a href="/api/signin/">Sign in here</a>
        </p>
        <p>
          <a href="/api/signup/">Sign up here</a>
        </p>
        <p>
          <a href="/api/getsession/">reload session</a>
        </p>
      </body>
    </html>
  )
})
app.route('/about/', about);
app.route('/api/signup/', signup);
app.route('/api/signin/', signin);
app.route('/api/getsession/', getsession);

serve({
  fetch: app.fetch,
  port: 3000,
});
console.log('Server is running on http://localhost:3000');

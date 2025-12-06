import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { getCookie } from 'hono/cookie'

import { about } from './about/page.js'
import { search } from './api/search.js'
import { posting } from './api/posting.js'
import { suggest } from './api/suggest.js'
import { signup } from './api/signup.js';
import { signin } from './api/signin.js';
import { getsession } from './api/getsession.js';

import { useSupabase } from './hooks/supabase/useSupabase.js';
import { supabaseMiddleware } from './middleware/auth.middleware.js';

const app = new Hono();

app.use(logger());

//ログインしているかどうかを判断するミドルウェア
app.use('/api/*', supabaseMiddleware());

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
app.route('/api/search', search);
app.route('/api/posting/', posting);
app.route('/api/database/', suggest);
app.route('/api/signup/', signup);
app.route('/api/signin/', signin);
app.route('/api/getsession/', getsession);

serve({
  fetch: app.fetch,
  port: 3000,
});
console.log('Server is running on http://localhost:3000');

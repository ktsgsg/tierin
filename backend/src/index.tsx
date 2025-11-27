import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';

import {useSupabase} from './hooks/supabase/useSupabase.js';
import {about} from './about/page.js';
import {signup} from './api/signup.js';
import {signin} from './api/signin.js';

const app = new Hono();

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
      </body>
    </html>
  )
})
app.route('/about/', about);
app.route('/api/signup/', signup);
app.route('/api/signin/', signin);

serve({
  fetch: app.fetch,
  port: 3000,
});
console.log('Server is running on http://localhost:3000');

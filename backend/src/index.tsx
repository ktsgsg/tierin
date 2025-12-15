import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { getCookie } from 'hono/cookie'

import { about } from './about/page.js'
import { search } from './api/search.js'
import { posting } from './api/posting.js'
import { suggest } from './api/suggest.js'
<<<<<<< HEAD
import { preview } from './api/preview.js'

import path from 'path'
import fs from 'fs'
=======
import { signup } from './api/signup.js';
import { signin } from './api/signin.js';
import { getsession } from './api/getsession.js';

import { useSupabase } from './hooks/supabase/useSupabase.js';
import { supabaseMiddleware } from './middleware/auth.middleware.js';
>>>>>>> develop

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
});

// RESOURCE_ROOT => /app/storage/resources
const RESOURCE_ROOT = path.resolve(process.cwd(), 'storage', 'resources');
console.log('resource root: ', RESOURCE_ROOT);

// リソースファイルのルーティング
app.get('/storage/resources/:filename', async (c) => {
  const filename = c.req.param('filename');
  const filePath = path.join(RESOURCE_ROOT, filename);

  try {
    const fileContent = await fs.promises.readFile(filePath);

    // Content-Typeを設定
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';

    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    }
    // 必要に応じて他の拡張子も追加

    return c.body(fileContent, 200, {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${filename}"`
    });

  } catch (error) {
    // ファイルが存在しない場合は 404
    return c.text('File Not Found', 404);
  }
});

<<<<<<< HEAD
app.route('/about', about)
app.route('/api/search', search)
app.route('/api/posting/', posting)
app.route('/api/database/', suggest)
app.route('/api/preview/', preview);
=======
app.route('/about/', about);
app.route('/api/search', search);
app.route('/api/posting/', posting);
app.route('/api/database/', suggest);
app.route('/api/signup/', signup);
app.route('/api/signin/', signin);
app.route('/api/getsession/', getsession);
>>>>>>> develop

serve({
  fetch: app.fetch,
  port: 3000,
});
console.log('Server is running on http://localhost:3000');

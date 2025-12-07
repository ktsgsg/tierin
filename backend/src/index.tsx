import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

import { about } from './about/page.js'
import { search } from './api/search.js'
import { posting } from './api/posting.js'
import { suggest } from './api/suggest.js'
import { preview } from './api/preview.js'

import path from 'path'
import fs from 'fs'

const app = new Hono();

app.use(logger());

app.get('/', (c) => {
  return c.html(
    <html>
      <body>
        <h1>Welcome to Tierin</h1>
        <p>This is the main page.</p>
        <a href="/about">About Tierin</a>
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

app.route('/about', about)
app.route('/api/search', search)
app.route('/api/posting/', posting)
app.route('/api/database/', suggest)
app.route('/api/preview/', preview);

serve({
  fetch: app.fetch,
  port: 3000,
});
console.log('Server is running on http://localhost:3000');

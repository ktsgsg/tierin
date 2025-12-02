import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'

import {about} from './about/page.js'
import { posting } from './api/posting.js'
import { suggest } from './api/suggest.js'

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
})

app.route('/about', about)
app.route('/api/posting/', posting)
app.route('/api/database/', suggest)


serve({
  fetch: app.fetch,
  port: 3000,
});
console.log('Server is running on http://localhost:3000');

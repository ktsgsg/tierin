import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type {FC} from 'hono/jsx'
import { serveStatic } from '@hono/node-server/serve-static'

import {about} from './about/page.js'
import { posting } from './api/posting.js'

const app = new Hono()

app.get('/', (c) => {
  console.log("Root page accessed");
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


serve({
  fetch: app.fetch,
  port: 3000,
});
console.log('Server is running on http://localhost:3000');

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type {FC} from 'hono/jsx'

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


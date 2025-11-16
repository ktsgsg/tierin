import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import {about} from './about/page.js';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/about', about);

serve({
  fetch: app.fetch,
  port: 3000,
});

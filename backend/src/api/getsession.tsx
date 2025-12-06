import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie'

export const getsession = new Hono()

getsession.get('/', async (c) => {
   return c.json(c.req.header('Cookie'));
});
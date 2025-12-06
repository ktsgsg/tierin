import { Hono } from 'hono';
import { useSupabase } from '../hooks/supabase/useSupabase.js';
import { getCookie, setCookie } from 'hono/cookie'

export const signin = new Hono();


signin.post('/', async (c) => {
   const json = await c.req.parseBody();
   const email = json.email.toString();
   const password = json.password.toString();
   console.log(email, password);
   if (!email || !password) {
      return c.json({ error: 'Email and password are required.' }, 400);
   }
   const supabase = c.get('supabase');

   const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
   });
   if (error) {
      return c.json({ error: error.message }, 400);
   }
   return c.json(data.session);
});

signin.get('/', (c) => {
   return c.html(
      <html>
         <body>
            <h1>Sign In</h1>
            <form method="post" action="/api/signin/">
               <label for="email">Email:</label>
               <input type="email" id="email" name="email" required />
               <br />
               <label for="password">Password:</label>
               <input type="password" id="password" name="password" required />
               <br />
               <button type="submit">Sign In</button>
            </form>
         </body>
      </html>
   );
});
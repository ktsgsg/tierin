import { Hono } from 'hono';
import {useSupabase} from '../hooks/supabase/useSupabase.js';

export const signup = new Hono()

signup.post('/', async (c) => {
   const json = await c.req.parseBody();
   const email = json.email.toString();
   const password = json.password.toString();

   //特定のメールアドレスのみ許可する(ドメインがccmailg.meijo-u.ac.jpの場合のみ)
   if (!email.endsWith('@ccmailg.meijo-u.ac.jp')) {
      return c.json({ error: 'Only Meijo University email addresses are allowed.' }, 400);
   }

   if (!email || !password) {
      return c.json({ error: 'Email and password are required.' }, 400);
   }
   const supabase = useSupabase().supabase;

   const {error:signUpError} = await supabase.auth.signUp({
      email,
      password,
   });

   if (signUpError) {
      return c.json({ error: signUpError.message }, 400);
   }
   return c.json({ message: 'Signup successful! Please check your email to confirm your account.' });
});

signup.get('/', (c) => {
   return c.html(
      <html>
         <body>
            <h1>Sign Up</h1>
            <form method="post" action="/api/signup/">
               <label for="email">Email:</label>
               <input type="email" id="email" name="email" required />
               <br />
               <label for="password">Password:</label>
               <input type="password" id="password" name="password" required />
               <br />
               <button type="submit">Sign Up</button>
            </form>
         </body>
      </html>
   );
});
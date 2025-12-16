import { Hono } from 'hono';
import * as fs from "node:fs/promises";
import * as crypt from "node:crypto";

import { useSupabase } from '../hooks/supabase/useSupabase.js';

export const fav = new Hono()

fav.get('/update', async (c) => {
    const supabase = useSupabase().supabase;
    const isIncrement = c.req.query('isIncrement');
    const idParam = c.req.query('contents_id');
    
    if (!idParam) {
        return c.json({ error: "contents_idパラメータが必要です。" }, 400);
    }
    if (!isIncrement) {
        return c.json({ error: "isIncrementパラメータが必要です。" }, 400);
    }

    let stars = await supabase.from('contents').select('stars').eq('contents_id', idParam).single();

    if(stars.error) {
        console.error('Error fetching stars: ', stars.error);
        return c.json({ error: "DBからの取得に失敗しました。" }, 500);
    }

    let result = Number(stars.data?.stars ?? 0) + (isIncrement === 'true' ? 1 : -1);

    // Update stars (fix column name if needed)
    const { error: updateError } = await supabase
        .from('contents')
        .update({ stars: result })
        .eq('contents_id', idParam);

    if (updateError) {
        console.error('Error updating:', updateError);
        return c.json({ error: "DBの更新に失敗しました。" }, 500);
    }

    const { data: contents, error: fetchError } = await supabase
        .from('contents')
        .select('*')
        .eq('contents_id', idParam)
        .single();

    if (fetchError) {
        return c.json({ error: "データ取得に失敗しました。" }, 500);
    }

    return c.json({ success: true, isIncrement: isIncrement === 'true', contents });
});

fav.get('/', (c) => {
    return c.html(
        <body>
            <h1>Fav Test Page</h1>
            <p>This is a test page for fav functionality.</p>
            <form method="get" action="/api/fav/update">
                <label for="isIncrement">isON:</label><br />
                <input type="radio" id="isIncrement" name="isIncrement" value="true" checked />
                <label for="isIncrement">ON</label>
                <input type="radio" id="isIncrement" name="isIncrement" value="false" />
                <label for="isIncrement">OFF</label><br />
                <label for="contents_id">ID:</label>
                <input type="text" id="contents_id" name="contents_id" required /><br />
                <input type="submit" value="Submit" />
            </form>
        </body>
    );
})
import { Hono } from 'hono';

import { useSupabase } from '../hooks/supabase/useSupabase.js';

export const fav = new Hono()

fav.get('/', async (c) => {
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

    // starsの更新
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

    return c.json({ ok: true, isIncrement: isIncrement === 'true', contents });
});
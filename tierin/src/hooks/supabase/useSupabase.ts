// 環境変数を適用する
import "dotenv/config"
import { createClient } from "@supabase/supabase-js"

export const useSupabase = () => {
   if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error("Supbase環境変数の設定に問題がある可能性が高いです。")//.envをつくって
   }

  // 環境変数や型ファイルを適用したクライアントを作成
   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
   })

   return { supabase }
} 
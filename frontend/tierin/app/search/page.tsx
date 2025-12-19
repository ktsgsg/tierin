"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchAction } from "./searchAction";
import { Header } from "@/app/components/Header";
import { SearchItem } from "./types";
import { SearchResultList } from "./SearchResultList";

type SortOption = "likes" | "aiueo";

/**
 * 資料検索ページ
 */
export default function SearchPage() {
   // ルーティング操作用
   const router = useRouter();
   // URLクエリパラメータ取得用
   const searchParams = useSearchParams();
   // 検索中の状態管理（サーバーアクション実行中にボタンを無効化）
   const [isPending, startTransition] = useTransition();

   // 作成年プルダウン用のオプション生成（2008年〜今年まで）
   const currentYear = new Date().getFullYear();
   const yearOptions = Array.from({ length: currentYear - 2008 + 1 }, (_, idx) => currentYear - idx);

   // 初期表示用の空配列
   const previewResults: SearchItem[] = [];


   // 検索結果の状態管理
   const [results, setResults] = useState<SearchItem[]>(previewResults);
   const [sortOption, setSortOption] = useState<SortOption>("likes");

   const applySort = (items: SearchItem[], sort: SortOption) => {
      const sorted = [...items];
      if (sort === "likes") return sorted.sort((a, b) => b.likes - a.likes);
      if (sort === "aiueo") return sorted.sort((a, b) => a.title.localeCompare(b.title, "ja"));
      return sorted;
   };

   const handleSortChange = (nextSort: SortOption) => {
      setSortOption(nextSort);
      setResults((prev) => applySort(prev, nextSort));
   };

   /**
    * 検索を実行する関数
    * サーバーアクションを呼び出して結果を取得し、状態を更新する
    */
   const runSearch = (formData: FormData) => {
      startTransition(() => {
         searchAction(formData).then((data) => {
            const items = (data.items as SearchItem[])?.filter(Boolean) ?? [];
            setResults(applySort(items, sortOption));
            console.log('Search action returned items:', data.items);
         }).catch((err) => {
            console.error('Error during search action:', err);
            setResults([]);
         });
      });
   };

   /**
    * 検索フォーム送信時のハンドラ
    * 1. URLクエリパラメータを更新してリロード時にも検索条件を保持
    * 2. サーバーアクションを呼び出して検索を実行
    */
   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      // URLクエリパラメータを生成（空でない値のみ）
      const params = new URLSearchParams();
      formData.forEach((value, key) => {
         if (typeof value === "string" && value.trim() !== "") {
            params.set(key, value.trim());
         }
      });
      const qs = params.toString();
      // URLを更新（ページリロードなし）
      router.replace(qs ? `?${qs}` : "?", { scroll: false });

      // サーバーアクションに渡すFormDataを作成
      const cloned = new FormData();
      formData.forEach((value, key) => {
         if (typeof value === "string") {
            cloned.append(key, value);
         }
      });
      runSearch(cloned);
   };

   /**
    * URLクエリパラメータが変更されたときに検索を実行
    * ページリロード時やブラウザの戻る/進むボタンで検索結果を復元
    */
   useEffect(() => {
      const hasParams = Array.from(searchParams.keys()).length > 0;
      // クエリパラメータがない場合は空の結果を表示
      if (!hasParams) {
         setResults(previewResults);
         return;
      }

      // クエリパラメータからFormDataを作成して検索実行
      const fd = new FormData();
      searchParams.forEach((value, key) => {
         if (value.trim() !== "") {
            fd.append(key, value);
         }
      });
      runSearch(fd);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [searchParams]);

   return (
      <>
         <Header />
         <div style={{ paddingTop: 32, paddingBottom: 48, background: "#f5f5f5" }}>
            <div style={{ display: "flex", gap: "32px", maxWidth: "100%", margin: "0 auto", padding: "0 24px" }}>
               {/* 左側: 検索フォーム */}
               <div style={{ flex: "0 0 220px", position: "sticky", top: "120px", alignSelf: "flex-start" }}>
                  <div style={{ background: "#ffffff", padding: "24px", borderRadius: "8px", border: "1px solid #e0e0e0", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}>
                     <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "16px", marginTop: 0 }}>
                        検索条件
                     </h2>
                     <form onSubmit={handleSubmit} method="get" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                           <label htmlFor="title" className="auth-label">
                              資料のタイトル
                           </label>
                           <input
                              id="title"
                              name="title"
                              type="text"
                              className="auth-input"
                              placeholder="例: 期末試験"
                              defaultValue={searchParams.get("title") ?? ""}
                           />
                        </div>

                        <div>
                           <label htmlFor="subject" className="auth-label">
                              使用された教科
                           </label>
                           <input
                              id="subject"
                              name="subject"
                              type="text"
                              className="auth-input"
                              placeholder="例: 線形代数"
                              defaultValue={searchParams.get("subject") ?? ""}
                           />
                        </div>

                        <div>
                           <label htmlFor="teacher" className="auth-label">
                              教科担当
                           </label>
                           <input
                              id="teacher"
                              name="teacher"
                              type="text"
                              className="auth-input"
                              placeholder="例: 山田太郎"
                              defaultValue={searchParams.get("teacher") ?? ""}
                           />
                        </div>

                        <div>
                           <label htmlFor="year" className="auth-label">
                              作成年
                           </label>
                           <select
                              id="year"
                              name="year"
                              className="auth-input"
                              defaultValue={searchParams.get("year") ?? ""}
                           >
                              <option value="">指定なし</option>
                              {yearOptions.map((year) => (
                                 <option key={year} value={year}>
                                    {year}年
                                 </option>
                              ))}
                           </select>
                        </div>

                        <div>
                           <label htmlFor="type" className="auth-label">
                              種別
                           </label>
                           <select
                              id="type"
                              name="type"
                              className="auth-input"
                              defaultValue={searchParams.get("type") ?? ""}
                           >
                              <option value="">指定なし</option>
                              <option value="past">過去問</option>
                              <option value="lecture">授業資料</option>
                           </select>
                        </div>

                        <button type="submit" className="auth-button" disabled={isPending}>
                           {isPending ? "検索中..." : "検索する"}
                        </button>
                     </form>

                     <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #e0e0e0" }}>
                        <label htmlFor="sort" className="auth-label">
                           並び替え
                        </label>
                        <select
                           id="sort"
                           className="auth-input"
                           value={sortOption}
                           onChange={(e) => handleSortChange(e.target.value as SortOption)}
                        >
                           <option value="likes">いいねの数</option>
                           <option value="aiueo">あいうえお順</option>
                        </select>
                     </div>
                  </div>
               </div>

               {/* 右側: 検索結果 */}
               <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "16px", marginTop: 0 }}>
                     {results.length > 0 ? `検索結果（${results.length}件）` : "検索結果"}
                  </h2>
                  {results.length > 0 ? <SearchResultList items={results} /> : <div style={{ padding: "40px 20px", textAlign: "center", color: "#999999" }}>検索条件に合う資料が見つかりませんでした</div>}
               </div>
            </div>
         </div>
      </>
   );
}

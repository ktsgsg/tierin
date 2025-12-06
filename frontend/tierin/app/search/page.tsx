"use client";

import { FormEvent, useState } from "react";

type PreviewItem = {
   title: string;
   subject: string;
   teacher: string;
   year: number;
   type: "past" | "lecture";
   extensions: string[]; // 資料内に含まれる拡張子の一覧
   likes: number; // 星（いいね）数
};

/**
 * 資料検索ページ
 * まだバックエンド検索は実装せず、検索条件入力欄のみ用意する
 */
export default function SearchPage() {
   // エラーや送信状態が必要になった場合に備えてステートを用意（現状は未使用）
   const [isSubmitting, setIsSubmitting] = useState(false);

   // プルダウン用の作成年リスト（2008年〜今年）
   const currentYear = new Date().getFullYear();
   const yearOptions = Array.from({ length: currentYear - 2008 + 1 }, (_, idx) => currentYear - idx);

   // 仮の検索結果プレビュー（バックエンド実装前のモック表示）
   const previewResults: PreviewItem[] = [
      {
         title: "2023年度 期末試験 (数学)",
         subject: "線形代数",
         teacher: "山田太郎",
         year: 2023,
         type: "past",
         extensions: ["pdf", "png"],
         likes: 18,
      },
      {
         title: "微分方程式 補講資料",
         subject: "微分方程式",
         teacher: "佐藤花子",
         year: 2022,
         type: "lecture",
         extensions: ["pdf", "zip"],
         likes: 7,
      },
   ];

   /**
    * 検索結果カードを生成する関数
    * 追加したい結果を配列に入れてこの関数経由で描画する
    */
   const renderResultCard = (item: PreviewItem, idx: number) => (
      <div key={idx} className="result-card">
         <div className="result-title">{item.title}</div>
         <div className="result-meta">
            <span>教科: {item.subject}</span>
            <span>担当: {item.teacher}</span>
            <span>作成年: {item.year}</span>
            <span className={`badge ${item.type === "past" ? "badge-past" : "badge-lecture"}`}>
               {item.type === "past" ? "過去問" : "授業資料"}
            </span>
            <span className="rating">
               ★<span className="rating-count">{item.likes}</span>
            </span>
         </div>

         {/* 含まれる拡張子一覧 */}
         <div className="ext-list">
            {item.extensions.map((ext) => (
               <span key={ext} className="ext-pill">
                  .{ext}
               </span>
            ))}
         </div>
      </div>
   );

   /**
    * 検索結果一覧をまとめて描画するレイアウト
    * itemsを差し替えることで動的にカードを追加可能
    */
   const renderResults = (items: PreviewItem[]) => (
      <div className="search-results">
         {items.map((item, idx) => renderResultCard(item, idx))}
      </div>
   );

   /**
    * 送信ハンドラ（現状はバックエンド連携なし）
    */
   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      // TODO: バックエンド検索APIを実装したらここで呼び出す
      // 現在はフォーム入力だけを受け付け、何もしない
      setTimeout(() => setIsSubmitting(false), 200); // 簡易なフィードバック用
   };

   return (
      <div className="auth-page" style={{ paddingTop: 32, paddingBottom: 48 }}>
         <div className="auth-card">
            <h1 className="auth-title">資料検索</h1>

            <p className="auth-subtext" style={{ marginTop: 0, marginBottom: 8 }}>
               条件を入力して資料を検索できます（結果表示は後で実装します）。
            </p>

            <form className="auth-form search-compact" onSubmit={handleSubmit}>
               {/* 資料タイトル */}
               <div>
                  <label htmlFor="title" className="auth-label">
                     資料のタイトル
                  </label>
                  <input
                     id="title"
                     name="title"
                     type="text"
                     className="auth-input"
                     placeholder="例: 2023年度 期末試験"
                  />
               </div>

               {/* 使用された教科 */}
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
                  />
               </div>

               {/* 教科担当 */}
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
                  />
               </div>

               {/* 作成年（プルダウン） */}
               <div>
                  <label htmlFor="year" className="auth-label">
                     作成年
                  </label>
                  <select id="year" name="year" className="auth-input">
                     <option value="">指定なし</option>
                     {yearOptions.map((year) => (
                        <option key={year} value={year}>
                           {year}年
                        </option>
                     ))}
                  </select>
               </div>

               {/* 種別（過去問 or 授業資料） */}
               <div>
                  <label htmlFor="type" className="auth-label">
                     種別
                  </label>
                  <select id="type" name="type" className="auth-input">
                     <option value="">指定なし</option>
                     <option value="past">過去問</option>
                     <option value="lecture">授業資料</option>
                  </select>
               </div>

               <button type="submit" className="auth-button" disabled={isSubmitting}>
                  {isSubmitting ? "検索中..." : "検索する"}
               </button>
            </form>

            <hr className="search-divider" />

            {/* 検索結果プレビュー（モック） */}
            {renderResults(previewResults)}
         </div>
      </div>
   );
}

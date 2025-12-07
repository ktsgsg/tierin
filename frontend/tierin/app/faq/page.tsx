"use client";

import { useState } from "react";
import Header from "@/app/components/Header";
import styles from "./faq.module.css";

interface FAQItem {
   id: number;
   question: string;
   answer: string;
}

const faqItems: FAQItem[] = [
   {
      id: 1,
      question: "Tierinとは何ですか？",
      answer:
         "Tierinは、大学の授業資料や過去問を共有・検索できるプラットフォームです。学生が互いに学習資料をシェアすることで、学習効率を高めるサポートを行っています。",
   },
   {
      id: 2,
      question: "資料をアップロードするにはどうしたらいいですか？",
      answer:
         "ログイン後、ナビゲーションメニューの「投稿」をクリックして、資料のタイトルや説明、ファイルを指定して投稿できます。複数のファイル形式に対応しています。",
   },
   {
      id: 3,
      question: "他のユーザーの資料は誰でも見ることができますか？",
      answer:
         "Tierinにログインしていれば、投稿されている全ての資料を閲覧できます。ダウンロードやコメント機能もご利用いただけます。",
   },
   {
      id: 4,
      question: "自分の資料を削除することはできますか？",
      answer:
         "はい、投稿した資料は後からいつでも削除できます。マイページから投稿履歴を確認し、削除したい資料を選択して削除してください。",
   },
   {
      id: 5,
      question: "不適切な資料を見つけた場合はどうすればいいですか？",
      answer:
         "問題のある資料を発見した場合は、各資料のページにある「報告」ボタンから報告してください。当チームが確認後、適切に対応いたします。",
   },
   {
      id: 6,
      question: "検索機能はどのように使いますか？",
      answer:
         "ヘッダーの検索バーに資料のタイトルを入力して、Enterキーを押すと検索できます。検索結果ページでは、いいね数やあいうえお順でソートすることも可能です。",
   },
   {
      id: 7,
      question: "アカウントを削除したいのですが、どうしたらいいですか？",
      answer:
         "アカウント削除をご希望の場合は、サポートページからお問い合わせください。本人確認後、アカウント削除の処理を行います。",
   },
   {
      id: 8,
      question: "Tierinは無料で使用できますか？",
      answer:
         "はい、Tierinは完全無料でご利用いただけます。登録料金や利用料金は一切かかりません。",
   },
];

export default function FAQPage() {
   const [expandedId, setExpandedId] = useState<number | null>(null);

   const toggleExpand = (id: number) => {
      setExpandedId(expandedId === id ? null : id);
   };

   return (
      <>
         <Header userEmail="ユーザー" />
         <div className="auth-page with-header" style={{ paddingTop: 32, paddingBottom: 48 }}>
            <div className="auth-card">
               <h1 className="auth-title">よくあるご質問</h1>
               <p
                  className="auth-subtext"
                  style={{ marginTop: 0, marginBottom: 24 }}
               >
                  Tierinに関するよくあるご質問をまとめました。
               </p>

               <div className={styles.faqContainer}>
                  {faqItems.map((item) => (
                     <div key={item.id} className={styles.faqItem}>
                        <button
                           className={styles.faqQuestion}
                           onClick={() => toggleExpand(item.id)}
                        >
                           <span className={styles.questionText}>{item.question}</span>
                           <span className={styles.toggleIcon}>
                              {expandedId === item.id ? "−" : "+"}
                           </span>
                        </button>
                        {expandedId === item.id && (
                           <div className={styles.faqAnswer}>{item.answer}</div>
                        )}
                     </div>
                  ))}
               </div>

               <div className={styles.contactSection}>
                  <h2 className={styles.contactTitle}>その他のお問い合わせ</h2>
                  <p className={styles.contactText}>
                     ご不明な点やご質問がございましたら、以下のメールアドレスまでお気軽にお問い合わせください。
                  </p>
                  <a href="mailto:241205181@ccmailg.meijo-u.ac.jp" className={styles.contactEmail}>
                     241205181@ccmailg.meijo-u.ac.jp
                  </a>
               </div>
            </div>
         </div>
      </>
   );
}

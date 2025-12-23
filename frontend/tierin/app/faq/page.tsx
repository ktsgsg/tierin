import type { Metadata } from 'next';
import { Header } from '@/app/components/Header';
import styles from './faq.module.css';

export const metadata: Metadata = {
   title: "よくある質問",
};

type FAQItem = {
   question: string;
   answer: string;
};

const faqData: FAQItem[] = [
   {
      question: "tierinとは何ですか？",
      answer: "tierinは大学生のための資料共有サービスです。過去問や授業資料を共有・検索することができます。"
   },
   {
      question: "利用するには何が必要ですか？",
      answer: "大学のメールアドレス（@ccmailg.meijo-u.ac.jp）でアカウントを作成する必要があります。登録は無料です。"
   },
   {
      question: "どのような資料を共有できますか？",
      answer: "過去問や授業資料（レジュメ、ノートなど）を共有できます。著作権に配慮し、教員が作成した資料をそのまま共有することは避けてください。"
   },
   {
      question: "資料のアップロード方法は？",
      answer: "ログイン後、「投稿」ページからファイルをアップロードできます。教科名、担当教員、資料の種類などの情報を入力してください。"
   },
   {
      question: "ファイル形式に制限はありますか？",
      answer: "PDF、画像ファイル（JPG、PNG）、Word、Excel、PowerPointなどの一般的なファイル形式に対応しています。"
   },
   {
      question: "アップロードできるファイルサイズの上限は？",
      answer: "1ファイルあたり最大100MBまでアップロード可能です。"
   },
   {
      question: "資料を削除したい場合は？",
      answer: "アカウントページから自分が投稿した資料を確認し、削除することができます。"
   },
   {
      question: "パスワードを忘れてしまいました",
      answer: "現在パスワードリセット機能は実装されていません。お手数ですが、241205181@ccmailg.meijo-u.ac.jp までご連絡ください。"
   },
   {
      question: "アカウントを削除したい場合は？",
      answer: "アカウントページの「危険な操作」セクションからアカウント削除のリクエストを送信できます。"
   },
   {
      question: "不適切な資料を見つけた場合は？",
      answer: "不適切な資料を発見した場合は、241205181@ccmailg.meijo-u.ac.jp までご報告ください。確認後、適切に対応いたします。"
   }
];

export default function FAQPage() {
   return (
      <div className="with-header">
         <Header />
         <div className={styles.container}>
            <div className={styles.content}>
               <h1 className={styles.title}>よくある質問（FAQ）</h1>
               <p className={styles.description}>
                  tierinの使い方やよくあるお問い合わせについてまとめています。
               </p>

               <div className={styles.faqList}>
                  {faqData.map((item, index) => (
                     <div key={index} className={styles.faqItem}>
                        <div className={styles.question}>
                           <span className={styles.questionIcon}>Q</span>
                           <span className={styles.questionText}>{item.question}</span>
                        </div>
                        <div className={styles.answer}>
                           <span className={styles.answerIcon}>A</span>
                           <span className={styles.answerText}>{item.answer}</span>
                        </div>
                     </div>
                  ))}
               </div>

               <div className={styles.contactSection}>
                  <h2 className={styles.contactTitle}>お問い合わせ</h2>
                  <p className={styles.contactText}>
                     上記で解決しない場合は、下記メールアドレスまでお問い合わせください。
                  </p>
                  <a href="mailto:241205181@ccmailg.meijo-u.ac.jp" className={styles.contactEmail}>
                     241205181@ccmailg.meijo-u.ac.jp
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}

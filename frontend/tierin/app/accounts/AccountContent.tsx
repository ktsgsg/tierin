'use client';

import { AccountData } from './accountAction';
import { SearchResultList } from '../search/SearchResultList';
import styles from './page.module.css';

interface AccountContentProps {
   data: AccountData;
}

export default function AccountContent({ data }: AccountContentProps) {
   const handleDeleteAccount = () => {
      if (window.confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
         alert('アカウント削除機能は未実装です');
      }
   };

   return (
      <main style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
         <div className="auth-card">
            <h1 className="auth-title">アカウント情報</h1>

            {/* メールアドレス表示 */}
            <div className={styles.accountSection}>
               <h2 className={styles.sectionTitle}>登録メールアドレス</h2>
               <div className={styles.emailDisplay}>
                  <span className={styles.emailText}>{data.email}</span>
               </div>
            </div>

            {/* いいねした資料リスト */}
            <div className={styles.accountSection}>
               <h2 className={styles.sectionTitle}>いいねした資料 ({data.likedResources.length}件)</h2>
               <SearchResultList items={data.likedResources} />
            </div>

            {/* 投稿した資料リスト */}
            <div className={styles.accountSection}>
               <h2 className={styles.sectionTitle}>投稿した資料 ({data.myResources.length}件)</h2>
               <SearchResultList items={data.myResources} />
            </div>

            {/* 削除依頼案内 */}
            <div className={styles.accountSection}>
               <h2 className={styles.sectionTitle}>アカウント・コンテンツの削除</h2>
               <div className={styles.dangerZone}>
                  <p className={styles.dangerText}>
                     アカウントの削除、または自分が投稿したコンテンツを削除したい場合は、以下のメールアドレスにその旨をお伝えください。
                  </p>
                  <a
                     href="mailto:241205181@ccmailg.meijo-u.ac.jp?subject=Tierin 削除依頼"
                     className={styles.contactEmail}
                  >
                     241205181@ccmailg.meijo-u.ac.jp
                  </a>
                  <p className={styles.futureNote}>
                     ※ 今後、アプリ内から削除できる機能を追加予定です。
                  </p>
               </div>
            </div>
         </div>
      </main>
   );
}

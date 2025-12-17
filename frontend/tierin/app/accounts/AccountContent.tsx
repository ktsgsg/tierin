'use client';

import { AccountData } from './accountAction';
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
               <div className={styles.resourceList}>
                  {data.likedResources.map((resource) => (
                     <div key={resource.id} className={styles.resourceCard}>
                        <div className={styles.resourceHeader}>
                           <span className={styles.resourceTitle}>{resource.title}</span>
                           <span className={styles.resourceType}>{resource.type}</span>
                        </div>
                        <div className={styles.resourceMeta}>
                           <span>{resource.subject}</span>
                           <span>{resource.year}年</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* 投稿した資料リスト */}
            <div className={styles.accountSection}>
               <h2 className={styles.sectionTitle}>投稿した資料 ({data.myResources.length}件)</h2>
               <div className={styles.resourceList}>
                  {data.myResources.map((resource) => (
                     <div key={resource.id} className={styles.resourceCard}>
                        <div className={styles.resourceHeader}>
                           <span className={styles.resourceTitle}>{resource.title}</span>
                           <span className={styles.resourceType}>{resource.type}</span>
                        </div>
                        <div className={styles.resourceMeta}>
                           <span>{resource.subject}</span>
                           <span>{resource.year}年</span>
                           <span className={styles.likes}>{resource.likes}</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* アカウント削除ボタン */}
            <div className={styles.accountSection}>
               <h2 className={styles.sectionTitle}>危険な操作</h2>
               <div className={styles.dangerZone}>
                  <p className={styles.dangerText}>
                     アカウントを削除すると、すべてのデータが失われます。この操作は取り消せません。
                  </p>
                  <button
                     onClick={handleDeleteAccount}
                     className={styles.deleteButton}
                  >
                     アカウントを削除
                  </button>
               </div>
            </div>
         </div>
      </main>
   );
}

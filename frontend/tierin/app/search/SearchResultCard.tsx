'use client';

import { SearchItem } from './types';
import styles from './search.module.css';

interface SearchResultCardProps {
   item: SearchItem;
}

export function SearchResultCard({ item }: SearchResultCardProps) {
   return (
      <div className={styles.resultCard}>
         <div className={styles.resultTitle}>
            <a href={item.url} className="auth-link" target="_blank" rel="noreferrer">
               {item.title}
            </a>
         </div>
         <div className={styles.resultMeta}>
            <span>教科: {item.subject}</span>
            <span>担当: {item.teacher}</span>
            <span>作成年: {item.year}</span>
         </div>
         <div className={styles.extList}>
            {item.extensions.map((ext) => (
               <span key={ext} className={styles.extPill}>
                  .{ext}
               </span>
            ))}
            <span
               className={`${styles.badge} ${item.type === 'past' ? styles.badgePast : styles.badgeLecture}`}
            >
               {item.type === 'past' ? '過去問' : '授業資料'}
            </span>
            <span className={styles.rating}>
               ★<span className={styles.ratingCount}>{item.likes}</span>
            </span>
         </div>
      </div>
   );
}

'use client';

import Link from 'next/link';

/**
 * プレビューエラーページ
 * データが見つからない場合に表示される
 */
export function PreviewError() {
   return (
      <div style={{
         display: 'flex',
         flexDirection: 'column',
         alignItems: 'center',
         justifyContent: 'center',
         padding: '60px 24px',
         textAlign: 'center'
      }}>
         <div style={{
            fontSize: '48px',
            marginBottom: '16px'
         }}>
            ⚠️
         </div>
         <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '12px'
         }}>
            プレビューが見つかりません
         </h2>
         <p style={{
            fontSize: '0.95rem',
            color: '#666666',
            marginBottom: '24px',
            lineHeight: '1.6'
         }}>
            申し訳ございません。<br />
            指定されたコンテンツが見つかりませんでした。<br />
            コンテンツIDが正しいか確認してください。
         </p>
         <Link
            href="/search"
            style={{
               display: 'inline-block',
               padding: '10px 24px',
               background: '#56D6E4',
               color: '#1a1a1a',
               textDecoration: 'none',
               borderRadius: '6px',
               fontWeight: '600',
               fontSize: '0.95rem',
               transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#36b8c6')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#56D6E4')}
         >
            検索ページに戻る
         </Link>
      </div>
   );
}

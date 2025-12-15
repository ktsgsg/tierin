export default function NotFound() {
   return (
      <div style={{ textAlign: 'center', marginTop: '20%' }}>
         <h1 style={{ fontSize: '72px', marginBottom: '24px' }}>404</h1>
         <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>ページが見つかりません</h2>
         <p style={{ fontSize: '18px', color: '#666' }}>
            お探しのページは存在しないか、移動した可能性があります。
         </p>
      </div>
   );
}
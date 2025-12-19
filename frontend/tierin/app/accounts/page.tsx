import { Header } from '@/app/components/Header';
import { getAccountData } from './accountAction';
import AccountContent from './AccountContent';

export default async function AccountPage() {
   const data = await getAccountData();

   console.log(data);

   if (!data) {
      return (
         <div className="with-header" style={{ paddingBottom: 48, paddingTop: 32, background: "#f5f5f5", minHeight: "100vh" }}>
            <Header />
            <main style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
               <div className="auth-card">
                  <h1 className="auth-title">エラー</h1>
                  <p style={{ textAlign: 'center', color: '#666' }}>
                     アカウント情報の取得に失敗しました。
                  </p>
               </div>
            </main>
         </div>
      );
   }

   return (
      <div className="with-header" style={{ paddingBottom: 48, paddingTop: 32, background: "#f5f5f5", minHeight: "100vh" }}>
         <Header />
         <AccountContent data={data} />
      </div>
   );
}

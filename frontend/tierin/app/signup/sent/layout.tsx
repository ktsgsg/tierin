import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: "確認メール送信完了",
};

export default function SignupSentLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <>{children}</>;
}

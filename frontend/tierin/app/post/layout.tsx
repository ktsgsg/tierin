import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: "投稿",
};

export default function PostLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <>{children}</>;
}

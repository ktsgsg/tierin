import type { Metadata } from 'next';
import { Header } from "@/app/components/Header";
import { getPreviewData } from './previewAction';
import { PreviewContent } from './PreviewContent';
import { PreviewError } from './PreviewError';

export const metadata: Metadata = {
    title: "プレビュー",
};

export default async function PreviewPage(props: any) {
    const searchParams = await props.searchParams;
    const contents_id = searchParams.contents_id;

    if (!contents_id) {
        return <p>contents_id is required</p>;
    }

    // サーバー側でデータを取得
    const data = await getPreviewData(contents_id);

    if (!data) {
        return (
            <div className="with-header" style={{ paddingBottom: 48, paddingTop: 32, background: "#f5f5f5", minHeight: "100vh" }}>
                <Header />
                <main style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <div className="auth-card">
                        <PreviewError />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="with-header" style={{ paddingBottom: 48, paddingTop: 32, background: "#f5f5f5", minHeight: "100vh" }}>
            <Header />
            <main style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <div className="auth-card">
                    <h1 className="auth-title">プレビュー</h1>
                    {/* クライアント側でレンダリング */}
                    <PreviewContent data={data} />
                </div>
            </main>
        </div>
    );
}

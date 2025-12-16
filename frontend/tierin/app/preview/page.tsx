import styles from './page.module.css'
import { cookies } from 'next/headers';
import { Header } from "@/app/components/Header";

export default async function PreviewPage(props: any) {
    const searchParams = await props.searchParams;
    const contents_id = searchParams.contents_id;

    if (!contents_id) {
        return <p>contents_id is required</p>;
    }

    // 認証用のCookieを取得
    const cookieStore = await cookies()
    const cookie = cookieStore.get('access_token') ? `access_token=${cookieStore.get('access_token')?.value}; refresh_token=${cookieStore.get('refresh_token')?.value}` : '';

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/preview/contents?contents_id=${contents_id}`,
        {
            cache: 'no-store',
            //cookieが必要なので追記
            headers: {
                'Cookie': cookie,
            },
        }
    )
    const data = await response.json();
    const resourceBase = '/storage/resources/';

    return (
        <div>
            <Header />
            <ul className={styles.resource_list}>
                {
                    data.metadata.resources.map((resource: string) => {
                        const resourceUrl = resourceBase + resource;
                        if (resource.endsWith('.jpeg') || resource.endsWith('.jpg') || resource.endsWith('.png')) {
                            return (
                                <li key={resource} className={styles.resource_item}>
                                    <img src={resourceUrl} alt={`Resource`} />
                                </li>
                            );
                        } else if (resource.endsWith('.pdf')) {
                            return (
                                <li key={resource} className={styles.resource_item}>
                                    <div className={styles.pdf_container}>
                                        <iframe
                                            src={resourceUrl}
                                            title="PDF Resource"
                                        ></iframe>
                                    </div>
                                </li>
                            );
                        } else {
                            return (
                                <li key={resource} className={styles.resource_item}>
                                    <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
                                        Download Resource
                                    </a>
                                </li>
                            );
                        }
                    })}
            </ul>
        </div>
    )
}
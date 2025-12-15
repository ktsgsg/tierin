import styles from './page.module.css'

export default async function PreviewPage(props: any) {
    const searchParams = await props.searchParams;
    const contents_id = searchParams.contents_id;

    if (!contents_id) {
        return <p>contents_id is required</p>;
    }

    const response = await fetch(
        `http://api:3000/api/preview/contents?contents_id=${contents_id}`,
        {
            cache: 'no-store'
        }
    )
    const data = await response.json();
    const resourceBase = '/storage/resources/';

    return (
        <div>
            <ul className={styles.resource_list}>
                {data.metadata.resources.map((resource: string) => {
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
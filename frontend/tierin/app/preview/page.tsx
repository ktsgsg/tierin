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
    const resourceBase = 'http://localhost:3000/storage/resources/';

    return (
        <div>
            <h1>Content Preview</h1>
            <h2>{data.title}</h2>
            <p>Contents ID: {data.contents_id}</p>
            <p>Resources</p>
            <ul>
                {data.metadata.resources.map((resource: string) => {
                    const resourceUrl = resourceBase + resource;
                    if (resource.endsWith('.jpeg') || resource.endsWith('.jpg') || resource.endsWith('.png')) {
                        return (
                            <li key={resource}>
                                <img src={resourceUrl} alt={`Resource`} width={800} />
                            </li>
                        );
                    } else if (resource.endsWith('.pdf')) {
                        return (
                            <li key={resource}>
                                <a href={resourceUrl} target="_blank" rel="noopener noreferrer">
                                    View PDF {resource}
                                </a>
                            </li>
                        );
                    } else {
                        return (
                            <li key={resource}>
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
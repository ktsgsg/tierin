export default async function PreviewPage() {
    const response = await fetch('http://api:3000/api/preview/contents?contents_id=f7ec3b35-6415-47c8-bfe2-09e70b6e2bbd', {
        cache: 'no-store', 
    });

    console.log('response', response.status);
    const data = await response.json();
    const resourceBase = 'http://localhost:3000/storage/resources/';
    return (
        <div>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            <h1>Preview Page</h1>
            <h2>{data.title}</h2>
            <p>Contents ID: {data.contents_id}</p>
            <h3>Resource: </h3>
            {/* {画像やPDFをここに表示} */}
            <p>Resources:</p>
            <ul>
                {data.metadata.resources.map((resource: string) => {
                    const resourceUrl = resourceBase + resource;
                    if (resource.endsWith('.jpeg') || resource.endsWith('.jpg') || resource.endsWith('.png')) {
                        return (
                            <li key={resource}>
                                <img src={resourceUrl} alt={`Resource`} width={200} />
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

export default async function PreviewPage() {
    const response = await fetch('http://api:3000/api/preview/contents?contents_id=0c93c2cd-b2a1-48f5-b635-b971589eb16c', {
        cache: 'no-store', 
    });
    // const response = {
    //     status: 200,
    //     json: async () => ({
    //         message: 'This is a preview response'
    //     })
    // }
    console.log('response', response.status);
    const data = await response.json();
    return (
        <div>
            {/* <h1>Preview Page</h1> */}
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

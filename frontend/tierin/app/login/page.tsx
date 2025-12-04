
export default async function Page() {
   const response = await fetch('http://172.30.0.2:3000/api/database/subject?name=化学', {
      cache: 'no-store',
   });
   console.log('response', response.status);
   const data = await response.json();
   return (
      <div>
         <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
   );
}
'use client';

import styles from './page.module.css';
import { PreviewData } from './previewAction';

interface PreviewContentProps {
   data: PreviewData;
}

/**
 * プレビューコンテンツを表示するクライアントコンポーネント
 * リソースのレンダリングをクライアントサイドで行う
 */
export function PreviewContent({ data }: PreviewContentProps) {
   const resourceBase = '/storage/resources/';

   if (!data || !data.metadata || !data.metadata.resources) {
      return <p style={{ color: '#999999', textAlign: 'center' }}>No resources available</p>;
   }

   const filenames = data.metadata.filenames;

   console.log('Rendering resources:', data);
   return (
      <div className={styles.preview_container}>
         {data.metadata.resources.map((resource: string, index: number) => {
            const resourceUrl = resourceBase + resource;
            const filename = filenames && filenames[index] ? filenames[index] : resource;

            return (
               <div key={resource} className={styles.resource_card}>
                  <div className={styles.filename}>{filename}</div>
                  <div className={styles.resource_content}>
                     {resource.endsWith('.jpeg') || resource.endsWith('.jpg') || resource.endsWith('.png') ? (
                        <img src={resourceUrl} alt={filename} />
                     ) : resource.endsWith('.pdf') ? (
                        <div className={styles.pdf_container}>
                           <iframe
                              src={resourceUrl}
                              title={filename}
                           ></iframe>
                        </div>
                     ) : (
                        <a href={resourceUrl} target="_blank" rel="noopener noreferrer" className={styles.download_link}>
                           📥 {filename}をダウンロード
                        </a>
                     )}
                  </div>
               </div>
            );
         })}
      </div>
   );
}

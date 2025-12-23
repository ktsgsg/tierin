'use client';

import { SearchItem } from './types';
import { SearchResultCard } from './SearchResultCard';

interface SearchResultListProps {
   items: SearchItem[];
}

export function SearchResultList({ items }: SearchResultListProps) {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
         {items.map((item) => (
            <SearchResultCard key={item.contents_id} item={item} />
         ))}
      </div>
   );
}

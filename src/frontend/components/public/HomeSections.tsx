'use client';

import { useState } from 'react';
import type { Berita } from '@/backend/services/berita';
import { BeritaCard } from '@/frontend/components/public/BeritaCard';
import { EmptyState } from '@/frontend/components/public/EmptyState';

export function HomeNewsGrid({ items, empty }: { items: Berita[]; empty: { title: string; description: string } }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (items.length === 0) {
    return <EmptyState title={empty.title} description={empty.description} />;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <BeritaCard
          key={item.id}
          item={item}
          expanded={expandedId === item.id}
          onToggle={() => setExpandedId((current) => current === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}

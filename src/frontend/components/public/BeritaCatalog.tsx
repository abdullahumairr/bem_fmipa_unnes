'use client';

import { useMemo, useState } from 'react';
import { AdminAddButton } from '@/frontend/components/public/AdminAddButton';
import { BeritaCard } from '@/frontend/components/public/BeritaCard';
import { EmptyState } from '@/frontend/components/public/EmptyState';
import { PageHero } from '@/frontend/components/public/PageHero';
import type { Berita } from '@/backend/services/berita';

export function BeritaCatalog({ items, error }: { items: Berita[]; error: string | null }) {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => !needle || `${item.title} ${item.tag_category}`.toLowerCase().includes(needle));
  }, [items, query]);
  return <div className="px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pt-32"><PageHero eyebrow="Warta Resmi & Informasi Terkini" title="Kabar & Berita" highlight="FMIPA" accent="UNNES" subtitle="Pusat rilis informasi resmi, advokasi kemahasiswaan, rekap kegiatan ormawa, dan pengumuman terbuka Kabinet Gema Restorasi 87." searchPlaceholder="Cari pengumuman, beasiswa, advokasi, atau kegiatan..." searchValue={query} onSearchChange={setQuery} /><div className="mx-auto mt-4 flex max-w-xl justify-end"><AdminAddButton label="Tambah Berita" href="/dashboard/berita/new" /></div>{error ? <div className="mx-auto mt-10 max-w-5xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : filtered.length === 0 ? <div className="mx-auto mt-12 max-w-5xl"><EmptyState title="Belum ada berita yang sesuai" description="Coba gunakan kata kunci lain untuk menemukan informasi terbaru." /></div> : <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2">{filtered.map((item) => <BeritaCard key={item.id} item={item} expanded={expandedId === item.id} onToggle={() => setExpandedId((current) => current === item.id ? null : item.id)} />)}</div>}</div>;
}

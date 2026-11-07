'use client';

import { useMemo, useState } from 'react';
import { AdminAddButton } from '@/frontend/components/public/AdminAddButton';
import { EmptyState } from '@/frontend/components/public/EmptyState';
import { PageHero } from '@/frontend/components/public/PageHero';
import { PrestasiCard } from '@/frontend/components/public/PrestasiCard';
import type { Prestasi } from '@/backend/services/prestasi';

export function PrestasiCatalog({ items, error }: { items: Prestasi[]; error: string | null }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => !needle || `${item.title} ${item.recipient} ${item.field_tag}`.toLowerCase().includes(needle));
  }, [items, query]);
  return <div className="px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pt-32"><PageHero eyebrow="Rekam Jejak & Apresiasi Kelembagaan" title="Galeri Prestasi & Capaian" highlight="BEM FMIPA" accent="UNNES" subtitle="Menampilkan torehan gemilang dan rekognisi kelembagaan BEM FMIPA UNNES di kancah universitas, nasional, maupun regional sebagai bukti nyata kepengurusan yang berdampak, progresif, dan berintegritas." searchPlaceholder="Cari Prestasi BEM FMIPA UNNES..." searchValue={query} onSearchChange={setQuery} /><div className="mx-auto mt-4 flex max-w-xl justify-end"><AdminAddButton label="Tambah Prestasi" href="/dashboard/prestasi/new" /></div>{error ? <div className="mx-auto mt-10 max-w-5xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : filtered.length === 0 ? <div className="mx-auto mt-12 max-w-5xl"><EmptyState title="Belum ada prestasi yang sesuai" description="Coba gunakan kata kunci lain untuk menemukan rekam jejak prestasi." /></div> : <div className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2">{filtered.map((item) => <PrestasiCard key={item.id} item={item} />)}</div>}</div>;
}

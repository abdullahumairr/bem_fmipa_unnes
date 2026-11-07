'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, CircleCheck, CircleDot } from 'lucide-react';
import { AdminAddButton } from '@/frontend/components/public/AdminAddButton';
import { EmptyState } from '@/frontend/components/public/EmptyState';
import { PageHero } from '@/frontend/components/public/PageHero';
import { ProgjaCard, UpcomingProgjaRow } from '@/frontend/components/public/ProgjaCard';
import type { DepartmentOption, ProgjaWithDepartment } from '@/backend/services/progja';

type StatusFilter = 'semua' | 'terlaksana' | 'mendatang';

export function ProgjaCatalog({ items, departments, error }: { items: ProgjaWithDepartment[]; departments: DepartmentOption[]; error: string | null }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('semua');
  const [departmentId, setDepartmentId] = useState('semua');
  const [visibleCount, setVisibleCount] = useState(6);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => (!needle || item.title.toLowerCase().includes(needle)) && (status === 'semua' || item.status === status) && (departmentId === 'semua' || item.department_id === departmentId));
  }, [items, query, status, departmentId]);
  const completed = filtered.filter((item) => item.status === 'terlaksana');
  const upcoming = filtered.filter((item) => item.status === 'mendatang');

  return <div className="px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pt-32"><PageHero eyebrow="Program Kerja Resmi Kabinet 2026" title="Katalog & Dinamika" highlight="Program Kerja" accent="BEM FMIPA" subtitle="Wujud komitmen konkret Kabinet Gema Restorasi 87 dalam mengabdi, memberdayakan keilmuan sains, dan memperjuangkan aspirasi mahasiswa secara progresif, inklusif, dan transparan." searchPlaceholder="Cari Program Kerja Terlaksana..." searchValue={query} onSearchChange={(value) => { setQuery(value); setVisibleCount(6); }} /><div className="mx-auto mt-7 flex max-w-5xl flex-col gap-4 border-b border-line pb-8 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap items-center gap-2">{([['semua', `Semua Progja (${items.length})`], ['terlaksana', `Terlaksana (${items.filter((item) => item.status === 'terlaksana').length})`], ['mendatang', `Mendatang (${items.filter((item) => item.status === 'mendatang').length})`]]).map(([value, label]) => <button key={value} type="button" onClick={() => { setStatus(value as StatusFilter); setVisibleCount(6); }} className={`rounded-full border px-3 py-2 text-[10px] font-bold transition-colors ${status === value ? 'border-primary bg-primary text-white' : 'border-line bg-card text-body hover:border-primary hover:text-primary'}`}>{label}</button>)}<label className="relative"><select value={departmentId} onChange={(event) => { setDepartmentId(event.target.value); setVisibleCount(6); }} className="h-8 appearance-none rounded-full border border-line bg-card py-0 pl-3 pr-8 text-[10px] font-bold text-body outline-none hover:border-primary"><option value="semua">Biro & Departemen</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.short_name || department.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" /></label></div><AdminAddButton label="Tambah Progja" href="/dashboard/progja/new" /></div>{error ? <div className="mx-auto mt-10 max-w-5xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : <><CatalogSection title="Program Kerja Terlaksana" eyebrow="Selesai Dilaksanakan" description="Dokumentasi lengkap, laporan kinerja, dan jejak pertanggungjawaban kegiatan fungsionaris." count={completed.length} tone="green"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{completed.slice(0, visibleCount).map((item) => <ProgjaCard key={item.id} item={item} />)}</div>{completed.length === 0 && <EmptyState title="Belum ada program kerja terlaksana" description="Program kerja yang sudah selesai akan tampil di sini." />}{completed.length > visibleCount && <button type="button" onClick={() => setVisibleCount((current) => current + 6)} className="mx-auto mt-8 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-md shadow-primary/20">Lihat Lebih Banyak <CircleCheck className="h-3.5 w-3.5" /></button>}</CatalogSection><CatalogSection title="Program Kerja Mendatang" eyebrow="Agenda Dalam Persiapan" description="Inisiatif strategis yang akan segera direalisasikan pada semester mendatang." count={upcoming.length} tone="orange"><div className="space-y-3">{upcoming.map((item) => <UpcomingProgjaRow key={item.id} item={item} />)}</div>{upcoming.length === 0 && <EmptyState title="Belum ada agenda mendatang" description="Program kerja yang sedang dipersiapkan akan tampil di sini." />}</CatalogSection></>}</div>;
}

function CatalogSection({ title, eyebrow, description, count, tone, children }: { title: string; eyebrow: string; description: string; count: number; tone: 'green' | 'orange'; children: React.ReactNode }) {
  return <section className="mx-auto mt-20 max-w-7xl first:mt-16"><div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${tone === 'green' ? 'text-green' : 'text-orange'}`}><CircleDot className="h-3 w-3 fill-current" />{eyebrow}</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h2><p className="mt-1 text-sm text-body">{description}</p></div><span className="text-[10px] font-bold text-primary">Menampilkan {count} Program</span></div>{children}</section>;
}

import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import { ImageOrPlaceholder } from '@/frontend/components/public/ImageOrPlaceholder';
import type { ProgjaWithDepartment } from '@/backend/services/progja';

function categoryTone(category: string | null): string {
  const tones = ['bg-emerald-100 text-emerald-700', 'bg-blue-100 text-primary', 'bg-amber-100 text-amber-700', 'bg-teal-100 text-teal-700'];
  const value = category ?? 'Program Kerja';
  const hash = value.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return tones[hash % tones.length];
}

function dateLabel(item: ProgjaWithDepartment): string {
  if (item.date_label) return item.date_label;
  if (item.start_date && item.end_date && item.start_date !== item.end_date) return `${formatDate(item.start_date)} – ${formatDate(item.end_date)}`;
  return formatDate(item.start_date) || 'Tanggal menyusul';
}

function formatDate(value: string | null): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export function ProgjaCard({ item }: { item: ProgjaWithDepartment }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/progja/${item.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden"><ImageOrPlaceholder src={item.image_url} alt={item.title} width={800} className="transition-transform duration-500 group-hover:scale-105" /><span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${categoryTone(item.category)}`}>{item.category || 'Program Kerja'}</span><span className="absolute bottom-3 right-3 rounded-md bg-nav/90 px-2.5 py-1 text-[10px] font-bold text-white">{dateLabel(item)}</span></div>
        <div className="p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-primary">Dept. {item.department?.short_name || item.department?.name || 'BEM FMIPA'}</p><h3 className="mt-2 text-lg font-extrabold leading-tight tracking-tight text-ink">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-body">{item.short_description || 'Informasi program kerja akan segera diperbarui.'}</p><div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[10px] font-bold"><span className="inline-flex max-w-[65%] items-center gap-1.5 truncate text-body"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green" />{item.achievement_summary || (item.status === 'terlaksana' ? 'Program selesai' : 'Persiapan berjalan')}</span><span className="inline-flex items-center gap-1 text-primary">Lihat Detail <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span></div></div>
      </Link>
    </article>
  );
}

export function formatProgjaDate(value: string | null, fallback: string | null): { month: string; day: string; year: string } {
  if (!value) return { month: fallback || 'SEGERA', day: '', year: '' };
  const date = new Date(`${value}T00:00:00`);
  return { month: new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(date).toUpperCase(), day: new Intl.DateTimeFormat('id-ID', { day: '2-digit' }).format(date), year: new Intl.DateTimeFormat('id-ID', { year: 'numeric' }).format(date) };
}

export function UpcomingProgjaRow({ item }: { item: ProgjaWithDepartment }) {
  const date = formatProgjaDate(item.start_date, item.date_label);
  return <Link href={`/progja/${item.slug}`} className="group flex flex-col gap-4 rounded-2xl border border-line bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center"><span className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-soft text-primary"><small className="text-[9px] font-bold uppercase">{date.month}</small><strong className="text-xl font-extrabold leading-none">{date.day || date.year}</strong>{date.day && <small className="text-[9px] font-bold">{date.year}</small>}</span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-primary">{item.tag || 'AGENDA BEM FMIPA'}</span><span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-700">{item.category || 'Program Kerja'}</span><span className="text-[10px] font-bold text-amber-600">{item.department?.name || 'BEM FMIPA UNNES'}</span></div><h3 className="mt-2 text-lg font-extrabold tracking-tight text-ink group-hover:text-primary">{item.title}</h3><p className="mt-1 line-clamp-2 text-sm leading-6 text-body">{item.short_description || 'Inisiatif strategis yang akan segera direalisasikan.'}</p></div><MapPin className="ml-auto hidden h-4 w-4 shrink-0 text-muted sm:block" /></Link>;
}

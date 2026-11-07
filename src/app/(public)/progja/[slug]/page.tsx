import Link from 'next/link';
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getProgjaBySlug } from '@/backend/services/public';
import { ImageOrPlaceholder } from '@/frontend/components/public/ImageOrPlaceholder';
import { ProgjaCard } from '@/frontend/components/public/ProgjaCard';
import { Chip } from '@/frontend/components/public/Chip';

export const revalidate = 60;

function formatDate(value: string | null): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function dateLabel(start: string | null, end: string | null, fallback: string | null): string {
  if (start && end && start !== end) return `${formatDate(start)} – ${formatDate(end)}`;
  return formatDate(start) || fallback || 'Tanggal menyusul';
}

export default async function ProgjaDetailPage({ params }: { params: { slug: string } }) {
  const result = await getProgjaBySlug(params.slug);
  if (!result.data) notFound();
  const item = result.data;
  const paragraphs = (item.description || item.short_description || 'Informasi kegiatan belum tersedia.').split(/\n\s*\n/);
  return <div className="px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pt-32"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-muted"><Link href="/" className="hover:text-primary">Home</Link><span>/</span><Link href="/progja" className="hover:text-primary">Progja</Link><span>/</span><span className="truncate text-primary">{item.title}</span></div><h1 className="mx-auto mt-8 max-w-4xl text-center text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">{item.title}</h1><div className="mx-auto mt-10 max-w-xl rounded-2xl border border-line bg-card p-3 shadow-sm"><div className="relative aspect-[16/10] overflow-hidden rounded-xl"><ImageOrPlaceholder src={item.image_url} alt={item.title} width={900} /></div><div className="rounded-b-xl bg-nav px-4 py-3 text-white"><p className="text-[10px] font-bold uppercase tracking-wider text-accent">Arsip Resmi Kabinet</p><p className="mt-1 text-sm font-bold">{item.title}</p></div><p className="py-3 text-center text-[10px] font-semibold text-muted">Kabinet Gema Restorasi 87 • Periode 2026</p></div><article className="mx-auto mt-5 max-w-3xl rounded-2xl border border-line bg-card p-6 shadow-sm sm:p-8"><Chip>{item.status === 'terlaksana' ? 'Laporan Naratif Kegiatan' : 'Informasi Kegiatan'}</Chip><div className="mt-6 space-y-5">{paragraphs.map((paragraph, index) => <p key={index} className="text-sm leading-7 text-body">{paragraph}</p>)}</div><div className="mt-7 grid gap-3 border-t border-line pt-5 text-xs text-body sm:grid-cols-2"><Info icon={<Users className="h-4 w-4" />} label="Departemen" value={item.department?.name || 'BEM FMIPA UNNES'} /><Info icon={<MapPin className="h-4 w-4" />} label="Lokasi" value={item.location || 'Lokasi kegiatan menyusul'} /><Info icon={<CalendarDays className="h-4 w-4" />} label="Tanggal" value={dateLabel(item.start_date, item.end_date, item.date_label)} /><Info icon={<CheckCircle2 className="h-4 w-4" />} label="Capaian" value={item.achievement_summary || (item.status === 'terlaksana' ? 'Selesai dilaksanakan' : 'Dalam persiapan')} /></div></article>{item.status === 'terlaksana' && item.gallery.length > 0 && <section className="mt-20"><p className="text-[10px] font-bold uppercase tracking-wider text-primary">Galeri Dokumentasi Lengkap</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Dokumentasi Pelaksanaan Program Kerja</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{item.gallery.slice(0, 4).map((gallery) => <figure key={gallery.id ?? gallery.slot} className="overflow-hidden rounded-xl border border-line bg-card shadow-sm"><div className="aspect-[4/3]"><ImageOrPlaceholder src={gallery.image_url} alt={gallery.caption || item.title} width={600} /></div>{gallery.caption && <figcaption className="p-3 text-xs leading-5 text-body">{gallery.caption}</figcaption>}</figure>)}</div></section>}<div className="mt-16"><Link href="/progja" className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-4 py-2.5 text-xs font-bold text-body transition-colors hover:border-primary hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" />Kembali ke Katalog Program Kerja</Link><h2 className="mt-12 text-xl font-extrabold tracking-tight text-ink">Program Kerja Terkait Lainnya</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{item.related.map((related) => <ProgjaCard key={related.id} item={related} />)}</div></div></div></div>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-start gap-3"><span className="mt-0.5 text-primary">{icon}</span><span><strong className="block text-[10px] uppercase tracking-wide text-muted">{label}</strong><span className="mt-1 block font-semibold text-ink">{value}</span></span></div>;
}

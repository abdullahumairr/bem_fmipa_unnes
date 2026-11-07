import Link from 'next/link';
import { ExternalLink, UsersRound } from 'lucide-react';
import { ImageOrPlaceholder } from '@/frontend/components/public/ImageOrPlaceholder';
import type { Prestasi } from '@/backend/services/prestasi';

function dateLabel(value: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function statusTone(status: string): string {
  return /juara|medali/i.test(status) ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-primary';
}

export function PrestasiCard({ item }: { item: Prestasi }) {
  const caption = item.category === 'prestasi_mahasiswa' ? `Kategori: ${item.field_tag}` : `Penyelenggara: ${item.organizer}`;
  return <article className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"><div className="relative aspect-[16/9] overflow-hidden"><ImageOrPlaceholder src={item.image_url} alt={item.title} width={900} className="brightness-90" /><div className="absolute inset-0 bg-gradient-to-t from-nav/80 via-transparent to-nav/10" /><span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusTone(item.achievement_status)}`}>{item.achievement_status}</span><span className="absolute right-3 top-3 rounded-md bg-nav/85 px-2.5 py-1 text-[10px] font-bold text-white">{dateLabel(item.achieved_at)}</span><p className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-semibold text-white"><span className="h-3.5 w-3.5 rounded-full border border-white/70" />{caption}</p></div><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-primary">Tingkat {item.level} • {item.organizer}</p><h2 className="mt-2 text-lg font-extrabold leading-tight tracking-tight text-ink">{item.title}</h2><div className="mt-4 flex items-start gap-3 rounded-xl bg-primary-soft p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-primary"><UsersRound className="h-4 w-4" /></span><span><small className="block text-[10px] font-medium text-body">Penerima Penghargaan:</small><strong className="mt-0.5 block text-xs text-ink">{item.recipient}</strong></span></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-body">{item.description}</p>{item.proof_url && <Link href={item.proof_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">Lihat bukti resmi <ExternalLink className="h-3 w-3" /></Link>}</div></article>;
}

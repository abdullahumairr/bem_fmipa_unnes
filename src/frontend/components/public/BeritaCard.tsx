import { ArrowUpRight, BookOpen, CalendarDays, X } from 'lucide-react';
import type { Berita } from '@/backend/services/berita';
import { ImageOrPlaceholder } from '@/frontend/components/public/ImageOrPlaceholder';

function stripMarkdown(value: string): string {
  return value.replace(/[#*_>`~\[\]()]/g, '').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
}

function dateLabel(value: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

function tagTone(tag: string): string {
  const tones = ['bg-amber-100 text-amber-800', 'bg-blue-100 text-primary', 'bg-emerald-100 text-emerald-700', 'bg-teal-100 text-teal-700'];
  const hash = tag.split('').reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return tones[hash % tones.length];
}

export function BeritaCard({ item, expanded, onToggle }: { item: Berita; expanded: boolean; onToggle: () => void }) {
  return <article className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/5"><div className="relative aspect-[16/9] overflow-hidden"><ImageOrPlaceholder src={item.image_url} alt={item.title} width={900} /><div className="absolute inset-0 bg-gradient-to-t from-nav via-nav/10 to-nav/20" /><span className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-bold ${tagTone(item.tag_category)}`}><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />{item.tag_category}</span><span className="absolute right-4 top-4 rounded-md bg-nav/85 px-2.5 py-1 text-[10px] font-bold text-white">Baca {item.read_minutes} Menit</span><div className="absolute inset-x-4 bottom-4"><p className="text-[10px] font-medium text-white/80">Dipublikasikan {dateLabel(item.published_at)}</p><h2 className="mt-1 text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">{item.title}</h2></div></div><div className="p-5"><p className="flex items-center gap-2 text-xs font-bold text-primary"><CalendarDays className="h-3.5 w-3.5" />{item.department?.name || 'BEM FMIPA UNNES'}</p>{expanded ? <div className="mt-4 space-y-4 text-sm leading-7 text-body">{item.content.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{stripMarkdown(paragraph)}</p>)}</div> : <p className="mt-4 line-clamp-4 text-sm leading-6 text-body">{stripMarkdown(item.content)}</p>}{item.post_type === 'dengan_aksi' && item.action_url && <a href={item.action_url} target="_blank" rel="noreferrer" className={`mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold text-white ${tagTone(item.tag_category).includes('amber') ? 'bg-orange' : 'bg-primary'}`}><ArrowUpRight className="h-3.5 w-3.5" />{item.action_label || 'Daftar Sekarang'}</a>}{item.action_deadline && item.post_type === 'dengan_aksi' && <p className="mt-2 text-[10px] font-semibold text-body">Pendaftaran dibuka hingga {dateLabel(item.action_deadline)}</p>}<button type="button" onClick={onToggle} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline">{expanded ? <>Tutup <X className="h-3.5 w-3.5" /></> : <>Baca selengkapnya <BookOpen className="h-3.5 w-3.5" /></>}</button></div></article>;
}

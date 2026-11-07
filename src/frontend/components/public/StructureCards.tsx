import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ImageOrPlaceholder } from '@/frontend/components/public/ImageOrPlaceholder';
import type { Department, DepartmentMember } from '@/backend/services/struktur';

export function labelProdi(studyProgram: string | null, batch: string | null): string {
  return [studyProgram, batch].filter(Boolean).join(' • ') || 'Fungsionaris BEM FMIPA';
}

export function PersonCard({ person, role }: { person: DepartmentMember; role?: string }) {
  return <article className="relative rounded-2xl bg-gradient-to-b from-[#045CB4] via-[#6E8F87] to-[#F1C536] p-[3px] shadow-sm"><div className="rounded-[13px] bg-card p-2 pb-4"><span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#045CB4] px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-white">{role || person.position}</span><div className="aspect-[4/5] overflow-hidden rounded-xl bg-slate-100"><ImageOrPlaceholder src={person.image_url} alt={person.full_name} width={500} className="min-h-0" /></div><h3 className="mt-3 text-center text-sm font-extrabold text-ink">{person.full_name}</h3><p className="mt-1 text-center text-[10px] font-bold text-primary">{labelProdi(person.study_program, person.batch)}</p></div></article>;
}

export function EmptyPersonCard({ name, role, studyProgram, batch }: { name: string; role: string; studyProgram?: string | null; batch?: string | null }) {
  return <article className="relative rounded-2xl bg-gradient-to-b from-[#045CB4] via-[#6E8F87] to-[#F1C536] p-[3px] shadow-sm"><div className="rounded-[13px] bg-card p-2 pb-4"><span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#045CB4] px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-white">{role}</span><div className="flex aspect-[4/5] items-center justify-center rounded-xl bg-slate-100"><span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-soft text-2xl font-extrabold text-primary">{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span></div><h3 className="mt-3 text-center text-sm font-extrabold text-ink">{name}</h3><p className="mt-1 text-center text-[10px] font-bold text-primary">{labelProdi(studyProgram ?? null, batch ?? null)}</p></div></article>;
}

export function DepartmentDirectoryCard({ department, index }: { department: Department; index: number }) {
  return <Link href={`/struktur/${department.slug}`} className="group rounded-2xl border border-line bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"><span className="text-2xl font-extrabold text-primary/20">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-4 text-sm font-extrabold leading-tight text-ink group-hover:text-primary">{department.name}</h3><p className="mt-2 line-clamp-3 text-xs leading-5 text-body">{department.description || 'Informasi departemen dan fokus kerja akan segera diperbarui.'}</p><span className="mt-5 inline-flex items-center gap-1 text-[10px] font-bold text-primary">Lihat detail <ArrowUpRight className="h-3 w-3" /></span></Link>;
}


import { Search } from 'lucide-react';
import { Chip } from '@/frontend/components/public/Chip';

export function PageHero({ eyebrow, title, highlight, accent, subtitle, searchPlaceholder, searchValue, onSearchChange }: { eyebrow: string; title: string; highlight?: string; accent: string; subtitle: string; searchPlaceholder?: string; searchValue?: string; onSearchChange?: (value: string) => void }) {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <Chip>{eyebrow}</Chip>
      <h1 className="heading-6xl mt-6 text-6xl font-extrabold leading-[1.12] tracking-tight text-ink">
        {title} <span className="text-primary">{highlight ?? 'BEM FMIPA'}</span> <span className="text-accent">{accent}</span>
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-body sm:text-base">{subtitle}</p>
      {searchPlaceholder && <label className="mx-auto mt-7 flex max-w-xl items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 text-left shadow-sm"><Search className="h-4 w-4 shrink-0 text-muted" /><input value={searchValue} onChange={onSearchChange ? (event) => onSearchChange(event.target.value) : undefined} className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted" placeholder={searchPlaceholder} aria-label={searchPlaceholder} /></label>}
    </section>
  );
}

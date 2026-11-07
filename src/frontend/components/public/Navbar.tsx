'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ASPIRASI_URL } from '@/frontend/content/site';

const links = [
  { href: '/', label: 'Home' },
  { href: '/struktur', label: 'Struktur' },
  { href: '/progja', label: 'Progja' },
  { href: '/prestasi', label: 'Prestasi' },
  { href: '/berita', label: 'Berita' },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full bg-nav px-4 py-3 text-white shadow-xl shadow-slate-300/25 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Logo BEM FMIPA UNNES" width={34} height={34} className="h-8 w-8 object-contain" priority />
          <span className="leading-tight"><strong className="block text-[11px] font-extrabold tracking-tight">BEM FMIPA UNNES</strong><small className="block text-[8px] font-semibold tracking-wide text-slate-300">GEMA RESTORASI 87</small></span>
        </Link>
        <div className="hidden items-center gap-7 md:flex">{links.map((link) => { const active = pathname === link.href; return <Link key={link.href} href={link.href} className={`relative py-2 text-xs font-semibold transition-colors ${active ? 'text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent' : 'text-slate-300 hover:text-white'}`}>{link.label}</Link>; })}</div>
        <Link href={ASPIRASI_URL} className="hidden rounded-full bg-accent px-4 py-2 text-[11px] font-extrabold text-ink transition-transform hover:-translate-y-0.5 sm:inline-flex">Aspirasi</Link>
        <button type="button" className="rounded-lg p-2 text-white md:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Tutup menu' : 'Buka menu'}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </nav>
      {open && <div className="mx-auto mt-2 max-w-7xl rounded-2xl bg-nav p-3 shadow-xl md:hidden">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10">{link.label}</Link>)}<Link href={ASPIRASI_URL} onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-accent px-4 py-3 text-center text-sm font-extrabold text-ink">Aspirasi</Link></div>}
    </header>
  );
}

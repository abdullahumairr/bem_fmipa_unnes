'use client';

import { ArrowUp, Instagram, Mail, Phone } from 'lucide-react';
import { CONTACT, SOCIAL_LINKS } from '@/frontend/content/site';

export function Footer() {
  return (
    <footer className="border-t border-line bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 text-xs text-body sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 BEM FMIPA UNNES (Kabinet Gema Restorasi 87). All rights reserved. Built with Next.js &amp; Tailwind CSS</p>
        <div className="flex items-center gap-4">
          <a href={SOCIAL_LINKS.instagram} aria-label="Instagram" className="transition-colors hover:text-primary"><Instagram className="h-4 w-4" /></a>
          <a href={SOCIAL_LINKS.phone} aria-label={`Telepon ${CONTACT.phone}`} className="transition-colors hover:text-primary"><Phone className="h-4 w-4" /></a>
          <a href={SOCIAL_LINKS.email} aria-label={`Email ${CONTACT.email}`} className="transition-colors hover:text-primary"><Mail className="h-4 w-4" /></a>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-2 text-[11px] font-bold text-primary">Back to top <ArrowUp className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </footer>
  );
}

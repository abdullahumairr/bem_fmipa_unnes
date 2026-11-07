'use client';

import { useEffect, useRef, useState } from 'react';
import type { Jabatan } from '@/frontend/content/struktur-static';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function initials(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

// URL Cloudinary otomatis dioptimalkan: format modern, kualitas otomatis, potret 4:5, fokus ke wajah
function optimize(url: string): string {
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/') || url.includes('f_auto')) return url;
  return url.replace('/upload/', '/upload/f_auto,q_auto,c_fill,ar_4:5,g_auto,w_600/');
}

export function PersonCard({ person }: { person: Jabatan }) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  // Foto: person.foto kalau diisi, kalau tidak otomatis /public/fungsionaris/<nama-huruf-kecil-pakai-strip>.jpg
  const label =
    [person.prodi ? `S1 ${person.prodi}` : '', person.angkatan ? `'${person.angkatan}` : ''].filter(Boolean).join(' ') ||
    'Fungsionaris BEM FMIPA';
  const src = optimize(person.foto || `/fungsionaris/${toSlug(person.nama)}.jpg`);

  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete && image.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="relative">
      <span className="absolute -top-3 left-1/2 z-10 max-w-[92%] -translate-x-1/2 rounded-2xl bg-primary px-3 py-1 text-center text-[10px] font-bold uppercase leading-tight tracking-wider text-white">
        {person.jabatan}
      </span>
      <div className="rounded-2xl bg-gradient-to-b from-primary via-primary to-accent p-[3px] shadow-sm">
        <div className="rounded-[13px] bg-card px-3 pb-5 pt-5">
          <div className="aspect-[4/5] overflow-hidden rounded-xl bg-slate-200">
            {failed ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-100 to-slate-300 text-5xl font-extrabold text-slate-400">
                {initials(person.nama)}
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imageRef}
                src={src}
                alt={person.nama}
                loading="lazy"
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <h3 className="mt-4 text-center text-ink">{person.nama}</h3>
          <p className="mt-1 text-center text-xs font-bold text-primary">{label}</p>
        </div>
      </div>
    </div>
  );
}
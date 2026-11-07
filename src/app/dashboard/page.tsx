'use client';

import Link from 'next/link';
import {
  Activity,
  Trophy,
  Newspaper,
  Layers,
  Network,
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@ui/card';

const items = [
  {
    href: '/dashboard/health',
    title: 'Status Koneksi',
    description: 'Cek koneksi Supabase dan Cloudinary.',
    icon: Activity,
  },
  {
    href: '/dashboard/progja',
    title: 'Program Kerja',
    description: 'Kelola program kerja BEM.',
    icon: Layers,
  },
  {
    href: '/dashboard/prestasi',
    title: 'Prestasi',
    description: 'Kelola prestasi dan apresiasi.',
    icon: Trophy,
  },
  {
    href: '/dashboard/berita',
    title: 'Berita',
    description: 'Kelola berita dan warta.',
    icon: Newspaper,
  },
  {
    href: '/dashboard/struktur',
    title: 'Departemen',
    description: 'Kelola departemen, agenda, dan anggota.',
    icon: Network,
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selamat datang di panel admin BEM FMIPA UNNES.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block">
            <Card className="h-full transition-colors hover:border-foreground/20 hover:bg-muted/30">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-5 w-5 text-foreground" />
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

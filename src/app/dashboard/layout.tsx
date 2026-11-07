'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  CalendarDays,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  Settings,
  Trophy,
  X,
} from 'lucide-react';

import { useAuth } from '@/frontend/context/auth-context';
import { Button } from '@ui/button';

const menuGroups = [
  {
    label: 'Manajemen Konten',
    items: [
      { href: '/dashboard/progja', label: 'Program Kerja', icon: CalendarDays },
      { href: '/dashboard/prestasi', label: 'Prestasi Mahasiswa', icon: Trophy },
      { href: '/dashboard/berita', label: 'Berita & Warta', icon: FileText },
      { href: '/dashboard/struktur', label: 'Struktur Organisasi', icon: Network },
    ],
  },
  {
    label: 'Sistem & Referensi',
    items: [
      { href: '/dashboard/account', label: 'Pengaturan Akun', icon: Settings },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFF]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0B57C4] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.replace('/login');
    return <div className="min-h-screen bg-[#F8FAFF]" />;
  }

  if (role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFF] px-4">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Akun kamu belum punya akses admin
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Hubungi pengurus BEM FMIPA UNNES untuk mendapatkan akses admin.
          </p>
          <Button
            className="mt-6"
            variant="outline"
            onClick={async () => {
              await signOut();
              router.push('/login');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Keluar Sesi
          </Button>
        </div>
      </div>
    );
  }

  const currentMenu = menuGroups
    .flatMap((group) => group.items)
    .find((item) => pathname.startsWith(item.href));
  const pageLabel = currentMenu?.label ?? 'Dashboard';
  const isProgjaForm = pathname.startsWith('/dashboard/progja/new') || pathname.includes('/dashboard/progja/') && pathname.endsWith('/edit');
  const isStrukturForm = pathname.startsWith('/dashboard/struktur/new') || pathname.includes('/dashboard/struktur/') && pathname.endsWith('/edit');

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-900">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[66px] items-center justify-between border-b border-slate-100 px-4">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B57C4] text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] font-extrabold tracking-tight text-slate-900">
                BEM FMIPA UNNES
              </span>
              <span className="block text-[9px] font-bold tracking-wide text-[#0B57C4]">
                ADMIN PORTAL CMS
              </span>
            </span>
          </Link>
          <button
            className="rounded-md p-1 text-slate-400 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
              pathname === '/dashboard'
                ? 'bg-[#0B57C4] text-white shadow-sm'
                : 'text-slate-600 hover:bg-blue-50 hover:text-[#0B57C4]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-[#0B57C4] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-blue-50 hover:text-[#0B57C4]'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-2 border-t border-slate-100 p-3">
          <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-3 text-[11px] text-slate-500">
            <span className="block truncate">{user.email}</span>
            <span className="mt-1 block font-semibold text-[#0B57C4]">Administrator</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Tutup navigasi"
        />
      )}

      <div className="min-h-screen lg:pl-[240px]">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-[66px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Buka menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <div className="mb-1 flex items-center gap-2 text-[10px] font-medium text-slate-400">
                  <span>Dashboard</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-semibold text-[#0B57C4]">{pageLabel}</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  {isProgjaForm
                    ? pathname.includes('/new')
                      ? 'Formulir Tambah Program Kerja'
                      : 'Formulir Edit Program Kerja'
                    : pathname.startsWith('/dashboard/berita/') && pathname.endsWith('/edit')
                      ? 'Formulir Edit Berita & Warta'
                      : pathname === '/dashboard/berita/new'
                        ? 'Formulir Tambah Berita & Warta'
                        : isStrukturForm
                          ? pathname.includes('/new')
                            ? 'Formulir Tambah Departemen & Fungsionaris'
                            : 'Formulir Edit Departemen & Fungsionaris'
                          : pageLabel === 'Program Kerja'
                            ? 'Pengelolaan Program Kerja'
                            : pageLabel === 'Struktur Organisasi'
                              ? 'Pengelolaan Departemen'
                              : pageLabel}
                </h1>
              </div>
            </div>
            {(pathname === '/dashboard/progja' || pathname === '/dashboard/prestasi' || pathname === '/dashboard/berita' || pathname === '/dashboard/struktur') && (
              <div className="hidden items-center gap-4 sm:flex">
                <div className="text-right text-[10px] leading-4 text-slate-400">
                  <span className="block font-semibold text-slate-600">Formulir Penuh Terintegrasi</span>
                  <span className="font-semibold text-[#0B57C4]">Buka Halaman Form Input →</span>
                </div>
                <Link
                  href={pathname === '/dashboard/prestasi' ? '/dashboard/prestasi/new' : pathname === '/dashboard/berita' ? '/dashboard/berita/new' : pathname === '/dashboard/struktur' ? '/dashboard/struktur/new' : '/dashboard/progja/new'}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0B57C4] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  <span className="text-base">+</span>
                  {pathname === '/dashboard/prestasi' ? 'Tambah Prestasi Baru' : pathname === '/dashboard/berita' ? 'Tambah Berita Baru' : pathname === '/dashboard/struktur' ? 'Tambah Departemen Baru' : 'Tambah Progja Baru'}
                </Link>
              </div>
            )}
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 lg:px-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white px-4 py-5 text-[10px] text-slate-500 sm:px-7 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 sm:flex-row">
            <span>© 2026 BEM FMIPA UNNES (Kabinet Gema Restorasi 87), CMS Sistem Informasi Terpadu.</span>
            <div className="flex gap-4">
              <span>Panduan Administrator</span>
              <span className="text-slate-300">•</span>
              <span>Log Perubahan</span>
              <span className="text-slate-300">•</span>
              <span>Status Server: Normal</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

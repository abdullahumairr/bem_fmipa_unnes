'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Edit3, Loader2, Plus, Search, Trash2, Users } from 'lucide-react';
import {
  deleteDepartment,
  getDepartments,
  type DepartmentWithCounts,
} from '@/backend/services/struktur';
import { StatCard } from '@/frontend/components/StatCard';
import { Input } from '@ui/input';

type Tab = 'semua' | 'dengan_progja' | 'tanpa_progja';

export default function StrukturPage() {
  const [items, setItems] = useState<DepartmentWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('semua');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const result = await getDepartments();
    setItems(result.data);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        item.short_name.toLowerCase().includes(needle);
      const matchesTab =
        tab === 'semua' ||
        (tab === 'dengan_progja' && Boolean(item.featured_progja_title)) ||
        (tab === 'tanpa_progja' && !item.featured_progja_title);
      return matchesQuery && matchesTab;
    });
  }, [items, query, tab]);

  const totalMembers = useMemo(
    () => items.reduce((sum, item) => sum + item.member_count, 0),
    [items]
  );
  const totalAgendas = useMemo(
    () => items.reduce((sum, item) => sum + item.agenda_count, 0),
    [items]
  );

  async function remove(id: string, name: string) {
    if (!window.confirm(`Hapus departemen “${name}” beserta agenda dan anggotanya?`)) return;
    setDeletingId(id);
    const result = await deleteDepartment(id);
    setDeletingId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
  }

  const tabs: { value: Tab; label: string; count: number }[] = [
    { value: 'semua', label: 'Semua', count: items.length },
    {
      value: 'dengan_progja',
      label: 'Dengan Progja',
      count: items.filter((item) => item.featured_progja_title).length,
    },
    {
      value: 'tanpa_progja',
      label: 'Tanpa Progja',
      count: items.filter((item) => !item.featured_progja_title).length,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Pengelolaan Departemen</h2>
          <p className="mt-1 text-xs text-slate-500">
            Kelola profil departemen, program kerja unggulan, agenda, dan anggota BEM FMIPA UNNES.
          </p>
        </div>
        <Link
          href="/dashboard/struktur/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0B57C4] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Departemen Baru
        </Link>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3 text-xs leading-5 text-slate-600">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0B57C4] text-[10px] font-bold text-white">i</span>
        <span>
          Data Pengurus Harian, Biro, dan Kepala Departemen dikelola statis di kode Frontend. CMS ini untuk profil departemen, progja unggulan, agenda kerja, dan anggota.
        </span>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button className="font-semibold underline" onClick={loadData}>Coba lagi</button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Departemen" value={items.length} suffix="Departemen" note="Profil aktif BEM FMIPA" icon={<BuildingIcon />} />
        <StatCard label="Total Anggota & Staf" value={totalMembers} suffix="Anggota" note="Tersebar di seluruh departemen" icon={<Users className="h-4 w-4" />} />
        <StatCard label="Agenda Terjadwal" value={totalAgendas} suffix="Agenda" note="Agenda kerja departemen" icon={<CalendarIcon />} />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="relative min-w-[230px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama departemen atau singkatan..."
            className="h-10 pl-9 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
          {tabs.map((item) => (
            <button
              key={item.value}
              onClick={() => setTab(item.value)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[11px] font-bold transition-colors ${
                tab === item.value ? 'bg-white text-[#0B57C4] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {item.label}
              <span className={`rounded-full px-1.5 text-[9px] ${tab === item.value ? 'bg-blue-100 text-[#0B57C4]' : 'bg-slate-200 text-slate-500'}`}>{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="border-b border-slate-100 bg-[#F8FAFF] text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-4">#</th>
                <th className="px-4 py-4">Departemen</th>
                <th className="px-4 py-4">Progja Unggulan</th>
                <th className="px-4 py-4">Agenda</th>
                <th className="px-4 py-4">Anggota</th>
                <th className="px-4 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-500">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-[#0B57C4]" />
                    Memuat data departemen...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-500">
                    Tidak ada departemen yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => {
                  const hasProgja = Boolean(item.featured_progja_title);
                  return (
                    <tr key={item.id} className="hover:bg-blue-50/30">
                      <td className="px-4 py-4 text-xs text-slate-400">{index + 1}</td>
                      <td className="max-w-[300px] px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-extrabold text-[#0B57C4]">
                            {item.short_name || item.name.slice(0, 3).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-800">{item.name}</p>
                            <p className="mt-0.5 truncate text-[10px] text-slate-500">{item.focus_subtitle || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="max-w-[280px] px-4 py-4">
                        {hasProgja ? (
                          <div>
                            <p className="truncate text-xs font-bold text-slate-800">{item.featured_progja_title}</p>
                            <span className="mt-1 inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Progja Ada</span>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-medium text-slate-500">Fokus Agenda Rutin</p>
                            <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Tanpa Progja</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-600">
                        {item.agenda_count} <span className="font-normal text-slate-400">Agenda Aktif</span>
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-slate-600">
                        {item.member_count} <span className="font-normal text-slate-400">Anggota</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1">
                          <Link href={`/dashboard/struktur/${item.id}/edit`} className="rounded-md p-2 text-[#0B57C4] hover:bg-blue-50" aria-label={`Edit ${item.name}`}>
                            <Edit3 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => remove(item.id, item.name)}
                            disabled={deletingId === item.id}
                            className="rounded-md p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            aria-label={`Hapus ${item.name}`}
                          >
                            {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
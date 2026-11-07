'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Edit3,
  Eye,
  FolderKanban,
  Loader2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';

import {
  deleteProgja,
  getProgjaData,
  type DepartmentOption,
  type ProgjaWithDepartment,
} from '@/backend/services/progja';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { StatCard } from '@/frontend/components/StatCard';

const PAGE_SIZE = 8;

type StatusFilter = 'semua' | 'terlaksana' | 'mendatang';

function formatDate(date: string | null): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

function scheduleLabel(item: ProgjaWithDepartment): string {
  if (item.date_label) return item.date_label;
  if (item.start_date && item.end_date && item.start_date !== item.end_date) {
    return `${formatDate(item.start_date)} – ${formatDate(item.end_date)}`;
  }
  return formatDate(item.start_date) || 'Jadwal belum ditentukan';
}

function StatusBadge({ status }: { status: ProgjaWithDepartment['status'] }) {
  const completed = status === 'terlaksana';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        completed
          ? 'border-blue-200 bg-blue-50 text-[#0B57C4]'
          : 'border-amber-200 bg-amber-50 text-amber-700'
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {completed ? 'Terlaksana' : 'Mendatang'}
    </span>
  );
}

export default function ProgjaPage() {
  const [items, setItems] = useState<ProgjaWithDepartment[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('semua');
  const [departmentId, setDepartmentId] = useState('semua');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const result = await getProgjaData();
    setItems(result.progja);
    setDepartments(result.departments);
    setError(result.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(
    () => ({
      total: items.length,
      completed: items.filter((item) => item.status === 'terlaksana').length,
      upcoming: items.filter((item) => item.status === 'mendatang').length,
    }),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.short_description ?? '').toLowerCase().includes(query);
      const matchesStatus = status === 'semua' || item.status === status;
      const matchesDepartment =
        departmentId === 'semua' || item.department_id === departmentId;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [items, search, status, departmentId]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const visibleItems = filteredItems.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const firstShown = filteredItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(page * PAGE_SIZE, filteredItems.length);

  useEffect(() => {
    setPage(1);
  }, [search, status, departmentId]);

  async function handleDelete(item: ProgjaWithDepartment) {
    const confirmed = window.confirm(
      `Hapus program kerja “${item.title}”? Data dan gambar utamanya akan dihapus.`
    );
    if (!confirmed) return;

    setDeletingId(item.id);
    const result = await deleteProgja(item.id);
    setDeletingId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full sm:max-w-[235px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama progja..."
              className="h-10 rounded-lg border-slate-300 bg-white pl-9 text-xs placeholder:text-slate-400"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-600 outline-none focus:border-[#0B57C4] focus:ring-2 focus:ring-blue-100"
            aria-label="Filter status"
          >
            <option value="semua">Semua Status</option>
            <option value="terlaksana">Terlaksana</option>
            <option value="mendatang">Mendatang</option>
          </select>
          <select
            value={departmentId}
            onChange={(event) => setDepartmentId(event.target.value)}
            className="h-10 max-w-full rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-600 outline-none focus:border-[#0B57C4] focus:ring-2 focus:ring-blue-100"
            aria-label="Filter departemen"
          >
            <option value="semua">Semua Biro / Departemen</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <Link
          href="/dashboard/progja/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0B57C4] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 sm:hidden"
        >
          <Plus className="h-4 w-4" />
          Tambah Progja Baru
        </Link>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button className="font-semibold underline" onClick={loadData}>
            Coba lagi
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Program Kerja"
          value={stats.total}
          suffix="Progja"
          note="Periode Aktif 2026"
          icon={<FolderKanban className="h-4 w-4" />}
        />
        <StatCard
          label="Progja Terlaksana"
          value={stats.completed}
          suffix="Progja"
          note="Lengkap dengan dokumentasi"
          icon={<Check className="h-4 w-4" />}
        />
        <StatCard
          label="Progja Mendatang"
          value={stats.upcoming}
          suffix="Progja"
          note="Persiapan & open volunteer"
          icon={<Clock3 className="h-4 w-4" />}
        />
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <label className="flex items-center gap-2 text-slate-600">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#0B57C4]" />
            Pilih Semua ({visibleItems.length} ditampilkan)
          </label>
          <label className="flex items-center gap-2 text-slate-500">
            Urutkan:
            <select className="border-0 bg-transparent p-0 font-bold text-[#0B57C4] outline-none">
              <option>Jadwal Terbaru</option>
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="border-b border-slate-100 bg-[#F8FAFF] text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-10 px-4 py-4" />
                <th className="px-4 py-4">Program Kerja & Banner</th>
                <th className="px-4 py-4">Departemen / Biro</th>
                <th className="px-4 py-4">Jadwal</th>
                <th className="px-4 py-4">Status & Capaian</th>
                <th className="px-4 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-500">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-[#0B57C4]" />
                    Memuat data program kerja...
                  </td>
                </tr>
              ) : visibleItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-slate-500">
                    Tidak ada program kerja yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                visibleItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-blue-50/30">
                    <td className="px-4 py-3 align-middle">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-[#0B57C4]" aria-label={`Pilih ${item.title}`} />
                    </td>
                    <td className="max-w-[330px] px-4 py-3 align-middle">
                      <div className="flex min-w-0 items-center gap-3">
                        {item.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image_url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0B57C4]">
                            <CalendarDays className="h-4 w-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-800">{item.title}</p>
                          <p className="truncate text-[10px] text-slate-500">{item.short_description || 'Belum ada deskripsi singkat.'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-[#0B57C4]">
                        {item.department?.short_name || item.department?.name || 'Belum ditentukan'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-middle text-[11px] font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                        {scheduleLabel(item)}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <StatusBadge status={item.status} />
                      <p className="mt-1 max-w-[160px] truncate text-[10px] text-slate-500">
                        {item.achievement_summary || item.tag || 'Belum ada capaian'}
                      </p>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex justify-end gap-1">
                        <Link href={`/dashboard/progja/${item.id}`} className="rounded-md p-2 text-[#0B57C4] hover:bg-blue-50" aria-label={`Lihat ${item.title}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link href={`/dashboard/progja/${item.id}/edit`} className="rounded-md p-2 text-[#0B57C4] hover:bg-blue-50" aria-label={`Edit ${item.title}`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="rounded-md p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          aria-label={`Hapus ${item.title}`}
                        >
                          {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>
            Menampilkan <strong className="text-slate-800">{firstShown}–{lastShown}</strong> dari <strong className="text-slate-800">{filteredItems.length}</strong> Program Kerja
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[11px] font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).slice(0, 5).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`h-8 min-w-8 rounded-md px-2 text-[11px] font-bold ${page === pageNumber ? 'bg-[#0B57C4] text-white' : 'text-slate-600 hover:bg-blue-50'}`}
              >
                {pageNumber}
              </button>
            ))}
            <button
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              disabled={page === pageCount}
              className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-[11px] font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              Selanjutnya <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


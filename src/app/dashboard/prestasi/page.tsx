'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Edit3, Eye, Loader2, Search, Trash2, Trophy } from 'lucide-react';
import { deletePrestasi, getPrestasi, type Prestasi, type PrestasiLevel } from '@/backend/services/prestasi';
import { StatCard } from '@/frontend/components/StatCard';
import { Input } from '@ui/input';

const PAGE_SIZE = 6;
const levels: PrestasiLevel[] = ['internasional', 'nasional', 'universitas', 'fakultas'];
const levelLabel: Record<PrestasiLevel, string> = {
  internasional: 'Internasional', nasional: 'Nasional', universitas: 'Universitas', fakultas: 'Fakultas',
};

function dateLabel(value: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export default function PrestasiPage() {
  const [items, setItems] = useState<Prestasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('semua');
  const [field, setField] = useState('semua');
  const [order, setOrder] = useState<'baru' | 'lama'>('baru');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    getPrestasi().then((result) => {
      setItems(result.data);
      setError(result.error);
      setLoading(false);
    });
  }, []);

  const fields = useMemo(() => Array.from(new Set(items.map((item) => item.field_tag).filter(Boolean))).sort(), [items]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items
      .filter((item) => {
        const matchesQuery = !needle || `${item.title} ${item.recipient}`.toLowerCase().includes(needle);
        return matchesQuery && (level === 'semua' || item.level === level) && (field === 'semua' || item.field_tag === field);
      })
      .sort((a, b) => order === 'baru' ? b.achieved_at.localeCompare(a.achieved_at) : a.achieved_at.localeCompare(b.achieved_at));
  }, [items, query, level, field, order]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function remove(id: string, ask = true): Promise<void> {
    if (ask && !window.confirm('Hapus prestasi ini beserta gambar utamanya?')) return;
    setDeleting(id);
    const result = await deletePrestasi(id);
    setDeleting(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    setSelected((current) => current.filter((value) => value !== id));
  }

  async function bulkRemove(): Promise<void> {
    if (!selected.length || !window.confirm(`Hapus ${selected.length} prestasi terpilih?`)) return;
    for (const id of selected) await remove(id, false);
  }

  function toggleSelected(id: string): void {
    setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  const allVisibleSelected = visible.length > 0 && visible.every((item) => selected.includes(item.id));

  return (
    <div className="space-y-5">
      <div className="flex justify-end sm:hidden">
        <Link href="/dashboard/prestasi/new" className="rounded-lg bg-[#0B57C4] px-4 py-2.5 text-xs font-bold text-white">+ Tambah Prestasi Baru</Link>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Prestasi Terdata" value={items.length} suffix="Capaian" note="Periode Aktif 2026" icon={<Trophy className="h-4 w-4" />} />
        <StatCard label="Nasional / Internasional" value={items.filter((item) => item.level === 'nasional' || item.level === 'internasional').length} suffix="Prestasi" note="Belmawa, Puspresnas, Kemdikbud" icon={<Trophy className="h-4 w-4" />} />
        <StatCard label="Tingkat Univ / Fakultas" value={items.filter((item) => item.level === 'universitas' || item.level === 'fakultas').length} suffix="Penghargaan" note="FMIPA Award & Ormawa Terbaik" icon={<Trophy className="h-4 w-4" />} />
      </div>
      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative min-w-[230px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari nama kompetisi, delegasi, peraih prestasi..." className="h-10 pl-9 text-xs" /></div>
        <select value={level} onChange={(event) => { setLevel(event.target.value); setPage(1); }} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs"><option value="semua">Semua Tingkat</option>{levels.map((value) => <option key={value} value={value}>{levelLabel[value]}</option>)}</select>
        <select value={field} onChange={(event) => { setField(event.target.value); setPage(1); }} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs"><option value="semua">Semua Bidang</option>{fields.map((value) => <option key={value} value={value}>{value}</option>)}</select>
        <select value={order} onChange={(event) => setOrder(event.target.value as 'baru' | 'lama')} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs"><option value="baru">Capaian Terbaru</option><option value="lama">Capaian Terlama</option></select>
      </div>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 text-xs">
          <label className="flex items-center gap-2"><input type="checkbox" checked={allVisibleSelected} onChange={(event) => setSelected(event.target.checked ? Array.from(new Set([...selected, ...visible.map((item) => item.id)])) : selected.filter((id) => !visible.some((item) => item.id === id)))} className="accent-[#0B57C4]" /> Pilih Semua ({selected.length} dipilih)</label>
          {selected.length > 0 && <button onClick={bulkRemove} className="font-bold text-red-600">Hapus Terpilih</button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-[#F8FAFF] text-[10px] font-bold uppercase text-slate-500"><tr><th className="px-4 py-4">#</th><th className="px-4 py-4">Prestasi & Judul Kegiatan</th><th className="px-4 py-4">Peraih / Delegasi</th><th className="px-4 py-4">Tingkat & Penyelenggara</th><th className="px-4 py-4">Tanggal Capaian</th><th className="px-4 py-4">Status Rekognisi</th><th className="px-4 py-4 text-right">Aksi</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? <tr><td colSpan={7} className="p-14 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-[#0B57C4]" /></td></tr> : visible.length === 0 ? <tr><td colSpan={7} className="p-14 text-center text-sm text-slate-500">Tidak ada prestasi yang sesuai.</td></tr> : visible.map((item, index) => (
                <tr key={item.id} className="hover:bg-blue-50/30"><td className="px-4 py-4 text-xs text-slate-500"><div className="flex items-center gap-3"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelected(item.id)} className="accent-[#0B57C4]" aria-label={`Pilih ${item.title}`} />{(page - 1) * PAGE_SIZE + index + 1}</div></td><td className="max-w-[280px] px-4 py-4"><p className="text-xs font-bold text-slate-800">{item.title}</p><p className="mt-1 text-[10px] text-slate-500">{item.field_tag}</p></td><td className="max-w-[220px] px-4 py-4 text-xs text-slate-700">{item.recipient}</td><td className="px-4 py-4"><span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-[#0B57C4]">{levelLabel[item.level]}</span><p className="mt-1 max-w-[170px] text-[10px] text-slate-500">{item.organizer}</p></td><td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600"><CalendarDays className="mr-1 inline h-3.5 w-3.5 text-slate-400" />{dateLabel(item.achieved_at)}</td><td className="px-4 py-4"><span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">{item.achievement_status}</span></td><td className="px-4 py-4"><div className="flex justify-end gap-1"><Link href={`/dashboard/prestasi/${item.id}`} className="p-2 text-[#0B57C4]"><Eye className="h-4 w-4" /></Link><Link href={`/dashboard/prestasi/${item.id}/edit`} className="p-2 text-[#0B57C4]"><Edit3 className="h-4 w-4" /></Link><button onClick={() => remove(item.id)} disabled={deleting === item.id} className="p-2 text-red-600">{deleting === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button></div></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-4 text-xs text-slate-500"><span>Menampilkan {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} Prestasi</span><div className="flex gap-1">{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} onClick={() => setPage(number)} className={`h-8 min-w-8 rounded-md px-2 font-bold ${number === page ? 'bg-[#0B57C4] text-white' : 'hover:bg-blue-50'}`}>{number}</button>)}</div></div>
      </section>
    </div>
  );
}

'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronLeft, Edit3, Loader2, Plus, Save, Trash2, XCircle } from 'lucide-react';
import { ImageUpload } from '@/frontend/components/ImageUpload';
import {
  getBidangOptions,
  getDepartmentById,
  saveDepartment,
  type Department,
  type DepartmentAgendaInput,
  type DepartmentDetail,
  type DepartmentMember,
  type DepartmentMemberInput,
} from '@/backend/services/struktur';
import { Button } from '@ui/button';
import { Input } from '@ui/input';

type Toast = { type: 'success' | 'error'; message: string } | null;
type AgendaDraft = DepartmentAgendaInput;
type MemberDraft = DepartmentMemberInput;

const positions = [
  'Wakil Kepala Departemen',
  'Sekretaris Departemen',
  'Staff Ahli Departemen',
  'Staff Muda Departemen',
];

function sortMembers(items: MemberDraft[]): MemberDraft[] {
  return [...items].sort((a, b) => positions.indexOf(a.position) - positions.indexOf(b.position));
}

const emptyAgenda = (): AgendaDraft => ({ title: '', description: '', schedule_label: '' });
const emptyMember = (): MemberDraft => ({
  full_name: '',
  position: positions[0],
  tier: 'departemen',
  study_program: '',
  batch: '',
  image_url: null,
  image_public_id: null,
});

export function StrukturForm({ id }: { id?: string }) {
  const router = useRouter();
  const editing = Boolean(id);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [bidang, setBidang] = useState<Department[]>([]);
  const [name, setName] = useState('');
  const [bidangId, setBidangId] = useState('');
  const [description, setDescription] = useState('');
  const [focusTitle, setFocusTitle] = useState('');
  const [focusSubtitle, setFocusSubtitle] = useState('');
  const [hasProgja, setHasProgja] = useState(false);
  const [featuredTitle, setFeaturedTitle] = useState('');
  const [featuredDescription, setFeaturedDescription] = useState('');
  const [agendas, setAgendas] = useState<AgendaDraft[]>([]);
  const [members, setMembers] = useState<MemberDraft[]>([]);
  const [initialMembers, setInitialMembers] = useState<DepartmentMember[]>([]);
  const [memberDraft, setMemberDraft] = useState<MemberDraft>(emptyMember);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      getBidangOptions(),
      id ? getDepartmentById(id) : Promise.resolve({ data: null, error: null }),
    ]).then(([bidangResult, departmentResult]) => {
      setBidang(bidangResult.data);
      if (bidangResult.error) setError(bidangResult.error);
      if (departmentResult.error) setError(departmentResult.error);
      if (departmentResult.data) fill(departmentResult.data);
      setLoading(false);
    });
  }, [id]);

  function fill(department: DepartmentDetail): void {
    setName(department.name);
    setBidangId(department.bidang_id ?? '');
    setDescription(department.description ?? '');
    setFocusTitle(department.focus_title ?? '');
    setFocusSubtitle(department.focus_subtitle ?? '');
    setHasProgja(Boolean(department.featured_progja_title));
    setFeaturedTitle(department.featured_progja_title ?? '');
    setFeaturedDescription(department.featured_progja_description ?? '');
    setAgendas(department.agendas.map(({ title, description: agendaDescription, schedule_label }) => ({
      title,
      description: agendaDescription ?? '',
      schedule_label: schedule_label ?? '',
    })));
    setMembers(sortMembers(department.members.map((member) => ({
      id: member.id,
      full_name: member.full_name,
      position: member.position,
      tier: 'departemen',
      study_program: member.study_program ?? '',
      batch: member.batch ?? '',
      image_url: member.image_url,
      image_public_id: member.image_public_id,
    }))));
    setInitialMembers(department.members);
  }

  function notify(next: Toast): void {
    setToast(next);
    window.setTimeout(() => setToast(null), 4200);
  }

  function updateAgenda(index: number, key: keyof AgendaDraft, value: string): void {
    setAgendas((current) => current.map((agenda, agendaIndex) => agendaIndex === index ? { ...agenda, [key]: value } : agenda));
  }

  function addMember(): void {
    if (!memberDraft.full_name.trim()) {
      setError('Nama lengkap anggota wajib diisi.');
      return;
    }
    setError(null);
    const next = { ...memberDraft, full_name: memberDraft.full_name.trim() };
    setMembers((current) => sortMembers(editingMemberIndex === null
      ? [...current, next]
      : current.map((member, index) => index === editingMemberIndex ? next : member)));
    setMemberDraft(emptyMember());
    setEditingMemberIndex(null);
  }

  function editMember(index: number): void {
    setMemberDraft({ ...members[index] });
    setEditingMemberIndex(index);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  function removeMember(index: number): void {
    setMembers((current) => current.filter((_, memberIndex) => memberIndex !== index));
    if (editingMemberIndex === index) {
      setEditingMemberIndex(null);
      setMemberDraft(emptyMember());
    }
  }

  async function submit(event?: FormEvent<HTMLFormElement>): Promise<void> {
    event?.preventDefault();
    setError(null);
    if (!name.trim() || !bidangId || !description.trim()) {
      setError('Nama departemen, bidang koordinasi, dan deskripsi wajib diisi.');
      notify({ type: 'error', message: 'Lengkapi kolom wajib terlebih dahulu.' });
      return;
    }
    if (agendas.some((agenda) => !agenda.title.trim())) {
      setError('Setiap agenda harus memiliki judul.');
      notify({ type: 'error', message: 'Judul agenda wajib diisi.' });
      return;
    }
    setSaving(true);
    const result = await saveDepartment(
      {
        name: name.trim(),
        bidang_id: bidangId,
        description: description.trim(),
        focus_title: focusTitle.trim() || null,
        focus_subtitle: focusSubtitle.trim() || null,
        featured_progja_title: hasProgja ? featuredTitle.trim() || null : null,
        featured_progja_description: hasProgja ? featuredDescription.trim() || null : null,
      },
      agendas.map((agenda) => ({
        title: agenda.title.trim(),
        description: agenda.description.trim(),
        schedule_label: agenda.schedule_label.trim(),
      })),
      members.map((member) => ({
        ...member,
        full_name: member.full_name.trim(),
        study_program: member.study_program.trim(),
        batch: member.batch.trim(),
      })),
      id,
      initialMembers
    );
    setSaving(false);
    if (result.error) {
      setError(result.error);
      notify({ type: 'error', message: result.error });
      return;
    }
    notify({ type: 'success', message: editing ? 'Departemen berhasil diperbarui.' : 'Departemen berhasil disimpan.' });
    window.setTimeout(() => router.push('/dashboard/struktur'), 700);
  }

  const memberCountLabel = useMemo(() => `${members.length} Anggota Ditambahkan`, [members.length]);

  if (loading) {
    return <div className="flex min-h-[420px] items-center justify-center rounded-xl border bg-white"><Loader2 className="h-7 w-7 animate-spin text-[#0B57C4]" /></div>;
  }

  return (
    <form onSubmit={submit} className="relative space-y-5 pb-8">
      {toast && <div className={`fixed right-5 top-20 z-50 flex gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${toast.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>{toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}{toast.message}</div>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/struktur')}><ChevronLeft className="mr-1 h-4 w-4" />Kembali ke Daftar</Button>
        <Button type="button" className="bg-[#0B57C4] hover:bg-blue-700" onClick={() => submit()} disabled={saving}><Save className="mr-2 h-4 w-4" />Simpan Semua Data</Button>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Section number="01" title="Identitas & Informasi Utama Departemen" description="Lengkapi profil struktural dan tupoksi kepengurusan departemen.">
        <div className="grid gap-4">
          <Field label="Nama Resmi Departemen" required><Input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Kaderisasi dan Pengembangan Sumber Daya Mahasiswa" /></Field>
          <Field label="Kluster / Bidang Koordinasi" required><select required value={bidangId} onChange={(event) => setBidangId(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0B57C4] focus:ring-2 focus:ring-blue-100"><option value="">Pilih bidang koordinasi</option>{bidang.map((item) => <option key={item.id} value={item.id}>{item.short_name} – {item.name}</option>)}</select></Field>
          <Field label="Deskripsi Departemen & Tupoksi" required><textarea required maxLength={600} rows={5} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-6 outline-none focus:border-[#0B57C4] focus:ring-2 focus:ring-blue-100" /><span className="block text-right text-[10px] text-slate-400">{description.length} / 600</span></Field>
          <div className="grid gap-3 sm:grid-cols-2"><Field label="Judul Fokus (opsional)"><Input value={focusTitle} onChange={(event) => setFocusTitle(event.target.value)} placeholder="Contoh: Fokus Kaderisasi" /></Field><Field label="Subjudul Fokus (opsional)"><Input value={focusSubtitle} onChange={(event) => setFocusSubtitle(event.target.value)} placeholder="Deskripsi singkat fokus departemen" /></Field></div>
        </div>
      </Section>

      <Section number="02" title="Program Kerja (Progja) Unggulan" description="Tentukan apakah departemen memiliki program kerja unggulan.">
        <div className="grid gap-3 md:grid-cols-2">
          <RadioCard selected={hasProgja} title="Ya, Memiliki Progja Unggulan" description="Departemen memiliki satu program kerja unggulan yang ditampilkan di halaman publik." onClick={() => setHasProgja(true)} />
          <RadioCard selected={!hasProgja} title="Tidak (Fokus Agenda Rutin / Tanpa Progja)" description="Departemen berfokus pada agenda operasional rutin tanpa proyek unggulan terbuka." onClick={() => setHasProgja(false)} />
        </div>
        {hasProgja && <div className="mt-4 grid gap-4 rounded-lg border border-blue-100 bg-blue-50/40 p-4"><Field label="Nama Progja Unggulan"><Input value={featuredTitle} onChange={(event) => setFeaturedTitle(event.target.value)} placeholder="Nama program kerja unggulan" /></Field><Field label="Deskripsi Singkat Progja"><textarea rows={3} value={featuredDescription} onChange={(event) => setFeaturedDescription(event.target.value)} className="w-full rounded-lg border border-slate-300 p-3 text-sm leading-6 outline-none focus:border-[#0B57C4]" /></Field></div>}
      </Section>

      <Section number="03" title="Agenda Kerja Departemen" description="Rangkaian program berkala dan rutinitas departemen sepanjang periode kepengurusan." count={`${agendas.length} Agenda Terdaftar`}>
        <div className="space-y-2">{agendas.map((agenda, index) => <div key={`${index}-${agenda.title}`} className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-2 sm:grid-cols-[32px_1fr_1.4fr_150px_32px] sm:items-center sm:border-0 sm:bg-slate-50"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-[10px] font-bold text-[#0B57C4]">{String(index + 1).padStart(2, '0')}</span><Input value={agenda.title} onChange={(event) => updateAgenda(index, 'title', event.target.value)} placeholder="Nama agenda" /><Input value={agenda.description} onChange={(event) => updateAgenda(index, 'description', event.target.value)} placeholder="Deskripsi singkat agenda" /><Input value={agenda.schedule_label} onChange={(event) => updateAgenda(index, 'schedule_label', event.target.value)} placeholder="Jadwal" /><button type="button" onClick={() => setAgendas((current) => current.filter((_, agendaIndex) => agendaIndex !== index))} className="justify-self-end rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Hapus agenda ${index + 1}`}><Trash2 className="h-4 w-4" /></button></div>)}</div>
        <button type="button" onClick={() => setAgendas((current) => [...current, emptyAgenda()])} className="mt-3 inline-flex items-center gap-1 rounded-md border border-dashed border-[#0B57C4] px-3 py-2 text-[11px] font-bold text-[#0B57C4] hover:bg-blue-50"><Plus className="h-3.5 w-3.5" />Tambah Agenda Lain</button>
      </Section>

      <Section number="04" title="Anggota & Fungsionaris Departemen" description="Tambahkan anggota departemen beserta foto dan jabatan." count={memberCountLabel}>
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4"><p className="mb-4 text-[10px] font-extrabold uppercase tracking-wide text-[#0B57C4]">Input Fungsionaris Baru</p><div className="grid gap-4 lg:grid-cols-[1fr_1fr_180px]"><div className="space-y-3"><Field label="Nama Lengkap Mahasiswa" required><Input value={memberDraft.full_name} onChange={(event) => setMemberDraft((current) => ({ ...current, full_name: event.target.value }))} placeholder="Contoh: Delia Eka Nuraini" /></Field><div className="grid gap-3 sm:grid-cols-2"><Field label="Program Studi"><Input value={memberDraft.study_program} onChange={(event) => setMemberDraft((current) => ({ ...current, study_program: event.target.value }))} placeholder="S1 Matematika" /></Field><Field label="Angkatan"><Input value={memberDraft.batch} onChange={(event) => setMemberDraft((current) => ({ ...current, batch: event.target.value }))} placeholder="25" /></Field></div><Field label="Jabatan"><div className="flex flex-wrap gap-2">{positions.map((position) => <button type="button" key={position} onClick={() => setMemberDraft((current) => ({ ...current, position }))} className={`rounded-full border px-3 py-2 text-[10px] font-semibold ${memberDraft.position === position ? 'border-[#0B57C4] bg-[#0B57C4] text-white' : 'border-slate-300 bg-white text-slate-600'}`}>{position}</button>)}</div></Field></div><div className="lg:col-span-2"><ImageUpload value={memberDraft.image_url} publicId={memberDraft.image_public_id} folder="struktur" aspectHint="4:5" onChange={(result) => setMemberDraft((current) => ({ ...current, image_url: result?.url ?? null, image_public_id: result?.public_id ?? null }))} /></div></div><Button type="button" onClick={addMember} className="mt-4 bg-[#0B57C4] hover:bg-blue-700">{editingMemberIndex === null ? <Plus className="mr-2 h-4 w-4" /> : <Edit3 className="mr-2 h-4 w-4" />}{editingMemberIndex === null ? 'Tambah ke Daftar' : 'Simpan Perubahan Anggota'}</Button></div>
        <div className="mt-5"><div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-extrabold text-slate-800">Daftar Anggota Terdaftar</h3><span className="text-[10px] text-slate-400">Urut berdasarkan jabatan</span></div>{members.length === 0 ? <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">Belum ada anggota ditambahkan.</div> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{members.map((member, index) => <MemberCard key={member.id ?? `${member.full_name}-${index}`} member={member} onEdit={() => editMember(index)} onRemove={() => removeMember(index)} />)}</div>}</div>
      </Section>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={() => router.push('/dashboard/struktur')} disabled={saving}>Batal</Button><Button type="submit" className="bg-[#0B57C4] hover:bg-blue-700" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Simpan Departemen & {members.length} Anggota</Button></div>
    </form>
  );
}

function Section({ number, title, description, count, children }: { number: string; title: string; description: string; count?: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-[10px] font-extrabold text-[#0B57C4]">{number}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><h2 className="text-sm font-extrabold text-slate-800">{title}</h2>{count && <span className="text-[10px] font-bold text-[#0B57C4]">{count}</span>}</div><p className="mt-1 text-[10px] text-slate-400">{description}</p></div></div>{children}</section>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">{label}{required && <span className="text-red-500"> *</span>}</span>{children}</label>;
}

function RadioCard({ selected, title, description, onClick }: { selected: boolean; title: string; description: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={`rounded-xl border p-4 text-left transition-colors ${selected ? 'border-[#0B57C4] bg-blue-50/50 ring-1 ring-[#0B57C4]' : 'border-slate-200 hover:border-blue-200'}`}><div className="flex items-start gap-3"><span className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${selected ? 'border-[#0B57C4] bg-[#0B57C4] ring-2 ring-white' : 'border-slate-300'}`} /><div><strong className="text-xs text-slate-800">{title}</strong><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p></div></div></button>;
}

function MemberCard({ member, onEdit, onRemove }: { member: MemberDraft; onEdit: () => void; onRemove: () => void }) {
  const initials = member.full_name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return <div className="relative overflow-hidden rounded-xl border-2 border-[#0B57C4] bg-white p-2 shadow-sm"><span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B57C4] px-2 py-1 text-[9px] font-bold text-white">{member.position}</span><div className="mt-3 aspect-[4/5] overflow-hidden rounded-lg bg-slate-100">{member.image_url ? <img src={member.image_url} alt={member.full_name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl font-extrabold text-[#0B57C4]">{initials}</div>}</div><p className="mt-3 truncate text-center text-xs font-bold text-slate-800">{member.full_name}</p><p className="truncate text-center text-[10px] text-[#0B57C4]">{member.study_program || 'Program studi'} {member.batch ? `'${member.batch}` : ''}</p><div className="mt-2 flex justify-center gap-1"><button type="button" onClick={onEdit} className="rounded-md p-1.5 text-[#0B57C4] hover:bg-blue-50" aria-label={`Edit ${member.full_name}`}><Edit3 className="h-3.5 w-3.5" /></button><button type="button" onClick={onRemove} className="rounded-md p-1.5 text-red-600 hover:bg-red-50" aria-label={`Hapus ${member.full_name}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div>;
}

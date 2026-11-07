'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ChevronLeft,
  ImagePlus,
  Loader2,
  MapPin,
  Save,
  XCircle,
} from 'lucide-react';

import { ImageUpload } from '@/frontend/components/ImageUpload';
import {
  getDepartments,
  getProgjaById,
  saveProgja,
  type DepartmentOption,
  type Progja,
  type ProgjaFormInput,
  type ProgjaGallery,
} from '@/backend/services/progja';
import { Button } from '@ui/button';
import { Input } from '@ui/input';

type FormStatus = Progja['status'];

type GalleryDraft = {
  slot: number;
  caption: string;
  image_url: string | null;
  image_public_id: string | null;
};

type ToastState = { type: 'success' | 'error'; message: string } | null;

function emptyGallery(): GalleryDraft[] {
  return [1, 2, 3, 4].map((slot) => ({
    slot,
    caption: '',
    image_url: null,
    image_public_id: null,
  }));
}

function galleryDraft(items: ProgjaGallery[]): GalleryDraft[] {
  return [1, 2, 3, 4].map((slot) => {
    const item = items.find((gallery) => gallery.slot === slot);
    return {
      slot,
      caption: item?.caption ?? '',
      image_url: item?.image_url ?? null,
      image_public_id: item?.image_public_id ?? null,
    };
  });
}

export function ProgjaForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = Boolean(id);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<FormStatus>('terlaksana');
  const [departmentId, setDepartmentId] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateLabel, setDateLabel] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePublicId, setImagePublicId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [achievementSummary, setAchievementSummary] = useState('');
  const [tag, setTag] = useState('');
  const [gallery, setGallery] = useState<GalleryDraft[]>(emptyGallery);

  const slugPreview = useMemo(() => {
    const preview = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return preview || 'slug-otomatis-dari-judul';
  }, [title]);
  const groupedDepartments = useMemo(() => departments.reduce<Record<string, DepartmentOption[]>>((groups, department) => {
    const group = department.group_name || 'Lainnya';
    groups[group] = [...(groups[group] ?? []), department];
    return groups;
  }, {}), [departments]);

  useEffect(() => {
    let active = true;
    async function load() {
      const departmentResult = await getDepartments();
      if (!active) return;
      setDepartments(departmentResult.departments);
      if (departmentResult.error) setError(departmentResult.error);

      if (id) {
        const result = await getProgjaById(id);
        if (!active) return;
        if (result.error || !result.progja) {
          setError(result.error ?? 'Program kerja tidak ditemukan.');
          setLoading(false);
          return;
        }
        fillForm(result.progja, result.gallery);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  function fillForm(item: Progja, galleryItems: ProgjaGallery[]) {
    setTitle(item.title);
    setStatus(item.status);
    setDepartmentId(item.department_id ?? '');
    setCategory(item.category ?? '');
    setStartDate(item.start_date ?? '');
    setEndDate(item.end_date ?? '');
    setDateLabel(item.date_label ?? '');
    setLocation(item.location ?? '');
    setImageUrl(item.image_url);
    setImagePublicId(item.image_public_id);
    setDescription(item.description ?? '');
    setShortDescription(item.short_description ?? '');
    setAchievementSummary(item.achievement_summary ?? '');
    setTag(item.tag ?? '');
    setGallery(galleryDraft(galleryItems));
  }

  function showToast(nextToast: ToastState) {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 4200);
  }

  function updateGallery(slot: number, patch: Partial<GalleryDraft>) {
    setGallery((current) => current.map((item) => (item.slot === slot ? { ...item, ...patch } : item)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (status === 'terlaksana') {
      if (!imageUrl || !imagePublicId) {
        setError('Banner utama wajib diisi untuk program kerja terlaksana.');
        showToast({ type: 'error', message: 'Banner utama belum diisi.' });
        return;
      }
      if (gallery.some((item) => !item.image_url || !item.image_public_id)) {
        setError('Keempat foto galeri wajib diisi untuk program kerja terlaksana.');
        showToast({ type: 'error', message: 'Lengkapi 4 foto dokumentasi.' });
        return;
      }
    }

    setSaving(true);
    const input: ProgjaFormInput = {
      title: title.trim(),
      status,
      department_id: departmentId || null,
      category: category.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
      date_label: dateLabel.trim() || null,
      location: location.trim() || null,
      image_url: imageUrl,
      image_public_id: imagePublicId,
      description: description.trim() || null,
      short_description: shortDescription.trim() || null,
      achievement_summary: achievementSummary.trim() || null,
      tag: tag.trim() || null,
      gallery: gallery.map(({ slot, caption, image_url, image_public_id }) => ({
        slot,
        caption: caption.trim() || null,
        image_url,
        image_public_id,
      })),
    };
    const result = await saveProgja(input, id);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      showToast({ type: 'error', message: result.error });
      return;
    }

    showToast({
      type: 'success',
      message: isEdit ? 'Program kerja berhasil diperbarui.' : 'Program kerja berhasil diterbitkan.',
    });
    window.setTimeout(() => router.push('/dashboard/progja'), 700);
  }

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <Loader2 className="h-7 w-7 animate-spin text-[#0B57C4]" />
      </div>
    );
  }

  return (
    <div className="relative pb-8">
      {toast && (
        <div className={`fixed right-5 top-20 z-[60] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${toast.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`} role="status">
          {toast.type === 'success' ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium text-slate-400">Kelola data program kerja kabinet dan publikasi kegiatan mahasiswa.</p>
          <p className="mt-1 text-xs text-slate-500">Slug otomatis: <span className="font-semibold text-[#0B57C4]">{slugPreview}</span></p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => router.push('/dashboard/progja')}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Kembali ke Daftar Progja
        </Button>
      </div>

      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormSection number="1" title="Status Pelaksanaan" description="Tentukan fase program kerja dan kelengkapan dokumentasinya.">
          <div className="grid gap-3 md:grid-cols-2">
            <StatusOption value="terlaksana" selected={status === 'terlaksana'} title="Progja Terlaksana" description="Sudah selesai dan siap dipublikasikan dengan dokumentasi lengkap." badge="Dokumentasi lengkap" onClick={() => setStatus('terlaksana')} />
            <StatusOption value="mendatang" selected={status === 'mendatang'} title="Progja Mendatang" description="Agenda yang akan datang dan sedang dalam tahap persiapan." badge="Agenda terjadwal" onClick={() => setStatus('mendatang')} />
          </div>
        </FormSection>

        <FormSection number="2" title="Informasi Utama Program Kerja" description="Lengkapi identitas administratif dan jadwal pelaksanaan.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama Program Kerja" required className="md:col-span-2">
              <Input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: Sarasehan 2026" />
            </Field>
            <Field label="Biro / Departemen" required>
              <select required value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#0B57C4] focus:ring-2 focus:ring-blue-100">
                <option value="">Pilih departemen</option>
                {Object.entries(groupedDepartments).map(([group, groupDepartments]) => <optgroup key={group} label={group}>{groupDepartments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</optgroup>)}
              </select>
            </Field>
            <Field label="Kategori">
              <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Contoh: Pendidikan" />
            </Field>
            <Field label="Tanggal Mulai">
              <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </Field>
            <Field label="Tanggal Selesai">
              <Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </Field>
            <Field label="Label Jadwal">
              <Input value={dateLabel} onChange={(event) => setDateLabel(event.target.value)} placeholder="Contoh: 18–19 April 2026" />
            </Field>
            <Field label="Lokasi / Tempat Pelaksanaan">
              <div className="relative"><MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input className="pl-9" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Auditorium Gedung D12" /></div>
            </Field>
          </div>
        </FormSection>

        <FormSection number="3" title="Banner Utama" description="Format lanskap 16:9 disarankan. Maksimal 5 MB, JPG, PNG, atau WEBP." badge="Wajib untuk semua status">
          <div className="max-w-2xl"><ImageUpload value={imageUrl} publicId={imagePublicId} folder="progja" aspectHint="16:9" onChange={(result) => { setImageUrl(result?.url ?? null); setImagePublicId(result?.public_id ?? null); }} /></div>
        </FormSection>

        <FormSection number="4" title="Deskripsi & Capaian / Output Kegiatan" description="Uraikan detail substansi kegiatan dan hasil yang dihasilkan.">
          <div className="space-y-4">
            <Field label="Deskripsi Lengkap Program Kerja" required>
              <textarea required value={description} onChange={(event) => setDescription(event.target.value)} rows={7} placeholder="Tuliskan deskripsi lengkap program kerja..." className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-[#0B57C4] focus:ring-2 focus:ring-blue-100" />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Deskripsi Singkat">
                <textarea value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} rows={3} placeholder="Ringkasan singkat untuk daftar program kerja" className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-[#0B57C4] focus:ring-2 focus:ring-blue-100" />
              </Field>
              <Field label="Ringkasan Capaian / Indikator Keberhasilan">
                <textarea value={achievementSummary} onChange={(event) => setAchievementSummary(event.target.value)} rows={3} placeholder="Contoh: 240 aspirasi diserap" className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-[#0B57C4] focus:ring-2 focus:ring-blue-100" />
              </Field>
            </div>
            <Field label="Tag">
              <Input value={tag} onChange={(event) => setTag(event.target.value)} placeholder="Contoh: Open Volunteer" />
            </Field>
          </div>
        </FormSection>

        {status === 'terlaksana' && (
          <FormSection number="5" title="Dokumentasi Galeri Kegiatan Resmi" description="Kelola arsip fotografi agar publikasi tetap transparan dan informatif." badge="4 foto wajib">
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800">
              <ImagePlus className="mt-0.5 h-4 w-4 shrink-0 text-[#0B57C4]" />
              <span>Khusus Progja Terlaksana: wajib mengisi 4 foto dokumentasi untuk ditampilkan di halaman publik.</span>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {gallery.map((item) => (
                <div key={item.slot} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-700"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0B57C4] text-[10px] text-white">{item.slot}</span>Foto Dokumentasi {item.slot}</div>
                  <div className="max-w-md"><ImageUpload value={item.image_url} publicId={item.image_public_id} folder="progja-gallery" aspectHint="16:9" onChange={(result) => updateGallery(item.slot, { image_url: result?.url ?? null, image_public_id: result?.public_id ?? null })} /></div>
                  <Input value={item.caption} onChange={(event) => updateGallery(item.slot, { caption: event.target.value })} placeholder="Caption / keterangan foto" className="mt-3 bg-white text-xs" />
                </div>
              ))}
            </div>
          </FormSection>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => router.push('/dashboard/progja')} disabled={saving}>Batal</Button>
          <Button type="submit" className="bg-[#0B57C4] hover:bg-blue-700" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? 'Menyimpan...' : isEdit ? 'Perbarui Program Kerja' : 'Terbitkan Program Kerja'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ number, title, description, badge, children }: { number: string; title: string; description: string; badge?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs font-extrabold text-[#0B57C4]">{number}</span>
          <div><h2 className="text-sm font-extrabold text-slate-800">{title}</h2><p className="mt-1 text-[10px] leading-4 text-slate-400">{description}</p></div>
        </div>
        {badge && <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0B57C4]">{badge}</span>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return <label className={`block space-y-2 ${className ?? ''}`}><span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">{label}{required && <span className="ml-1 text-red-500">*</span>}</span>{children}</label>;
}

function StatusOption({ value, selected, title, description, badge, onClick }: { value: FormStatus; selected: boolean; title: string; description: string; badge: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-xl border p-4 text-left transition-all ${selected ? 'border-[#0B57C4] bg-blue-50/40 ring-1 ring-[#0B57C4]' : 'border-slate-200 bg-white hover:border-blue-200'}`}>
      <div className="mb-2 flex items-center justify-between"><span className="rounded-full bg-white px-2 py-1 text-[9px] font-bold uppercase text-[#0B57C4] shadow-sm">{badge}</span><span className={`flex h-4 w-4 items-center justify-center rounded-full border ${selected ? 'border-[#0B57C4] bg-[#0B57C4]' : 'border-slate-300'}`}>{selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}</span></div>
      <p className="text-sm font-bold text-slate-800">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      <span className="sr-only">{value}</span>
    </button>
  );
}

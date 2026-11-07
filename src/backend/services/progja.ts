import { getSupabaseBrowser } from '@/backend/lib/supabase';
import { slugify } from '@/backend/utils/slug';

export interface Progja {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  status: 'terlaksana' | 'mendatang';
  category: string | null;
  department_id: string | null;
  start_date: string | null;
  end_date: string | null;
  date_label: string | null;
  location: string | null;
  achievement_summary: string | null;
  tag: string | null;
  is_featured: boolean;
  image_url: string | null;
  image_public_id: string | null;
  publish_status: 'draft' | 'terbit' | 'arsip';
  created_at: string;
  updated_at: string;
}

export interface DepartmentOption {
  id: string;
  name: string;
  short_name: string | null;
  group_name: string | null;
}

export interface ProgjaWithDepartment extends Progja {
  department: DepartmentOption | null;
}

export interface ProgjaGallery {
  id?: string;
  progja_id: string;
  slot: number;
  caption: string | null;
  image_url: string | null;
  image_public_id: string | null;
}

export interface ProgjaFormInput {
  title: string;
  status: Progja['status'];
  department_id: string | null;
  category: string | null;
  start_date: string | null;
  end_date: string | null;
  date_label: string | null;
  location: string | null;
  image_url: string | null;
  image_public_id: string | null;
  description: string | null;
  short_description: string | null;
  achievement_summary: string | null;
  tag: string | null;
  gallery: Array<Pick<ProgjaGallery, 'slot' | 'caption' | 'image_url' | 'image_public_id'>>;
}

export async function getProgjaData(): Promise<{
  progja: ProgjaWithDepartment[];
  departments: DepartmentOption[];
  error: string | null;
}> {
  const supabase = getSupabaseBrowser();
  const [progjaResult, departmentsResult] = await Promise.all([
    supabase.from('progja').select('*').order('start_date', { ascending: false }),
    supabase.from('departments').select('id, name, short_name, group_name').order('sort_order'),
  ]);

  if (progjaResult.error) {
    return {
      progja: [],
      departments: (departmentsResult.data ?? []) as DepartmentOption[],
      error: 'Data program kerja belum dapat dimuat.',
    };
  }

  if (departmentsResult.error) {
    return {
      progja: [],
      departments: [],
      error: 'Data departemen belum dapat dimuat.',
    };
  }

  const departments = (departmentsResult.data ?? []) as DepartmentOption[];
  const departmentMap = new Map(departments.map((department) => [department.id, department]));
  const progja = ((progjaResult.data ?? []) as Progja[]).map((item) => ({
    ...item,
    department: item.department_id ? departmentMap.get(item.department_id) ?? null : null,
  }));

  return { progja, departments, error: null };
}

export async function getDepartments(): Promise<{
  departments: DepartmentOption[];
  error: string | null;
}> {
  const { data, error } = await getSupabaseBrowser()
    .from('departments')
    .select('id, name, short_name, group_name')
    .order('sort_order');

  return {
    departments: (data ?? []) as DepartmentOption[],
    error: error ? 'Data departemen belum dapat dimuat.' : null,
  };
}

export async function getProgjaById(id: string): Promise<{
  progja: Progja | null;
  gallery: ProgjaGallery[];
  error: string | null;
}> {
  const supabase = getSupabaseBrowser();
  const [progjaResult, galleryResult] = await Promise.all([
    supabase.from('progja').select('*').eq('id', id).maybeSingle(),
    supabase.from('progja_gallery').select('*').eq('progja_id', id).order('slot'),
  ]);

  if (progjaResult.error || !progjaResult.data) {
    return { progja: null, gallery: [], error: 'Program kerja tidak ditemukan.' };
  }
  if (galleryResult.error) {
    return { progja: progjaResult.data as Progja, gallery: [], error: 'Galeri program kerja belum dapat dimuat.' };
  }
  return {
    progja: progjaResult.data as Progja,
    gallery: (galleryResult.data ?? []) as ProgjaGallery[],
    error: null,
  };
}

export async function saveProgja(
  input: ProgjaFormInput,
  id?: string
): Promise<{ progja: Progja | null; error: string | null }> {
  const supabase = getSupabaseBrowser();
  const payload = {
    title: input.title,
    status: input.status,
    department_id: input.department_id,
    category: input.category,
    start_date: input.start_date,
    end_date: input.end_date,
    date_label: input.date_label,
    location: input.location,
    image_url: input.image_url,
    image_public_id: input.image_public_id,
    description: input.description,
    short_description: input.short_description,
    achievement_summary: input.achievement_summary,
    tag: input.tag,
    publish_status: 'terbit' as const,
  };

  const result = id
    ? await supabase.from('progja').update(payload).eq('id', id).select('*').maybeSingle()
    : await supabase.from('progja').insert({ ...payload, slug: slugify(input.title) }).select('*').maybeSingle();

  if (result.error || !result.data) {
    return { progja: null, error: 'Program kerja gagal disimpan. Periksa kembali isian formulir.' };
  }

  const saved = result.data as Progja;
  if (input.status === 'terlaksana') {
    const galleryRows = input.gallery.map((item) => ({
      progja_id: saved.id,
      slot: item.slot,
      caption: item.caption,
      image_url: item.image_url,
      image_public_id: item.image_public_id,
    }));
    const { error: galleryError } = await supabase
      .from('progja_gallery')
      .upsert(galleryRows, { onConflict: 'progja_id,slot' });
    if (galleryError) {
      return { progja: saved, error: 'Program kerja tersimpan, tetapi galeri gagal disimpan.' };
    }
  }

  return { progja: saved, error: null };
}

export async function deleteProgja(id: string): Promise<{ error: string | null }> {
  const supabase = getSupabaseBrowser();
  const { data: item, error: findError } = await supabase
    .from('progja')
    .select('id, image_public_id')
    .eq('id', id)
    .maybeSingle();

  if (findError || !item) {
    return { error: 'Program kerja tidak ditemukan.' };
  }

  const { error } = await supabase.from('progja').delete().eq('id', id);
  if (error) {
    return { error: 'Program kerja gagal dihapus.' };
  }

  if (item.image_public_id) {
    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch('/api/upload/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionData.session?.access_token ?? ''}`,
      },
      body: JSON.stringify({ public_id: item.image_public_id }),
    });
    if (!response.ok) {
      return { error: 'Data terhapus, tetapi gambar Cloudinary belum terhapus.' };
    }
  }

  return { error: null };
}

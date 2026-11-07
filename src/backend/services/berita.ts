import { getSupabaseBrowser } from '@/backend/lib/supabase';
import { slugify } from '@/backend/utils/slug';

export type BeritaPostType = 'dengan_aksi' | 'warta_murni';

export interface Berita {
  id: string;
  slug: string;
  title: string;
  content: string;
  post_type: BeritaPostType;
  tag_category: string;
  department_id: string;
  image_url: string | null;
  image_public_id: string | null;
  published_at: string;
  read_minutes: number;
  action_label: string | null;
  action_url: string | null;
  action_deadline: string | null;
  contact_person: string | null;
  views: number;
  publish_status: 'draft' | 'terbit' | 'arsip';
  department: { name: string; short_name: string | null } | null;
}

export interface BeritaInput {
  title: string;
  content: string;
  post_type: BeritaPostType;
  tag_category: string;
  department_id: string;
  image_url: string | null;
  image_public_id: string | null;
  published_at: string;
  read_minutes: number;
  action_label: string | null;
  action_url: string | null;
  action_deadline: string | null;
  contact_person: string | null;
}

export async function getBerita(): Promise<{ data: Berita[]; error: string | null }> {
  const { data, error } = await getSupabaseBrowser()
    .from('berita')
    .select('*, department:departments(name, short_name)')
    .order('published_at', { ascending: false });
  return { data: (data ?? []) as Berita[], error: error ? 'Data berita belum dapat dimuat.' : null };
}

export async function getBeritaById(id: string): Promise<{ data: Berita | null; error: string | null }> {
  const { data, error } = await getSupabaseBrowser().from('berita').select('*').eq('id', id).maybeSingle();
  return { data: (data as Berita | null) ?? null, error: error || !data ? 'Berita tidak ditemukan.' : null };
}

export async function getBeritaDepartments(): Promise<{ data: Array<{ id: string; name: string; short_name: string | null; group_name: string | null }>; error: string | null }> {
  const { data, error } = await getSupabaseBrowser().from('departments').select('id, name, short_name, group_name').order('sort_order');
  return { data: data ?? [], error: error ? 'Departemen belum dapat dimuat.' : null };
}

export async function saveBerita(input: BeritaInput, id?: string): Promise<{ data: Berita | null; error: string | null }> {
  const payload = { ...input, publish_status: 'terbit' as const };
  const supabase = getSupabaseBrowser();
  const result = id
    ? await supabase.from('berita').update(payload).eq('id', id).select('*').maybeSingle()
    : await supabase.from('berita').insert({ ...payload, slug: slugify(input.title) }).select('*').maybeSingle();
  if (result.error || !result.data) return { data: null, error: 'Berita gagal disimpan. Periksa kembali isian formulir.' };
  return { data: result.data as Berita, error: null };
}

export async function deleteBerita(id: string): Promise<{ error: string | null }> {
  const supabase = getSupabaseBrowser();
  const { data: item } = await supabase.from('berita').select('id, image_public_id').eq('id', id).maybeSingle();
  if (!item) return { error: 'Berita tidak ditemukan.' };
  const { error } = await supabase.from('berita').delete().eq('id', id);
  if (error) return { error: 'Berita gagal dihapus.' };
  if (item.image_public_id) {
    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch('/api/upload/delete', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session?.access_token ?? ''}` }, body: JSON.stringify({ public_id: item.image_public_id }) });
    if (!response.ok) return { error: 'Data terhapus, tetapi gambar belum terhapus.' };
  }
  return { error: null };
}

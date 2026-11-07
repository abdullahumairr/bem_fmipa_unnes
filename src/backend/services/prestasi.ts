import { getSupabaseBrowser } from '@/backend/lib/supabase';
import { slugify } from '@/backend/utils/slug';

export type PrestasiCategory = 'prestasi_mahasiswa' | 'apresiasi_kelembagaan';
export type PrestasiLevel = 'internasional' | 'nasional' | 'universitas' | 'fakultas';

export interface Prestasi {
  id: string;
  slug: string;
  category: PrestasiCategory;
  level: PrestasiLevel;
  title: string;
  recipient: string;
  organizer: string;
  achieved_at: string;
  achievement_status: string;
  field_tag: string;
  description: string;
  proof_url: string | null;
  image_url: string | null;
  image_public_id: string | null;
  publish_status: 'draft' | 'terbit' | 'arsip';
  created_at: string;
  updated_at: string;
}

export interface PrestasiInput {
  category: PrestasiCategory;
  level: PrestasiLevel;
  title: string;
  recipient: string;
  organizer: string;
  achieved_at: string;
  achievement_status: string;
  field_tag: string;
  description: string;
  proof_url: string | null;
  image_url: string | null;
  image_public_id: string | null;
}

export async function getPrestasi(): Promise<{ data: Prestasi[]; error: string | null }> {
  const { data, error } = await getSupabaseBrowser()
    .from('prestasi')
    .select('*')
    .order('achieved_at', { ascending: false });
  return { data: (data ?? []) as Prestasi[], error: error ? 'Data prestasi belum dapat dimuat.' : null };
}

export async function getPrestasiById(id: string): Promise<{ data: Prestasi | null; error: string | null }> {
  const { data, error } = await getSupabaseBrowser().from('prestasi').select('*').eq('id', id).maybeSingle();
  return { data: (data as Prestasi | null) ?? null, error: error || !data ? 'Prestasi tidak ditemukan.' : null };
}

export async function savePrestasi(input: PrestasiInput, id?: string): Promise<{ data: Prestasi | null; error: string | null }> {
  const payload = { ...input, publish_status: 'terbit' as const };
  const supabase = getSupabaseBrowser();
  const result = id
    ? await supabase.from('prestasi').update(payload).eq('id', id).select('*').maybeSingle()
    : await supabase.from('prestasi').insert({ ...payload, slug: slugify(input.title) }).select('*').maybeSingle();
  if (result.error || !result.data) return { data: null, error: 'Prestasi gagal disimpan. Periksa kembali isian formulir.' };
  return { data: result.data as Prestasi, error: null };
}

export async function deletePrestasi(id: string): Promise<{ error: string | null }> {
  const supabase = getSupabaseBrowser();
  const { data: item } = await supabase.from('prestasi').select('id, image_public_id').eq('id', id).maybeSingle();
  if (!item) return { error: 'Prestasi tidak ditemukan.' };
  const { error } = await supabase.from('prestasi').delete().eq('id', id);
  if (error) return { error: 'Prestasi gagal dihapus.' };
  if (item.image_public_id) {
    const { data: sessionData } = await supabase.auth.getSession();
    const response = await fetch('/api/upload/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session?.access_token ?? ''}` },
      body: JSON.stringify({ public_id: item.image_public_id }),
    });
    if (!response.ok) return { error: 'Data terhapus, tetapi gambar belum terhapus.' };
  }
  return { error: null };
}

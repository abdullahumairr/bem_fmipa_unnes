import { getSupabasePublic } from '@/backend/lib/supabase';
import type { Berita } from '@/backend/services/berita';
import type { Prestasi } from '@/backend/services/prestasi';
import type { DepartmentOption, Progja, ProgjaGallery, ProgjaWithDepartment } from '@/backend/services/progja';
import type { Department, DepartmentAgenda, DepartmentDetail, DepartmentMember } from '@/backend/services/struktur';

export interface PublicProgjaDetail extends ProgjaWithDepartment {
  gallery: ProgjaGallery[];
  related: ProgjaWithDepartment[];
}

function attachDepartments(items: Progja[], departments: DepartmentOption[]): ProgjaWithDepartment[] {
  const departmentMap = new Map(departments.map((department) => [department.id, department]));
  return items.map((item) => ({
    ...item,
    department: item.department_id ? departmentMap.get(item.department_id) ?? null : null,
  }));
}

export async function getHomeData(): Promise<{ progja: Pick<Progja, 'title' | 'slug'>[]; prestasi: Pick<Prestasi, 'title' | 'recipient'> | null; berita: Berita[]; error: string | null }> {
  const supabase = getSupabasePublic();
  const [progjaResult, prestasiResult, beritaResult] = await Promise.all([
    supabase.from('progja').select('title, slug').eq('publish_status', 'terbit').eq('status', 'terlaksana').order('start_date', { ascending: false }).limit(3),
    supabase.from('prestasi').select('title, recipient').eq('publish_status', 'terbit').order('achieved_at', { ascending: false }).limit(1),
    supabase.from('berita').select('*, department:departments(name, short_name)').eq('publish_status', 'terbit').order('published_at', { ascending: false }).limit(2),
  ]);
  const hasError = Boolean(progjaResult.error || prestasiResult.error || beritaResult.error);
  return {
    progja: (progjaResult.data ?? []) as Pick<Progja, 'title' | 'slug'>[],
    prestasi: ((prestasiResult.data ?? [])[0] as Pick<Prestasi, 'title' | 'recipient'> | undefined) ?? null,
    berita: (beritaResult.data ?? []) as Berita[],
    error: hasError ? 'Sebagian data beranda belum dapat dimuat.' : null,
  };
}

export async function getDepartments(): Promise<{ data: Department[]; error: string | null }> {
  const { data, error } = await getSupabasePublic()
    .from('departments')
    .select('id, slug, name, short_name, group_name, description, focus_title, focus_subtitle, sort_order, bidang_id, featured_progja_title, featured_progja_description')
    .eq('group_name', 'Departemen')
    .order('sort_order', { ascending: true });
  return { data: (data ?? []) as Department[], error: error ? 'Data departemen belum dapat dimuat.' : null };
}

function memberRank(position: string): number {
  const value = position.toLowerCase();
  if (value.includes('wakil')) return 1;
  if (value.includes('sekret')) return 2;
  if (value.includes('staf ahli')) return 3;
  if (value.includes('staf muda')) return 4;
  return 5;
}

export async function getDepartmentBySlug(slug: string): Promise<{ data: DepartmentDetail | null; error: string | null }> {
  const supabase = getSupabasePublic();
  const { data: department, error: departmentError } = await supabase.from('departments').select('*').eq('group_name', 'Departemen').eq('slug', slug).maybeSingle();
  if (departmentError || !department) return { data: null, error: 'Departemen tidak ditemukan.' };
  const [agendaResult, memberResult] = await Promise.all([
    supabase.from('department_agendas').select('*').eq('department_id', department.id).order('sort_order', { ascending: true }),
    supabase.from('members').select('*').eq('department_id', department.id).order('sort_order', { ascending: true }),
  ]);
  if (agendaResult.error || memberResult.error) return { data: null, error: 'Detail departemen belum dapat dimuat.' };
  const members = ((memberResult.data ?? []) as DepartmentMember[]).sort((a, b) => memberRank(a.position) - memberRank(b.position) || a.sort_order - b.sort_order);
  return { data: { ...(department as Department), agendas: (agendaResult.data ?? []) as DepartmentAgenda[], members }, error: null };
}

export async function getProgjaList(): Promise<{ data: ProgjaWithDepartment[]; error: string | null }> {
  const supabase = getSupabasePublic();
  const [progjaResult, departmentsResult] = await Promise.all([
    supabase.from('progja').select('*').eq('publish_status', 'terbit').order('start_date', { ascending: false }),
    supabase.from('departments').select('id, name, short_name, group_name').order('sort_order', { ascending: true }),
  ]);
  if (progjaResult.error || departmentsResult.error) return { data: [], error: 'Data program kerja belum dapat dimuat.' };
  return {
    data: attachDepartments((progjaResult.data ?? []) as Progja[], (departmentsResult.data ?? []) as DepartmentOption[]),
    error: null,
  };
}

export async function getPrestasiList(): Promise<{ data: Prestasi[]; error: string | null }> {
  const { data, error } = await getSupabasePublic()
    .from('prestasi')
    .select('*')
    .eq('publish_status', 'terbit')
    .order('achieved_at', { ascending: false });
  return { data: (data ?? []) as Prestasi[], error: error ? 'Data prestasi belum dapat dimuat.' : null };
}

export async function getBeritaList(): Promise<{ data: Berita[]; error: string | null }> {
  const { data, error } = await getSupabasePublic()
    .from('berita')
    .select('*, department:departments(name, short_name)')
    .eq('publish_status', 'terbit')
    .order('published_at', { ascending: false });
  return { data: (data ?? []) as Berita[], error: error ? 'Data berita belum dapat dimuat.' : null };
}

export async function getProgjaBySlug(slug: string): Promise<{ data: PublicProgjaDetail | null; error: string | null }> {
  const supabase = getSupabasePublic();
  const [itemResult, galleryResult, allProgjaResult, departmentsResult] = await Promise.all([
    supabase.from('progja').select('*').eq('slug', slug).eq('publish_status', 'terbit').maybeSingle(),
    supabase.from('progja_gallery').select('*').order('slot', { ascending: true }),
    supabase.from('progja').select('*').eq('publish_status', 'terbit').order('start_date', { ascending: false }),
    supabase.from('departments').select('id, name, short_name, group_name').order('sort_order', { ascending: true }),
  ]);
  if (itemResult.error || !itemResult.data) return { data: null, error: 'Program kerja tidak ditemukan.' };
  if (galleryResult.error || allProgjaResult.error || departmentsResult.error) return { data: null, error: 'Detail program kerja belum dapat dimuat.' };

  const departments = (departmentsResult.data ?? []) as DepartmentOption[];
  const item = attachDepartments([itemResult.data as Progja], departments)[0];
  const allItems = attachDepartments((allProgjaResult.data ?? []) as Progja[], departments);
  const sameDepartment = allItems.filter((candidate) => candidate.id !== item.id && candidate.department_id === item.department_id);
  const sameIds = new Set(sameDepartment.map((candidate) => candidate.id));
  const related = [...sameDepartment, ...allItems.filter((candidate) => candidate.id !== item.id && !sameIds.has(candidate.id))].slice(0, 4);
  return {
    data: {
      ...item,
      gallery: ((galleryResult.data ?? []) as ProgjaGallery[]).filter((gallery) => gallery.progja_id === item.id),
      related,
    },
    error: null,
  };
}

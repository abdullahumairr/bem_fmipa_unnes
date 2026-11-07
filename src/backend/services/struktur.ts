import { getSupabaseBrowser } from '@/backend/lib/supabase';
import { slugify } from '@/backend/utils/slug';

export interface DepartmentAgenda {
  id: string;
  department_id: string;
  title: string;
  description: string | null;
  schedule_label: string | null;
  sort_order: number;
}

export interface DepartmentMember {
  id: string;
  department_id: string;
  full_name: string;
  position: string;
  tier: string | null;
  study_program: string | null;
  batch: string | null;
  image_url: string | null;
  image_public_id: string | null;
  sort_order: number;
}

export interface Department {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  group_name: string;
  description: string | null;
  focus_title: string | null;
  focus_subtitle: string | null;
  sort_order: number;
  bidang_id: string | null;
  featured_progja_title: string | null;
  featured_progja_description: string | null;
}

export interface DepartmentWithCounts extends Department {
  agenda_count: number;
  member_count: number;
}

export interface DepartmentDetail extends Department {
  agendas: DepartmentAgenda[];
  members: DepartmentMember[];
}

export interface DepartmentInput {
  name: string;
  bidang_id: string;
  description: string;
  focus_title: string | null;
  focus_subtitle: string | null;
  featured_progja_title: string | null;
  featured_progja_description: string | null;
}

export interface DepartmentAgendaInput {
  title: string;
  description: string;
  schedule_label: string;
}

export interface DepartmentMemberInput {
  id?: string;
  full_name: string;
  position: string;
  tier: 'departemen';
  study_program: string;
  batch: string;
  image_url: string | null;
  image_public_id: string | null;
}

export async function getDepartments(): Promise<{
  data: DepartmentWithCounts[];
  error: string | null;
}> {
  const supabase = getSupabaseBrowser();
  const { data: departments, error } = await supabase
    .from('departments')
    .select('*')
    .eq('group_name', 'Departemen')
    .order('sort_order', { ascending: true });

  if (error || !departments) {
    return { data: [], error: 'Data departemen belum dapat dimuat.' };
  }

  const deptIds = (departments as Department[]).map((d) => d.id);
  if (deptIds.length === 0) return { data: [], error: null };

  const [
    { data: agendas, error: agendaError },
    { data: members, error: memberError },
  ] = await Promise.all([
    supabase.from('department_agendas').select('id, department_id').in('department_id', deptIds),
    supabase.from('members').select('id, department_id').in('department_id', deptIds),
  ]);

  if (agendaError || memberError) {
    return { data: [], error: 'Data departemen belum dapat dimuat.' };
  }

  const agendaCounts = new Map<string, number>();
  (agendas ?? []).forEach((row: { id: string; department_id: string }) => {
    agendaCounts.set(row.department_id, (agendaCounts.get(row.department_id) ?? 0) + 1);
  });
  const memberCounts = new Map<string, number>();
  (members ?? []).forEach((row: { id: string; department_id: string }) => {
    memberCounts.set(row.department_id, (memberCounts.get(row.department_id) ?? 0) + 1);
  });

  const result: DepartmentWithCounts[] = (departments as Department[]).map((dept) => ({
    ...dept,
    agenda_count: agendaCounts.get(dept.id) ?? 0,
    member_count: memberCounts.get(dept.id) ?? 0,
  }));

  return { data: result, error: null };
}

export async function getDepartmentById(
  id: string
): Promise<{ data: DepartmentDetail | null; error: string | null }> {
  const supabase = getSupabaseBrowser();
  const { data: department, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .eq('group_name', 'Departemen')
    .maybeSingle();

  if (error || !department) {
    return { data: null, error: 'Departemen tidak ditemukan.' };
  }

  const dept = department as Department;
  const [
    { data: agendas, error: agendaError },
    { data: members, error: memberError },
  ] = await Promise.all([
    supabase
      .from('department_agendas')
      .select('*')
      .eq('department_id', id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('members')
      .select('*')
      .eq('department_id', id)
      .order('sort_order', { ascending: true }),
  ]);

  if (agendaError || memberError) {
    return { data: null, error: 'Detail departemen belum dapat dimuat.' };
  }

  return {
    data: {
      ...dept,
      agendas: (agendas ?? []) as DepartmentAgenda[],
      members: (members ?? []) as DepartmentMember[],
    },
    error: null,
  };
}

export async function getBidangOptions(): Promise<{
  data: Department[];
  error: string | null;
}> {
  const { data, error } = await getSupabaseBrowser()
    .from('departments')
    .select('*')
    .eq('group_name', 'Koordinator Bidang')
    .order('sort_order', { ascending: true });
  return {
    data: (data ?? []) as Department[],
    error: error ? 'Data bidang koordinasi belum dapat dimuat.' : null,
  };
}

async function deleteCloudinaryImages(publicIds: string[]): Promise<void> {
  if (publicIds.length === 0) return;
  const supabase = getSupabaseBrowser();
  const { data: sessionData } = await supabase.auth.getSession();
  await Promise.all(
    publicIds.map(async (publicId) => {
      await fetch('/api/upload/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionData.session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ public_id: publicId }),
      });
    })
  );
}

export async function saveDepartment(
  input: DepartmentInput,
  agendas: DepartmentAgendaInput[],
  members: DepartmentMemberInput[],
  id?: string,
  initialMembers: DepartmentMember[] = []
): Promise<{ data: Department | null; error: string | null }> {
  const supabase = getSupabaseBrowser();
  const departmentPayload = {
    name: input.name,
    bidang_id: input.bidang_id,
    description: input.description,
    focus_title: input.focus_title,
    focus_subtitle: input.focus_subtitle,
    featured_progja_title: input.featured_progja_title,
    featured_progja_description: input.featured_progja_description,
  };

  let department: Department | null = null;
  if (id) {
    const result = await supabase
      .from('departments')
      .update(departmentPayload)
      .eq('id', id)
      .eq('group_name', 'Departemen')
      .select('*')
      .maybeSingle();
    if (result.error || !result.data) return { data: null, error: 'Departemen gagal diperbarui.' };
    department = result.data as Department;
  } else {
    const { data: latest } = await supabase
      .from('departments')
      .select('sort_order')
      .eq('group_name', 'Departemen')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();
    const result = await supabase
      .from('departments')
      .insert({
        ...departmentPayload,
        slug: slugify(input.name),
        short_name: input.name.slice(0, 4).toUpperCase(),
        group_name: 'Departemen',
        sort_order: Number(latest?.sort_order ?? 0) + 1,
      })
      .select('*')
      .maybeSingle();
    if (result.error || !result.data) return { data: null, error: 'Departemen gagal disimpan.' };
    department = result.data as Department;
  }

  const departmentId = department.id;
  const { error: agendaDeleteError } = await supabase
    .from('department_agendas')
    .delete()
    .eq('department_id', departmentId);
  if (agendaDeleteError) return { data: null, error: 'Agenda lama gagal diperbarui.' };

  if (agendas.length > 0) {
    const { error: agendaInsertError } = await supabase.from('department_agendas').insert(
      agendas.map((agenda, index) => ({
        department_id: departmentId,
        title: agenda.title,
        description: agenda.description || null,
        schedule_label: agenda.schedule_label || null,
        sort_order: index + 1,
      }))
    );
    if (agendaInsertError) return { data: null, error: 'Agenda departemen gagal disimpan.' };
  }

  const currentIds = new Set(members.map((member) => member.id).filter((value): value is string => Boolean(value)));
  const removedMembers = initialMembers.filter((member) => !currentIds.has(member.id));
  const removedPublicIds = removedMembers
    .map((member) => member.image_public_id)
    .filter((value): value is string => Boolean(value));

  if (removedMembers.length > 0) {
    const { error: memberDeleteError } = await supabase
      .from('members')
      .delete()
      .in('id', removedMembers.map((member) => member.id));
    if (memberDeleteError) return { data: null, error: 'Anggota yang dihapus gagal diproses.' };
  }

  for (let index = 0; index < members.length; index += 1) {
    const member = members[index];
    const payload = {
      department_id: departmentId,
      full_name: member.full_name,
      position: member.position,
      tier: 'departemen' as const,
      study_program: member.study_program || null,
      batch: member.batch || null,
      image_url: member.image_url,
      image_public_id: member.image_public_id,
      sort_order: index + 1,
    };
    const result = member.id
      ? await supabase.from('members').update(payload).eq('id', member.id).eq('department_id', departmentId)
      : await supabase.from('members').insert(payload);
    if (result.error) return { data: null, error: 'Daftar anggota gagal disimpan.' };
  }

  await deleteCloudinaryImages(removedPublicIds);
  return { data: department, error: null };
}

export async function deleteDepartment(
  id: string
): Promise<{ error: string | null }> {
  const supabase = getSupabaseBrowser();

  const { data: members } = await supabase
    .from('members')
    .select('image_public_id')
    .eq('department_id', id);

  const publicIds = ((members as Pick<DepartmentMember, 'image_public_id'>[] | null) ?? [])
    .map((m) => m.image_public_id)
    .filter((value): value is string => Boolean(value));

  const { error: agendaError } = await supabase
    .from('department_agendas')
    .delete()
    .eq('department_id', id);
  if (agendaError) return { error: 'Agenda departemen gagal dihapus.' };

  const { error: memberError } = await supabase
    .from('members')
    .delete()
    .eq('department_id', id);
  if (memberError) return { error: 'Anggota departemen gagal dihapus.' };

  const { error: deptError } = await supabase
    .from('departments')
    .delete()
    .eq('id', id)
    .eq('group_name', 'Departemen');
  if (deptError) return { error: 'Departemen gagal dihapus.' };

  if (publicIds.length > 0) {
    const { data: sessionData } = await supabase.auth.getSession();
    await Promise.all(
      publicIds.map(async (publicId) => {
        await fetch('/api/upload/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionData.session?.access_token ?? ''}`,
          },
          body: JSON.stringify({ public_id: publicId }),
        });
      })
    );
  }

  return { error: null };
}

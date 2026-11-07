import Link from 'next/link';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getDepartmentBySlug, getDepartments } from '@/backend/services/public';
import type { DepartmentMember } from '@/backend/services/struktur';
import { AdminAddButton } from '@/frontend/components/public/AdminAddButton';
import { Chip } from '@/frontend/components/public/Chip';
import { EmptyState } from '@/frontend/components/public/EmptyState';
import { PersonCard } from '@/frontend/components/public/PersonCard';
import { kepalaDepartemen, type Jabatan } from '@/frontend/content/struktur-static';

export const revalidate = 60;

// Lebar sel kartu: SAMA untuk baris pimpinan dan Fungsionaris Aktif (1 / 2 / 4 kolom, gap 1.25rem)
const CARD_CELL = 'w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]';

const isWakil = (position: string) => /wakil/i.test(position);
const isKepala = (position: string) => /kepala|ketua/i.test(position) && !isWakil(position);
const isSekretaris = (position: string) => /sekret/i.test(position);

function toPerson(member: DepartmentMember, jabatan: string): Jabatan {
  return {
    jabatan,
    nama: member.full_name,
    prodi: (member.study_program ?? '').replace(/^S1\s+/i, ''),
    angkatan: member.batch ?? '',
    foto: member.image_url,
  };
}

export default async function StrukturDetailPage({ params }: { params: { slug: string } }) {
  const [detailResult, listResult] = await Promise.all([getDepartmentBySlug(params.slug), getDepartments()]);
  if (!detailResult.data) notFound();
  const department = detailResult.data;

  // Kepala Departemen = data statis (struktur-static.ts), bukan dari tabel members
  const kepalaStatic = kepalaDepartemen[department.slug];
  const head: Jabatan | null = kepalaStatic ? { jabatan: 'Kepala Departemen', ...kepalaStatic } : null;

  const deputyMember = department.members.find((member) => isWakil(member.position));
  const secretaryMember = department.members.find((member) => isSekretaris(member.position));
  const deputy = deputyMember ? toPerson(deputyMember, 'Wakil K. Departemen') : null;
  const secretary = secretaryMember ? toPerson(secretaryMember, 'Sekretaris Departemen') : null;
  const staff = department.members.filter(
    (member) => !isKepala(member.position) && member.id !== deputyMember?.id && member.id !== secretaryMember?.id,
  );

  return (
    <div className="px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-muted">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/struktur" className="hover:text-primary">Struktur</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">Detail Biro &amp; Departemen</span>
        </div>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Chip>Direktori Fungsionaris Resmi 2026</Chip>
            <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
              Direktori &amp; Profil Fungsionaris Departemen
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-body">
              Mengenal lebih dalam tupoksi, program kerja strategis, serta susunan kepengurusan (Ketua, Wakil, dan Staf Ahli) pada setiap Biro &amp; Departemen BEM FMIPA UNNES 2026 Kabinet Gema Restorasi 87.
            </p>
          </div>
          <AdminAddButton label="Tambah Departemen" href="/dashboard/struktur/new" />
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {listResult.data.map((item) => (
            <Link
              key={item.id}
              href={`/struktur/${item.slug}`}
              className={`shrink-0 rounded-full border px-3 py-2 text-[10px] font-bold ${item.slug === params.slug ? 'border-primary bg-primary text-white' : 'border-line bg-card text-body hover:border-primary hover:text-primary'}`}
            >
              {item.name} ({item.short_name})
            </Link>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-line bg-card p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="flex flex-wrap gap-2">
                <Chip>Detail Departemen</Chip>
                {department.bidang_id && (
                  <span className="rounded-full bg-accent/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    Bidang Koordinasi
                  </span>
                )}
              </div>
              <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{department.name}</h2>
              <p className="mt-7 text-[10px] font-bold uppercase tracking-wider text-primary">Deskripsi</p>
              <p className="mt-3 text-sm leading-7 text-body">
                {department.description || 'Deskripsi departemen belum tersedia.'}
              </p>
            </div>
            {department.focus_title && (
              <aside className="rounded-2xl bg-primary-soft p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Fokus Utama</p>
                <h3 className="mt-3 text-lg font-extrabold text-ink">{department.focus_title}</h3>
                {department.focus_subtitle && (
                  <p className="mt-2 text-sm leading-6 text-body">{department.focus_subtitle}</p>
                )}
              </aside>
            )}
          </div>
        </section>

        {department.featured_progja_title && (
          <section className="mt-16">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Program Kerja</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Progja</h2>
            <p className="mt-2 text-sm text-body">Program kerja unggulan {department.name}.</p>
            <div className="mt-5 max-w-xl rounded-2xl border border-line bg-primary-soft p-6">
              <Chip>Progja Utama</Chip>
              <h3 className="mt-4 text-xl font-extrabold text-ink">{department.featured_progja_title}</h3>
              {department.featured_progja_description && (
                <p className="mt-3 text-sm leading-6 text-body">{department.featured_progja_description}</p>
              )}
              <Link href="/progja" className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-primary">
                Lihat program kerja <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        )}

        {department.agendas.length > 0 && (
          <section className="mt-16">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Agenda Kerja</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Agenda</h2>
            <p className="mt-2 text-sm text-body">Rangkaian agenda dan kegiatan {department.name}.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {department.agendas.map((agenda, index) => (
                <article key={agenda.id} className="rounded-2xl bg-primary-soft p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Agenda {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-4 text-sm font-extrabold text-ink">{agenda.title}</h3>
                  {agenda.description && <p className="mt-2 text-xs leading-5 text-body">{agenda.description}</p>}
                  <p className="mt-5 flex items-center gap-1.5 text-[10px] font-bold text-primary">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {agenda.schedule_label || 'Jadwal menyusul'}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20">
          <div className="text-center">
            <Chip>Struktur Fungsionaris Resmi</Chip>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Susunan Pengurus &amp; Fungsionaris Departemen {department.short_name} 2026
            </h2>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-8">
            {head && (
              <div className={CARD_CELL}>
                <PersonCard person={head} />
              </div>
            )}
            {deputy && (
              <div className={CARD_CELL}>
                <PersonCard person={deputy} />
              </div>
            )}
            {secretary && (
              <div className={CARD_CELL}>
                <PersonCard person={secretary} />
              </div>
            )}
          </div>

          {!head && !deputy && !secretary && staff.length === 0 && (
            <div className="mt-8">
              <EmptyState
                title="Belum ada data fungsionaris"
                description="Susunan pengurus departemen akan ditampilkan setelah data tersedia."
              />
            </div>
          )}

          <div className="mt-14 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Jajaran Staf Ahli &amp; Anggota Departemen
              </p>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">Fungsionaris Aktif</h3>
            </div>
            <span className="text-xs font-bold text-primary">{staff.length} Fungsionaris Aktif</span>
          </div>

          {staff.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-8">
              {staff.map((member) => (
                <div key={member.id} className={CARD_CELL}>
                  <PersonCard person={toPerson(member, member.position)} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-20 border-t border-line pt-12">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Jelajahi Biro &amp; Departemen Lain</p>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink">Direktori Lengkap Kabinet Gema Restorasi 87</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {listResult.data
              .filter((item) => item.slug !== department.slug)
              .map((item, index) => (
                <Link
                  key={item.id}
                  href={`/struktur/${item.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-line bg-card p-4 text-xs font-bold text-ink hover:border-primary hover:text-primary"
                >
                  <span className="text-lg font-extrabold text-primary/30">{String(index + 1).padStart(2, '0')}</span>
                  {item.name}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
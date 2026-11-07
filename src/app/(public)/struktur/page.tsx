import Link from 'next/link';
import { ArrowDown, Network } from 'lucide-react';
import { getDepartments } from '@/backend/services/public';
import { AdminAddButton } from '@/frontend/components/public/AdminAddButton';
import { PageHero } from '@/frontend/components/public/PageHero';
import { PersonCard } from '@/frontend/components/public/PersonCard';
import { DepartmentDirectoryCard } from '@/frontend/components/public/StructureCards';
import {
  bagan,
  biroKesekretariatanKebendaharaan,
  biroPjmo,
  koordinatorBidang,
  pengurusHarian,
  type Jabatan,
} from '@/frontend/content/struktur-static';

export const revalidate = 60;

// Ukuran kartu SAMA dengan halaman detail departemen: 1 / 2 / 4 kolom, gap 1.25rem
const CARD_CELL = 'w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]';

function CardRow({ people, tight = false }: { people: Jabatan[]; tight?: boolean }) {
  return (
    <div className={`${tight ? 'mt-8' : 'mt-10'} flex flex-wrap justify-center gap-x-5 gap-y-8`}>
      {people.map((person) => (
        <div key={person.nama} className={CARD_CELL}>
          <PersonCard person={person} />
        </div>
      ))}
    </div>
  );
}

export default async function StrukturPage() {
  const result = await getDepartments();

  return (
    <div className="px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <PageHero
        eyebrow="Bagan Kepengurusan & Hierarki"
        title="Struktur Organisasi"
        highlight="BEM FMIPA"
        accent="UNNES 2026"
        subtitle="Kabinet Gema Restorasi 87 - Mengarungi sinergi kepemimpinan yang inklusif, responsif, dan progresif untuk seluruh civitas akademika FMIPA UNNES."
      />

      <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
        <a href="#bagan" className="rounded-full border border-line bg-card px-3 py-2 text-[10px] font-bold text-body hover:border-primary hover:text-primary">
          Bagan Hierarki Interaktif
        </a>
        <a href="#direktori" className="rounded-full border border-line bg-card px-3 py-2 text-[10px] font-bold text-body hover:border-primary hover:text-primary">
          Daftar {result.data.length} Biro &amp; Departemen
        </a>
        <a href="#footer" className="rounded-full border border-line bg-card px-3 py-2 text-[10px] font-bold text-body hover:border-primary hover:text-primary">
          Kontak &amp; Layanan
        </a>
      </div>

      <section id="bagan" className="mx-auto mt-20 max-w-7xl">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Peta Struktur</p>
            <h2 className="mt-2 text-ink">Peta Alur Komando &amp; Sinergi Lembaga</h2>
          </div>
          <Network className="hidden h-7 w-7 text-accent sm:block" />
        </div>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-card p-6 shadow-sm">
          <div className="min-w-[900px]">
            <div className="flex justify-center gap-4">
              <HierarchyBox title={bagan.pimpinan.tertinggi} />
              <HierarchyBox title={bagan.pimpinan.pendamping} />
            </div>
            <div className="my-4 flex justify-center">
              <ArrowDown className="h-5 w-5 text-primary" />
            </div>
            <div className="mx-auto w-fit rounded-xl border-2 border-primary bg-primary-soft px-8 py-3 text-center text-xs font-extrabold text-primary">
              {bagan.pimpinan.koordinasi}
            </div>
            <div className="my-4 flex justify-center">
              <ArrowDown className="h-5 w-5 text-primary" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {bagan.biro.map((item) => (
                <HierarchyBox key={item.nama} title={item.nama} caption={item.peran} />
              ))}
            </div>
            <div className="my-6 flex justify-center">
              <ArrowDown className="h-5 w-5 text-primary" />
            </div>
            <div className="grid grid-cols-6 gap-3">
              {bagan.bidang.map((bidang) => (
                <div key={bidang.kode} className="rounded-xl border border-line bg-bg p-2">
                  <div className="rounded-lg bg-primary px-2 py-2 text-center text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider">{bidang.kode}</p>
                    <p className="mt-0.5 text-[11px] font-bold">{bidang.koordinator}</p>
                  </div>
                  <div className="mt-2 space-y-2">
                    {bidang.departemen.map((dept) => (
                      <Link
                        key={dept.slug}
                        href={`/struktur/${dept.slug}`}
                        className="block rounded-lg bg-card px-2 py-2 text-center text-[11px] font-bold text-body shadow-sm hover:text-primary"
                      >
                        {dept.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Fungsionaris Inti &amp; Koordinator
          </span>
          <h2 className="mt-4 text-ink">Profil Kepengurusan Inti BEM FMIPA 2026</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-body">
            Nakhoda dan motor penggerak Kabinet Gema Restorasi 87 yang memegang komando tata kelola, pengawasan mutu, dan sinergi lintas bidang keilmuan sains.
          </p>
        </div>

        <div className="mt-14 space-y-20">
          <div>
            <TierChip>Tingkat 1 • Pengurus Harian (PH)</TierChip>
            <CardRow people={pengurusHarian} />
          </div>

          <div>
            <TierChip>Tingkat 2 • Biro &amp; Staff Biro</TierChip>
            <h3 className="mt-8 text-center text-ink">Biro Kesekretariatan &amp; Biro Kebendaharaan</h3>
            <p className="mt-1 text-center text-sm text-body">
              Penata kelolaan sistem persuratan, inventaris, dan administrasi keuangan organisasi.
            </p>
            <CardRow people={biroKesekretariatanKebendaharaan} />

            <h3 className="mt-16 text-center text-ink">Biro Pusat Jaminan Mutu Organisasi (PJMO)</h3>
            <p className="mt-1 text-center text-sm text-body">
              Pengawalan standar mutu, evaluasi program kerja, dan pendampingan fungsionaris.
            </p>
            <CardRow people={biroPjmo.slice(0, 3)} />
            <CardRow people={biroPjmo.slice(3)} tight />
          </div>

          <div>
            <TierChip>Tingkat 3 • Koordinator Bidang Kerja</TierChip>
            <CardRow people={koordinatorBidang.slice(0, 3)} />
            <CardRow people={koordinatorBidang.slice(3)} tight />
          </div>
        </div>
      </section>

      <section id="direktori" className="mx-auto mt-24 max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Eksplorasi Direktori</p>
            <h2 className="mt-2 text-ink">Daftar Biro &amp; Departemen</h2>
            <p className="mt-2 text-sm text-body">
              Setiap unit memiliki peran penting dalam menjalankan agenda Kabinet Gema Restorasi 87.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-primary">Total: {result.data.length} Departemen</span>
            <AdminAddButton label="Tambah Departemen" href="/dashboard/struktur/new" />
          </div>
        </div>
        {result.error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{result.error}</div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {result.data.map((department, index) => (
              <DepartmentDirectoryCard key={department.id} department={department} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function HierarchyBox({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg px-6 py-3 text-center shadow-sm">
      {caption && <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{caption}</p>}
      <p className="text-xs font-extrabold text-ink">{title}</p>
    </div>
  );
}

function TierChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-line" />
      <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">{children}</span>
      <span className="h-px w-16 bg-line" />
    </div>
  );
}
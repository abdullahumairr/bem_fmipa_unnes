import Link from "next/link";
import {
  ArrowUpRight,
  AudioWaveform,
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  Globe2,
  Instagram,
  Infinity as InfinityIcon,
  Mail,
  MessageCircle,
  Palette,
  Play,
  Send,
  Sparkles,
  Star,
  Target,
  UsersRound,
  Youtube,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Berita } from "@/backend/services/berita";
import { getHomeData } from "@/backend/services/public";
import { ImageOrPlaceholder } from "@/frontend/components/public/ImageOrPlaceholder";
import { HomeNewsGrid } from "@/frontend/components/public/HomeSections";
import {
  ASPIRASI_URL,
  GUBERNUR_IMAGE_URL,
  HERO_IMAGE_URL,
  beritaHome,
  contact,
  filosofi,
  hero,
  kehormatan,
  portal,
  sekilas,
  visiMisi,
} from "@/frontend/content/home-content";

export const revalidate = 60;

export default async function PublicHomePage() {
  const { progja, prestasi, berita } = await getHomeData();

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <InstitutionSection />
      <HonorSection />
      <VisionSection />
      <LogoSection />
      <PortalSection progja={progja} prestasi={prestasi} />
      <NewsSection berita={berita} />
      <ContactSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
      <div className="mx-auto max-w-7xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <Eyebrow>{hero.chip}</Eyebrow>
        </span>

        <h1 className="heading-6xl hero-inline mx-auto mt-6 max-w-5xl whitespace-nowrap text-6xl font-extrabold leading-none tracking-tight text-ink">
          <span className="bg-[#005AB6] bg-clip-text text-transparent">
            {hero.title}
          </span>{" "}
          <span className=" bg-[#F9CA32] bg-clip-text text-transparent">
            {hero.highlight}
          </span>
        </h1>
        <p className="mt-5 text-lg font-semibold italic text-amber-700">
          “{hero.quote}”
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-body sm:text-base">
          {hero.description}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href={ASPIRASI_URL}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
          >
            Hubungi &amp; Aspirasi <Send className="h-4 w-4" />
          </Link>
          <a
            href="#sekilas"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-5 py-3 text-sm font-bold text-ink hover:border-primary hover:text-primary"
          >
            Pelajari Profil <ChevronRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-10 rounded-3xl border border-line bg-card p-2 shadow-xl shadow-primary/10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <ImageOrPlaceholder
              src={
                "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793897788/fotbarJabem.JPG.jpg"
              }
              alt={hero.photoCaption}
              width={1400}
              className="bg-gradient-to-br from-blue-100 via-primary-soft to-slate-200"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-nav/90 via-nav/10 to-transparent" />
            <div className="absolute bottom-5 left-5 text-left text-white sm:bottom-8 sm:left-8">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                {hero.photoLabel}
              </p>
              <p className="mt-2 text-lg font-extrabold sm:text-2xl">
                {hero.photoCaption}
              </p>
            </div>
          </div>
          <div className="relative z-10 mx-auto -mb-10 mt-3 grid w-[85%] grid-cols-1 divide-y divide-line rounded-xl border border-line bg-white p-2 shadow-lg sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:p-3">
            {hero.stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 px-3 py-2 text-left sm:justify-center"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  {index === 0 ? (
                    <Building2 className="h-4 w-4" />
                  ) : index === 1 ? (
                    <UsersRound className="h-4 w-4" />
                  ) : (
                    <Target className="h-4 w-4" />
                  )}
                </span>
                <span>
                  <strong className="block text-lg font-extrabold leading-none text-ink">
                    {stat.value}
                  </strong>
                  <small className="text-[10px] font-semibold text-body">
                    {stat.label}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InstitutionSection() {
  return (
    <section id="sekilas" className="bg-[#EFF4FF] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <Eyebrow>{sekilas.eyebrow}</Eyebrow>
        </span>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {sekilas.title}
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-body">
          {sekilas.description}
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {sekilas.cards.map((card, index) => (
            <article
              key={card.title}
              className="rounded-2xl border border-line bg-card p-6 text-left shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                {index === 0 ? (
                  <MessageCircle className="h-5 w-5" />
                ) : index === 1 ? (
                  <Sparkles className="h-5 w-5" />
                ) : (
                  <Globe2 className="h-5 w-5" />
                )}
              </span>
              <h3 className="mt-5 font-extrabold text-ink">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-body">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HonorSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <div className="rounded-2xl border border-line bg-card p-3 shadow-lg">
          <div className="aspect-[4/5] overflow-hidden rounded-xl">
            <ImageOrPlaceholder
              src={
                "https://res.cloudinary.com/dwzctbnzl/image/upload/v1793866474/Ronaldo-Situmorang.jpg"
              }
              alt={kehormatan.nama}
              width={600}
            />
          </div>
          <div className="px-2 pb-2 pt-4">
            <p className="font-extrabold text-ink">{kehormatan.nama}</p>
            <p className="mt-1 text-xs font-bold text-primary">
              {kehormatan.jabatan}
            </p>
          </div>
        </div>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <Eyebrow>{kehormatan.eyebrow}</Eyebrow>
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {kehormatan.title}
          </h2>
          <blockquote className="mt-7 border-l-4 border-accent pl-5 text-lg leading-8 text-body">
            “{kehormatan.quote}”
          </blockquote>
          <div className="mt-7 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
              <UsersRound className="h-4 w-4" />
            </span>
            <span>
              <strong className="block text-sm text-ink">
                {kehormatan.nama}
              </strong>
              <small className="text-xs text-body">
                {kehormatan.jabatanTtd}
              </small>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  return (
    <section className="bg-[#EFF4FF] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <Eyebrow>{visiMisi.eyebrow}</Eyebrow>
        </span>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {visiMisi.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-body">
          {visiMisi.subtitle}
        </p>
        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 text-left shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase text-white">
              {visiMisi.badge}
            </span>
            <span className="text-xs font-semibold text-primary">
              {visiMisi.visiPeriode}
            </span>
          </div>
          <p className="mt-5 text-xl font-semibold leading-9 text-ink sm:text-[26px]">
            “{visiMisi.visi}”
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiMisi.misi.map((mission, index) => (
            <article
              key={mission.title}
              className="relative rounded-2xl border border-line bg-card p-5 text-left shadow-sm"
            >
              <span className="text-3xl font-extrabold text-primary/20">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="absolute right-5 top-5 text-primary/70">
                {index % 2 === 0 ? (
                  <Target className="h-5 w-5" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </span>
              <h3 className="mt-4 font-extrabold text-ink">{mission.title}</h3>
              <p className="mt-2 text-sm leading-6 text-body">
                {mission.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <Eyebrow>{filosofi.eyebrow}</Eyebrow>
        </span>

        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {filosofi.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-body">
          {filosofi.subtitle}
        </p>
        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-center rounded-2xl border border-line bg-[#EFF4FF] p-8 shadow-sm">
            <div className="flex w-full flex-1 items-center justify-center">
              <div className="w-full max-w-xs overflow-hidden rounded-xl">
                <ImageOrPlaceholder
                  src="/logo_bem_fmipa_unnes.png"
                  alt={filosofi.caption}
                  width={800}
                  className="min-h-0"
                />
              </div>
            </div>
            <div className="mt-6 w-full border-t border-line pt-5 ">
              <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                Gema Restorasi 87
              </span>
              <p className="mt-3 text-xs font-bold text-body">
                {filosofi.caption}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filosofi.meanings.map((meaning, index) => (
              <article
                key={meaning.title}
                className="rounded-2xl border border-line  p-6 text-left shadow-sm bg-[#EFF4FF]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/10 text-primary">
                  {index === 0 ? (
                    <InfinityIcon className="h-5 w-5" />
                  ) : index === 1 ? (
                    <AudioWaveform className="h-5 w-5" />
                  ) : index === 2 ? (
                    <Star className="h-5 w-5" />
                  ) : (
                    <Palette className="h-5 w-5" />
                  )}
                </span>
                <h3 className="mt-5 font-extrabold text-ink">
                  {meaning.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-body">
                  {meaning.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PortalSection({
  progja,
  prestasi,
}: {
  progja: { title: string; slug: string }[];
  prestasi: { title: string; recipient: string | null } | null;
}) {
  return (
    <section className="bg-primary-soft/60 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <Eyebrow>{portal.eyebrow}</Eyebrow>
        </span>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {portal.title}
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <PortalCard
            icon={<Building2 />}
            data={portal.cards.struktur}
            href="/struktur"
          />
          <article className="rounded-2xl border border-line bg-card p-6 text-left shadow-sm">
            <PortalIcon icon={<Play />} />
            <Eyebrow>{portal.cards.progja.eyebrow}</Eyebrow>
            <h3 className="mt-3 text-xl font-extrabold text-ink">
              {portal.cards.progja.title}
            </h3>
            <ul className="mt-4 space-y-2 text-xs font-semibold text-primary">
              {progja.map((item) => (
                <li key={item.slug} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" />
                  {item.title}
                </li>
              ))}
            </ul>
            <Link
              href="/progja"
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-primary"
            >
              {portal.cards.progja.link}{" "}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </article>
          <article className="rounded-2xl border border-line bg-card p-6 text-left shadow-sm">
            <PortalIcon icon={<Sparkles />} />
            <Eyebrow>{portal.cards.prestasi.eyebrow}</Eyebrow>
            <h3 className="mt-3 text-xl font-extrabold text-ink">
              {portal.cards.prestasi.title}
            </h3>
            <div className="mt-4 rounded-xl bg-primary-soft p-4">
              <small className="text-[10px] font-bold uppercase tracking-wide text-primary">
                {portal.cards.prestasi.highlight}
              </small>
              <p className="mt-2 text-sm font-bold text-ink">
                {prestasi?.title || "—"}
              </p>
              {prestasi?.recipient && (
                <p className="mt-1 text-xs text-body">{prestasi.recipient}</p>
              )}
            </div>
            <Link
              href="/prestasi"
              className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-primary"
            >
              {portal.cards.prestasi.link}{" "}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

function NewsSection({ berita }: { berita: Berita[] }) {
  return (
    <section className="bg-[#EFF4FF] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-primary">
                <BookIcon />
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <Eyebrow>{beritaHome.eyebrow}</Eyebrow>
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {beritaHome.title}
            </h2>
            <p className="mt-2 text-sm text-body">{beritaHome.subtitle}</p>
          </div>
          <Link
            href="/berita"
            className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink hover:border-primary hover:text-primary"
          >
            {beritaHome.link} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8">
          <HomeNewsGrid items={berita} empty={beritaHome.empty} />
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-primary-soft/50 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <Eyebrow>{contact.eyebrow}</Eyebrow>
        </span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {contact.title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-body">
          {contact.subtitle}
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-line bg-white p-5 text-ink">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {contact.base}
              </p>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold text-primary">
                {contact.timezone}
              </span>
            </div>
            <h3 className="mt-3 text-xl font-extrabold">{contact.location}</h3>
            <p className="mt-2 text-sm leading-6 text-body">
              {contact.address}
            </p>
            <div className="mt-5 h-48 overflow-hidden rounded-xl bg-primary-soft">
              <iframe
                title={contact.location}
                src={contact.mapEmbed}
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 font-semibold text-body">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {contact.status}
              </span>
              <span className="text-right text-muted">{contact.response}</span>
            </div>
          </div>
          <div className="space-y-3">
            {contact.links.map((item) => (
              <ContactLink key={item.label} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({ item }: { item: (typeof contact.links)[number] }) {
  const Icon =
    item.platform === "Email"
      ? Mail
      : item.platform === "WhatsApp & Humas"
        ? MessageCircle
        : item.platform === "Instagram"
          ? Instagram
          : item.platform === "TikTok"
            ? Play
            : Youtube;
  const tone =
    item.platform === "Email"
      ? "bg-blue-100 text-blue-700"
      : item.platform === "WhatsApp & Humas"
        ? "bg-emerald-100 text-emerald-700"
        : item.platform === "Instagram"
          ? "bg-orange-100 text-orange-700"
          : item.platform === "TikTok"
            ? "bg-slate-200 text-slate-800"
            : "bg-red-100 text-red-700";
  return (
    <a
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
      className="flex items-center justify-between rounded-xl border border-line bg-white p-4 transition-colors hover:border-primary"
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span>
          <small className="block text-[10px] font-bold uppercase tracking-wider text-muted">
            {item.label}
          </small>
          <strong className="mt-1 block text-sm text-ink">{item.value}</strong>
        </span>
      </span>
      <ChevronRight className="h-4 w-4 text-muted" />
    </a>
  );
}

function PortalCard({
  icon,
  data,
  href,
}: {
  icon: ReactNode;
  data: { eyebrow: string; title: string; description: string; link: string };
  href: string;
}) {
  return (
    <article className="rounded-2xl border border-line bg-card p-6 text-left shadow-sm">
      <PortalIcon icon={icon} />
      <Eyebrow>{data.eyebrow}</Eyebrow>
      <h3 className="mt-3 text-xl font-extrabold text-ink">{data.title}</h3>
      <p className="mt-2 text-sm leading-6 text-body">{data.description}</p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-primary"
      >
        {data.link} <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}

function PortalIcon({ icon }: { icon: ReactNode }) {
  return (
    <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
      {icon}
    </span>
  );
}
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
      {children}
    </p>
  );
}
function BookIcon() {
  return <BookOpen className="h-4 w-4" />;
}

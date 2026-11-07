export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary">{eyebrow}</p>}
      <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-sm leading-7 text-body">{description}</p>}
    </div>
  );
}

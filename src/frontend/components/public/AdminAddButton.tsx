import Link from 'next/link';

export function AdminAddButton({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="inline-flex items-center rounded-lg border border-primary px-3 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary-soft">
      + {label}
    </Link>
  );
}

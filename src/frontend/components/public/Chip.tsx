export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
      {children}
    </span>
  );
}

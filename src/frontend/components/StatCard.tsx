export function StatCard({
  label,
  value,
  suffix,
  note,
  icon,
}: {
  label: string;
  value: number;
  suffix: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[#0B57C4]">{icon}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
        <span className="text-xs font-semibold text-slate-500">{suffix}</span>
      </div>
      <p className="mt-1 text-[10px] font-semibold text-[#0B57C4]">{note}</p>
    </div>
  );
}

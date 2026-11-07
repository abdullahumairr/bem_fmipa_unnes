import { Inbox } from 'lucide-react';

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-card px-6 py-12 text-center">
      <Inbox className="mx-auto h-8 w-8 text-muted" />
      <h3 className="mt-4 text-sm font-extrabold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">{description}</p>
    </div>
  );
}

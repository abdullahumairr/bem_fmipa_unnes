'use client';

import Link from 'next/link';
import { ArrowLeft, Edit3 } from 'lucide-react';

import { Button } from '@ui/button';

export default function ProgjaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">Detail program kerja</p>
      <h2 className="mt-2 text-xl font-bold text-slate-900">Halaman detail Progja</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Data detail akan ditampilkan pada tahap pengelolaan konten berikutnya.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/dashboard/progja">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Button>
        </Link>
        <Link href={`/dashboard/progja/${params.id}/edit`}>
          <Button><Edit3 className="mr-2 h-4 w-4" />Edit Progja</Button>
        </Link>
      </div>
    </div>
  );
}

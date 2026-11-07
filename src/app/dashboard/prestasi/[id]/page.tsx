'use client';

import Link from 'next/link';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { Button } from '@ui/button';

export default function PrestasiDetailPage({ params }: { params: { id: string } }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Detail Prestasi</h2><p className="mt-2 text-sm text-slate-500">Halaman detail prestasi akan menampilkan rekam capaian lengkap.</p><div className="mt-6 flex gap-3"><Link href="/dashboard/prestasi"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Button></Link><Link href={`/dashboard/prestasi/${params.id}/edit`}><Button><Edit3 className="mr-2 h-4 w-4" />Edit Prestasi</Button></Link></div></div>;
}

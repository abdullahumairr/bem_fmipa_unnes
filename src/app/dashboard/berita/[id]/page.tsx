'use client';

import Link from 'next/link';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { Button } from '@ui/button';

export default function BeritaDetailPage({ params }: { params: { id: string } }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Detail Berita & Warta</h2><p className="mt-2 text-sm text-slate-500">Halaman detail berita akan menampilkan naskah, banner, dan konfigurasi aksi lengkap.</p><div className="mt-6 flex gap-3"><Link href="/dashboard/berita"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" />Kembali</Button></Link><Link href={`/dashboard/berita/${params.id}/edit`}><Button><Edit3 className="mr-2 h-4 w-4" />Edit Berita</Button></Link></div></div>;
}

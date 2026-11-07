'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  UploadCloud,
  RefreshCw,
} from 'lucide-react';

import { useAuth } from '@/frontend/context/auth-context';
import { getSupabaseBrowser } from '@/backend/lib/supabase';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';

type CheckStatus = 'idle' | 'loading' | 'ok' | 'error';

interface SupabaseCheck {
  status: CheckStatus;
  departmentCount: number | null;
  message: string;
}

interface UploadCheck {
  status: CheckStatus;
  url: string | null;
  message: string;
}

export default function HealthPage() {
  const { session } = useAuth();
  const [supabaseCheck, setSupabaseCheck] = useState<SupabaseCheck>({
    status: 'idle',
    departmentCount: null,
    message: '',
  });
  const [uploadCheck, setUploadCheck] = useState<UploadCheck>({
    status: 'idle',
    url: null,
    message: '',
  });

  const runSupabaseCheck = useCallback(async () => {
    setSupabaseCheck({ status: 'loading', departmentCount: null, message: '' });
    try {
      const supabase = getSupabaseBrowser();
      const { count, error } = await supabase
        .from('departments')
        .select('*', { count: 'exact', head: true });
      if (error) {
        setSupabaseCheck({
          status: 'error',
          departmentCount: null,
          message: error.message,
        });
        return;
      }
      setSupabaseCheck({
        status: 'ok',
        departmentCount: count ?? 0,
        message:
          count === 15
            ? 'Jumlah departemen sesuai (15).'
            : `Jumlah departemen: ${count ?? 0}. Seharusnya 15 jika seed sudah jalan.`,
      });
    } catch (err) {
      setSupabaseCheck({
        status: 'error',
        departmentCount: null,
        message: err instanceof Error ? err.message : 'Gagal terhubung.',
      });
    }
  }, []);

  const runUploadCheck = useCallback(async () => {
    if (!session?.access_token) {
      setUploadCheck({
        status: 'error',
        url: null,
        message: 'Sesi tidak ditemukan. Silakan masuk ulang.',
      });
      return;
    }
    setUploadCheck({ status: 'loading', url: null, message: '' });
    try {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="#3b82f6" width="100" height="100"/></svg>`;
      const file = new File([svg], 'health-test.svg', { type: 'image/png' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'struktur');

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadCheck({
          status: 'error',
          url: null,
          message: data?.error ?? 'Upload gagal.',
        });
        return;
      }
      setUploadCheck({
        status: 'ok',
        url: data.secure_url,
        message: 'Gambar uji berhasil diunggah ke Cloudinary.',
      });
    } catch (err) {
      setUploadCheck({
        status: 'error',
        url: null,
        message: err instanceof Error ? err.message : 'Upload gagal.',
      });
    }
  }, [session?.access_token]);

  useEffect(() => {
    runSupabaseCheck();
  }, [runSupabaseCheck]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Status Koneksi
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cek apakah Supabase dan Cloudinary terhubung dengan benar.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Supabase
          </CardTitle>
          <CardDescription>
            Mengecek jumlah baris pada tabel departments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <StatusIcon status={supabaseCheck.status} />
            <span className="text-sm">
              {supabaseCheck.status === 'loading' && 'Menghubungkan…'}
              {supabaseCheck.status === 'ok' && supabaseCheck.message}
              {supabaseCheck.status === 'error' && supabaseCheck.message}
              {supabaseCheck.status === 'idle' && 'Menunggu pengecekan.'}
            </span>
          </div>
          {supabaseCheck.departmentCount !== null && (
            <p className="text-2xl font-semibold tabular-nums">
              {supabaseCheck.departmentCount} departemen
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={runSupabaseCheck}
            disabled={supabaseCheck.status === 'loading'}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Cek Ulang
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Cloudinary
          </CardTitle>
          <CardDescription>
            Menguji upload satu gambar ke Cloudinary.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <StatusIcon status={uploadCheck.status} />
            <span className="text-sm">
              {uploadCheck.status === 'loading' && 'Mengunggah gambar uji…'}
              {uploadCheck.status === 'ok' && uploadCheck.message}
              {uploadCheck.status === 'error' && uploadCheck.message}
              {uploadCheck.status === 'idle' &&
                'Belum diuji. Klik tombol di bawah.'}
            </span>
          </div>
          {uploadCheck.url && (
            <div className="break-all rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
              {uploadCheck.url}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={runUploadCheck}
            disabled={uploadCheck.status === 'loading'}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Tes Upload
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === 'loading')
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  if (status === 'ok')
    return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (status === 'error')
    return <XCircle className="h-5 w-5 text-destructive" />;
  return <div className="h-5 w-5 rounded-full border border-muted-foreground/30" />;
}

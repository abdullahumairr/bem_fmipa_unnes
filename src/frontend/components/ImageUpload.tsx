'use client';

import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, RefreshCw } from 'lucide-react';

import { cn } from '@/backend/lib/utils';
import { Button } from '@ui/button';
import { useAuth } from '@/frontend/context/auth-context';

export interface ImageUploadProps {
  value: string | null;
  publicId: string | null;
  folder: 'progja' | 'progja-gallery' | 'prestasi' | 'berita' | 'struktur';
  aspectHint?: string;
  onChange: (result: { url: string; public_id: string } | null) => void;
}

export function ImageUpload({
  value,
  publicId,
  folder,
  aspectHint,
  onChange,
}: ImageUploadProps) {
  const { session } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function deleteOldImage(oldPublicId: string | null) {
    if (!oldPublicId) return;
    try {
      await fetch('/api/upload/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ public_id: oldPublicId }),
      });
    } catch {
      // best-effort; hapus di server gagal tidak boleh memblokir
    }
  }

  async function handleFile(file: File) {
    setError(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Format berkas harus JPG, PNG, atau WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran berkas maksimal 5 MB.');
      return;
    }

    setUploading(true);
    setFileName(file.name);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Upload gagal.');
        return;
      }

      if (publicId) {
        await deleteOldImage(publicId);
      }

      onChange({ url: data.secure_url, public_id: data.public_id });
    } catch {
      setError('Terjadi kesalahan jaringan saat upload.');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (uploading) return;
    setError(null);
    await deleteOldImage(publicId);
    onChange(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 p-6 text-center transition-colors',
          uploading && 'opacity-60'
        )}
        style={
          aspectHint
            ? { aspectRatio: aspectHint.replace(':', ' / ') }
            : { minHeight: '10rem' }
        }
      >
        {value && !uploading ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Pratinjau"
            className="max-h-full max-w-full rounded-md object-contain"
          />
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span>Mengunggah {fileName}…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <ImagePlus className="h-8 w-8 text-blue-400" />
            <span>Klik untuk memilih gambar</span>
            {aspectHint && (
              <span className="text-xs text-muted-foreground/70">
                Disarankan rasio {aspectHint}
              </span>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {fileName && !uploading && value && (
        <p className="truncate text-xs text-muted-foreground">{fileName}</p>
      )}

      {error && (
        <p className="text-sm font-medium text-destructive">{error}</p>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Ganti Berkas
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || !value}
          onClick={handleRemove}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Hapus Gambar
        </Button>
      </div>
    </div>
  );
}

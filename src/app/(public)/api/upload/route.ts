import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

import { createServerClient } from '@/backend/lib/supabase';
import {
  configureCloudinary,
  cloudinaryFolder,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_FOLDERS,
  UploadFolder,
} from '@/backend/lib/cloudinary';

export const runtime = 'nodejs';

async function requireAdmin(authHeader: string | null) {
  if (!authHeader) return { authorized: false, status: 401, message: 'Anda belum login.' };
  const supabase = createServerClient(authHeader);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { authorized: false, status: 401, message: 'Sesi tidak valid.' };
  }
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (error || !profile) {
    return { authorized: false, status: 403, message: 'Profil tidak ditemukan.' };
  }
  if (profile.role !== 'admin') {
    return { authorized: false, status: 403, message: 'Akses hanya untuk admin.' };
  }
  return { authorized: true as const, user };
}

export async function POST(req: NextRequest) {
  const authResult = await requireAdmin(req.headers.get('authorization'));
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.message },
      { status: authResult.status }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Berkas tidak ditemukan.' },
        { status: 400 }
      );
    }
    if (!folder || typeof folder !== 'string') {
      return NextResponse.json(
        { error: 'Folder tujuan belum dipilih.' },
        { status: 400 }
      );
    }
    if (!UPLOAD_FOLDERS.includes(folder as UploadFolder)) {
      return NextResponse.json(
        { error: 'Folder tidak valid.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format berkas harus JPG, PNG, atau WEBP.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran berkas maksimal 5 MB.' },
        { status: 400 }
      );
    }

    const cloudinary = configureCloudinary();
    const targetFolder = cloudinaryFolder(folder as UploadFolder);

    const bytes = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(bytes);

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: targetFolder,
          resource_type: 'image',
        },
        (err, res) => {
          if (err || !res) {
            reject(err ?? new Error('Upload gagal.'));
            return;
          }
          resolve({
            secure_url: res.secure_url,
            public_id: res.public_id,
          });
        }
      );
      stream.pipe(uploadStream);
    });

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Terjadi kesalahan saat upload.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

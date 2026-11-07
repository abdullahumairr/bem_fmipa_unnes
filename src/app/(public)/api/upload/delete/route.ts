import { NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@/backend/lib/supabase';
import { configureCloudinary } from '@/backend/lib/cloudinary';

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
  return { authorized: true as const };
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
    const body = await req.json();
    const publicId = body?.public_id;

    if (!publicId || typeof publicId !== 'string') {
      return NextResponse.json(
        { error: 'public_id wajib diisi.' },
        { status: 400 }
      );
    }

    const cloudinary = configureCloudinary();
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });

    if (result.result !== 'ok' && result.result !== 'not found') {
      return NextResponse.json(
        { error: 'Gagal menghapus gambar.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result: result.result });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

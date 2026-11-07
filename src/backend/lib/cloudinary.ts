import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let configured = false;

export function isCloudinaryConfigured(): boolean {
  return Boolean(cloudName && apiKey && apiSecret);
}

export function configureCloudinary() {
  if (configured) return cloudinary;
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, atau CLOUDINARY_API_SECRET belum tersedia di .env'
    );
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
  return cloudinary;
}

export const UPLOAD_FOLDERS = [
  'progja',
  'progja-gallery',
  'prestasi',
  'berita',
  'struktur',
] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function cloudinaryFolder(folder: UploadFolder): string {
  return `bem-fmipa/${folder}`;
}

export { cloudinary };

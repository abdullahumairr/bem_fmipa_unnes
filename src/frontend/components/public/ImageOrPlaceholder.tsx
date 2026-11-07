import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

export function cld(url: string, width: number): string {
  return url.includes('/upload/') ? url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`) : url;
}

export function ImageOrPlaceholder({ src, alt, width = 900, className = '' }: { src?: string | null; alt: string; width?: number; className?: string }) {
  if (!src) {
    return <div className={`flex h-full min-h-40 items-center justify-center bg-gradient-to-br from-primary-soft via-blue-100 to-sky-200 ${className}`}><ImageIcon className="h-10 w-10 text-primary/40" /></div>;
  }
  return <Image src={cld(src, width)} alt={alt} width={width} height={Math.round(width * 0.62)} className={`h-full w-full object-cover ${className}`} />;
}

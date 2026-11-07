import { Footer } from '@/frontend/components/public/Footer';
import { Navbar } from '@/frontend/components/public/Navbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bg text-ink"><Navbar /><main className="public-main">{children}</main><Footer /></div>;
}

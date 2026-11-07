import { BeritaForm } from '@/frontend/components/BeritaForm';

export default function EditBeritaPage({ params }: { params: { id: string } }) {
  return <BeritaForm id={params.id} />;
}

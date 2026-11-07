import { PrestasiForm } from '@/frontend/components/PrestasiForm';

export default function EditPrestasiPage({ params }: { params: { id: string } }) {
  return <PrestasiForm id={params.id} />;
}

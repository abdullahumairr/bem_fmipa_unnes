import { StrukturForm } from '@/frontend/components/StrukturForm';

export default function EditStrukturPage({ params }: { params: { id: string } }) {
  return <StrukturForm id={params.id} />;
}

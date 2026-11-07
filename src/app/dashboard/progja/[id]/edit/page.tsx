import { ProgjaForm } from '@/frontend/components/ProgjaForm';

export default function EditProgjaPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProgjaForm id={params.id} />;
}

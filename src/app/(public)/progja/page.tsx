import { ProgjaCatalog } from '@/frontend/components/public/ProgjaCatalog';
import { getProgjaList } from '@/backend/services/public';

export const revalidate = 60;

export default async function ProgjaPage() {
  const result = await getProgjaList();
  const departments = Array.from(new Map(result.data.filter((item) => item.department).map((item) => [item.department!.id, item.department!])).values());
  return <ProgjaCatalog items={result.data} departments={departments} error={result.error} />;
}

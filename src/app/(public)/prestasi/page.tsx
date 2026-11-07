import { getPrestasiList } from '@/backend/services/public';
import { PrestasiCatalog } from '@/frontend/components/public/PrestasiCatalog';

export const revalidate = 60;

export default async function PrestasiPage() {
  const result = await getPrestasiList();
  return <PrestasiCatalog items={result.data} error={result.error} />;
}

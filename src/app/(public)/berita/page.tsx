import { getBeritaList } from '@/backend/services/public';
import { BeritaCatalog } from '@/frontend/components/public/BeritaCatalog';

export const revalidate = 60;

export default async function BeritaPage() {
  const result = await getBeritaList();
  return <BeritaCatalog items={result.data} error={result.error} />;
}

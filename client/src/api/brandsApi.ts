import { api, apiAuth } from './http';

export async function getBrands() {
  const { data } = await api.get('/brand');
  return data;
}

export async function createBrand(name: string) {
  return await apiAuth.post('/brand', { name });
}

export async function deleteBrand(id: number) {
  return await apiAuth.delete('/brand/' + id);
}

export async function updateBrand(id: number, values: Record<string, any>) {
  return await apiAuth.patch('/brand/' + id, { ...values });
}

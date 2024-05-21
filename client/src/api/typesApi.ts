import { api, apiAuth } from './http';

export async function getTypes() {
  const { data } = await api.get('/type');
  return data;
}

export async function getType(id: number) {
  const { data } = await api.get('/type/' + id);
  return data;
}

export async function createType(name: string, brands: number[]) {
  return await apiAuth.post('/type', { name, brands });
}

export async function deleteType(id: number) {
  return await apiAuth.delete('/type/' + id);
}

export async function updateType(id: number, name: string, brands: number[]) {
  return await apiAuth.patch('/type/' + id, { name, brands });
}

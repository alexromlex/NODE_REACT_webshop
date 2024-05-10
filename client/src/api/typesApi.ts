import { TypeInterface } from '../common/types';
import { api, apiAuth } from './http';

export async function getTypes() {
  const { data } = await api.get<TypeInterface[]>('/type');
  return data;
}

export async function getType(id: number) {
  const { data } = await api.get<TypeInterface>('/type/' + id);
  return data;
}

export async function createType(name: string, brands: string[]) {
  const response = await apiAuth.post('/type', { name, brands });
  return response;
}

export async function deleteType(id: number) {
  const response = await apiAuth.delete('/type/' + id);
  return response;
}

export async function updateType(id: number, name: string, brands: string[]) {
  const response = await apiAuth.patch('/type/' + id, { name, brands });
  return response;
}

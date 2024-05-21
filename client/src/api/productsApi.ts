import { ProductInterface } from '../common/types';

import { api, apiAuth } from './http';

export async function getProducts(
  typeId: number | null,
  brandId: number | null,
  page: number | null,
  limit: number | null,
  sort: string[] | null,
  v: string | null
) {
  return api.get('/product', { params: { typeId, brandId, page, limit, sort, v } });
}

export async function getProduct(id: number) {
  const { data } = await api.get<ProductInterface>('/product/' + id);
  return data;
}

export async function createProduct(product: FormData) {
  return apiAuth.post('/product', product);
}

export async function updateProduct(id: number, data: FormData) {
  return await apiAuth.patch('/product/' + id, data);
}

export async function deleteProduct(id: number) {
  return await apiAuth.delete('/product/' + id);
}

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
  const promise = api.get('/product', { params: { typeId, brandId, page, limit, sort, v } });
  // .then(({ data }) => data);
  return promise;
}

export async function getProduct(id: number) {
  const { data } = await api.get<ProductInterface>('/product/' + id);
  return data;
}

export async function createProduct(product: FormData) {
  const response = await apiAuth.post('/product', product);
  console.log('create resp: ', response);
  return response;
}

export async function updateProduct(id: number, data: FormData) {
  const response = await apiAuth.patch('/product/' + id, data);
  return response;
}

export async function deleteProduct(id: number) {
  const response = await apiAuth.delete('/product/' + id);
  return response;
}

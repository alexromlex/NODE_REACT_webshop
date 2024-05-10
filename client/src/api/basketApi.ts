import { api } from './http';

export async function getBasket(userId: number | undefined = undefined, productId: number | undefined = undefined) {
  const resp = await api.post('/basket', { user_id: userId, product_id: productId });
  return resp.data;
}

export async function addToBasket(productId: number, quantity: number) {
  const resp = await api.post('/basket/add', { product_id: productId, quantity });
  return resp;
}
export async function emptyBasket() {
  const resp = await api.get('/basket/empty');
  return resp;
}

export async function deleteFromBasket(productId: number, quantity: number) {
  const resp = await api.post('/basket/delete', { product_id: productId, quantity });
  return resp;
}

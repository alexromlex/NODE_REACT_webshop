import { api } from './http';

export async function getBasket(userId: number | undefined = undefined, productId: number | undefined = undefined) {
  const {data} = await api.post('/basket', { user_id: userId, product_id: productId });
  return data;
}

export async function addToBasket(productId: number, quantity: number) {
  return  await api.post('/basket/add', { product_id: productId, quantity });
}
export async function emptyBasket() {
  return  await api.get('/basket/empty');
}

export async function deleteFromBasket(productId: number, quantity: number) {
  return  await api.post('/basket/delete', { product_id: productId, quantity });
}

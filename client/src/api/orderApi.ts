import { OrderInterface } from '../common/types';
import { apiAuth } from './http';

export async function getAllOrder(params: { [key: string]: any }) {
  const resp = await apiAuth.get('/order', { params });
  return resp;
}

export async function getUserOrders() {
  const { data } = await apiAuth.get('/order/user');
  return data;
}

export async function newOrder(orderData: OrderInterface) {
  const resp = await apiAuth.post('/order/new', orderData);
  return resp;
}

export async function updateOrder(id: number, values: { [key: string]: any }) {
  const resp = await apiAuth.patch('/order/update/' + id, { values });
  return resp;
}

export async function cancelOrderByUser(id: number) {
  const resp = await apiAuth.post('/order/cancel', { id });
  return resp;
}

export async function getOrderStatisticByStatus(params: { [key: string]: any }) {
  const resp = await apiAuth.post('/order/statistic/by_status', { ...params });
  return resp;
}

export async function getOrderStatisticAOV(params: { [key: string]: any }) {
  const resp = await apiAuth.post('/order/statistic/aov', { ...params });
  return resp;
}

export async function getOrderProductBestSellers(params: { [key: string]: any }) {
  const resp = await apiAuth.post('/order/statistic/best_sellers', { ...params });
  return resp;
}
export async function countOrderByStatus(params: { [key: string]: any }) {
  const resp = await apiAuth.post('/order/statistic/count_status', { ...params });
  return resp;
}

export async function getMonthlySales(
  startDate: string | Date,
  endDate: string | Date,
  excludeStatuses: string[] = []
) {
  const resp = await apiAuth.post('/order/statistic/monthly_sales', { startDate, endDate, excludeStatuses });
  return resp;
}

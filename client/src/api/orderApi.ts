import { OrderInterface } from '../common/types';
import { apiAuth } from './http';

export async function getAllOrder(params: Record<string, any> | null = null) {
  return await apiAuth.get('/order', { params });
}

export async function getUserOrders() {
  const { data } = await apiAuth.get('/order/user');
  return data;
}

export async function newOrder(orderData: OrderInterface) {
  return await apiAuth.post('/order/new', orderData);
}

export async function updateOrder(id: number, values: Record<string, any>) {
  return await apiAuth.patch('/order/update/' + id, { values });
}

export async function cancelOrderByUser(id: number) {
  return await apiAuth.post('/order/cancel', { id });
}

export async function getOrderStatisticByStatus(params: Record<string, any>) {
  return await apiAuth.post('/order/statistic/by_status', { ...params });
}

export async function getOrderStatisticAOV(params: Record<string, any>) {
  return await apiAuth.post('/order/statistic/aov', { ...params });
}

export async function getOrderProductBestSellers(params: Record<string, any>) {
  return await apiAuth.post('/order/statistic/best_sellers', { ...params });
}
export async function countOrderByStatus(params: Record<string, any>) {
  return await apiAuth.post('/order/statistic/count_status', { ...params });
}

export async function getMonthlySales(
  startDate: string | Date,
  endDate: string | Date,
  excludeStatuses: string[] = []
) {
  return await apiAuth.post('/order/statistic/monthly_sales', { startDate, endDate, excludeStatuses });
}

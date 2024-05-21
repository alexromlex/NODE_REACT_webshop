import { CreateUserInterface } from '../common/types';
import { api, apiAuth } from './http';

export const userRegistration = async (email: string, password: string) => {
  return await api.post('/user/registration', { email, password, role: 'USER' });
};

export const userLogin = async (email: string, password: string) => {
  return await api.post('/user/login', { email, password });
};

export const userCheckAuth = async () => {
  return await apiAuth.get('/user/auth');
};

export async function getUsers() {
  const { data } = await apiAuth.get('/user/all/');
  return data;
}

export async function getOne(id: number) {
  const { data } = await apiAuth.get('/user/' + id);
  return data;
}

export async function createUser(data: CreateUserInterface) {
  return await apiAuth.post('/user', data);
}

export async function deleteUser(id: number) {
  return await apiAuth.delete('/user/' + id);
}

export async function updateUser(id: number, values: Record<string, any>) {
  return await apiAuth.patch('/user/' + id, { ...values });
}

export async function getMontlyUserRegs(startDate: string | Date, endDate: string | Date) {
  return await apiAuth.post('/user/statistic/monthly_regs', { startDate, endDate });
}

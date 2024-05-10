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

export async function createUser(data) {
  const response = await apiAuth.post('/user', data);
  return response;
}

export async function deleteUser(id: number) {
  const response = await apiAuth.delete('/user/' + id);
  return response;
}

export async function updateUser(id: number, values) {
  const response = await apiAuth.patch('/user/' + id, { ...values });
  return response;
}

export async function getMontlyUserRegs(startDate: string | Date, endDate: string | Date) {
  const response = await apiAuth.post('/user/statistic/monthly_regs', { startDate, endDate });
  return response;
}

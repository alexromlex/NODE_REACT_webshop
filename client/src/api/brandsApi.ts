import { api, apiAuth } from './http';

export async function getBrands() {
    const { data } = await api.get('/brand');
    return data;
}

export async function createBrand(name: string) {
    const response = await apiAuth.post('/brand', { name });
    return response;
}

export async function deleteBrand(id: number) {
    const response = await apiAuth.delete('/brand/' + id);
    return response;
}

export async function updateBrand(id: number, values) {
    const response = await apiAuth.patch('/brand/' + id, { ...values });
    return response;
}


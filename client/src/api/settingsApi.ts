import { api, apiAuth } from './http';

export async function getSettings() {
    const response = await apiAuth.get('/settings/');
    return response;
}

export async function updateSettings(settings: { name: string; value: string }[]) {
    const response = await apiAuth.patch('/settings/', { settings });
    return response;
}

export async function getMainSettings() {
    const response = await api.get('/settings/main/');
    return response;
}

export async function getGenTermsSettings() {
    const response = await api.get('/settings/genterms/');
    return response;
}

export async function getPrivacyCondSettings() {
    const response = await api.get('/settings/privacy/');
    return response;
}

export async function getBillingSettings() {
    const response = await apiAuth.get('/settings/billing/');
    return response;
}

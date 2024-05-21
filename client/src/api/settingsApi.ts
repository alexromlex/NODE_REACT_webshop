import { api, apiAuth } from './http';

export async function getSettings() {
  return await apiAuth.get('/settings/');
}

export async function updateSettings(settings: { name: string; value: string }[]) {
  return await apiAuth.patch('/settings/', { settings });
}

export async function getMainSettings() {
  return await api.get('/settings/main/');
}

export async function getGenTermsSettings() {
  return await api.get('/settings/genterms/');
}

export async function getPrivacyCondSettings() {
  return await api.get('/settings/privacy/');
}

export async function getBillingSettings() {
  return await apiAuth.get('/settings/billing/');
}

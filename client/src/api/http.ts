import axios from 'axios';

export const serverUrl = `${window.location['protocol']}//${process.env.VITE_SERVER_HOST}:${process.env.VITE_SERVER_PORT}`;

export const api = axios.create({
  baseURL: serverUrl + '/api',
  withCredentials: true,
});
export const apiAuth = axios.create({
  baseURL: serverUrl + '/api',
  withCredentials: true,
});

apiAuth.interceptors.request.use((config) => {
  config.headers.Authorization = `ROMLEX ${localStorage.getItem('token')}`;
  return config;
});

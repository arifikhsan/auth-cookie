// lib/axiosClient.ts
'use client';
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

axiosClient.interceptors.request.use(async (config) => {
  try {
    const res = await fetch('/api/get-fresh-access-token', {
      credentials: 'include',
    });
    const data = await res.json();

    if (data?.accessToken) {
      config.headers.Authorization = `Bearer ${data.accessToken}`;
    }
  } catch (err) {
    console.warn('⚠️ Failed to get fresh access token:', err);
  }

  return config;
});

export default axiosClient;

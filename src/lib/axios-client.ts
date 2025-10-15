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

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If refresh endpoint failed or returned 401
    if (error.response?.status === 401 || error.response?.data?.message?.includes("Refresh failed")) {
      // Optionally call /api/logout to clear cookies
      await fetch("/api/logout", { method: "POST" });
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

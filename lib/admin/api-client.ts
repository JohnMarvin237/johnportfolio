// lib/admin/api-client.ts
// 'use client' is not needed here — this module is only imported by client components.
// withCredentials: true ensures the HttpOnly auth_token cookie is sent automatically.
import axios from 'axios';

const apiClient = axios.create({ baseURL: '/api', withCredentials: true });

// On 401, redirect to login — the session has expired or the token is invalid.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

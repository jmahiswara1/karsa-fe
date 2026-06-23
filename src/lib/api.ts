import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

// Helper to get cookie value by name on the client side
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Prevent multiple refresh calls at the same time
let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: unknown) => void }[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

// Response interceptor to handle 401s with auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh if the failing request is the refresh endpoint itself
      if (originalRequest.url?.includes('/api/auth/refresh')) {
        // Refresh token is also invalid → force logout
        deleteCookie('access_token');
        deleteCookie('refresh_token');
        if (typeof window !== 'undefined' && !useAuthStore.getState().isLoggingOut) {
          if (
            !window.location.pathname.includes('/login') &&
            window.location.pathname !== '/' &&
            window.location.pathname !== '/en' &&
            window.location.pathname !== '/id'
          ) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }

      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookie('refresh_token');

      if (!refreshToken) {
        // No refresh token available → force logout
        isRefreshing = false;
        deleteCookie('access_token');
        if (typeof window !== 'undefined' && !useAuthStore.getState().isLoggingOut) {
          if (
            !window.location.pathname.includes('/login') &&
            window.location.pathname !== '/' &&
            window.location.pathname !== '/en' &&
            window.location.pathname !== '/id'
          ) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }

      try {
        // Call the refresh endpoint
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        // Save new tokens to cookies
        setCookie('access_token', newAccessToken, 15 * 60); // 15 minutes
        setCookie('refresh_token', newRefreshToken, 7 * 24 * 60 * 60); // 7 days

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process all queued requests with the new token
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → force logout
        processQueue(refreshError, null);
        deleteCookie('access_token');
        deleteCookie('refresh_token');
        if (typeof window !== 'undefined' && !useAuthStore.getState().isLoggingOut) {
          if (
            !window.location.pathname.includes('/login') &&
            window.location.pathname !== '/' &&
            window.location.pathname !== '/en' &&
            window.location.pathname !== '/id'
          ) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

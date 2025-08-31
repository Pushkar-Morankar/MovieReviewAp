import axios from 'axios';
import * as storage from '../utils/storage';
import { Tokens } from '../types';

const API_BASE_URL = 'http://10.0.2.2:8000/api/';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// --- Axios Interceptor for Token Refresh ---

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedTokens = await storage.getTokens();
      if (!storedTokens?.refresh) {
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post< { access: string } >(
          `${API_BASE_URL}auth/token/refresh/`,
          { refresh: storedTokens.refresh }
        );
        const newAccessToken = data.access;
        const newTokens: Tokens = { ...storedTokens, access: newAccessToken };

        await storage.setTokens(newTokens);
        setAuthToken(newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken); 

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        console.error('Token refresh failed:', refreshError);
        await storage.clearTokens();
        clearAuthToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
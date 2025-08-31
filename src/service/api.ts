/**
 * @fileoverview API service configuration and HTTP client setup
 * 
 * This file provides the core HTTP client configuration for the Movie Review App:
 * - Axios instance with base URL and default headers
 * - Authentication token management
 * - Automatic token refresh interceptor
 * - Request/response interceptors for error handling
 * 
 * Handles JWT token authentication and automatic refresh when tokens expire.
 */

import axios from 'axios';
import * as storage from '../utils/storage';
import { Tokens } from '../types';

/** Base URL for the backend API endpoints */
const API_BASE_URL = 'http://10.0.2.2:8000/api/';

/**
 * Axios HTTP client instance configured for the Movie Review App
 * 
 * Includes base URL, default headers, and interceptors for authentication
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sets the authorization header for authenticated API requests
 * 
 * @param {string} token - JWT access token for authentication
 */
export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Removes the authorization header from API requests
 * Used during logout or when clearing authentication state
 */
export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

// --- Axios Interceptor for Token Refresh ---

/** Flag to prevent multiple simultaneous token refresh attempts */
let isRefreshing = false;

/** Queue of failed requests waiting for token refresh */
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

/**
 * Processes the queue of failed requests after token refresh
 * 
 * @param {any} error - Error from token refresh attempt, if any
 * @param {string|null} token - New access token if refresh was successful
 */
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

/**
 * Response interceptor for automatic token refresh
 * 
 * Intercepts 401 (Unauthorized) responses and attempts to refresh the access token.
 * Queues failed requests and retries them with the new token upon successful refresh.
 * Handles token refresh failures by clearing stored tokens and rejecting requests.
 */
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
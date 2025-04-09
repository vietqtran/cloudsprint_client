/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';

const instance = axios.create({
  timeout: 300000,
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up') {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      window.location.href = '/sign-in';
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return instance(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await instance.post(
        '/auth/refresh',
        {
          sessionId: localStorage.getItem('session_id'),
        },
        { withCredentials: true }
      );

      if (data.status === 'success') {
        processQueue(null);
        isRefreshing = false;
        return instance(originalRequest);
      } else {
        processQueue(new Error('Refresh token failed'));
        isRefreshing = false;

        if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/sign-up') {
          window.location.href = '/sign-in';
        }
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError);
      isRefreshing = false;

      if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/sign-up') {
        window.location.href = '/sign-in';
      }
      return Promise.reject(refreshError);
    }
  }
);

instance.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;

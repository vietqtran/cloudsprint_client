/* eslint-disable @typescript-eslint/no-unused-vars */

import axios from 'axios';

let isRetried = false;

const instance = axios.create({
  timeout: 300000,
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.defaults.withCredentials = true;

export const refreshAccessTokenFn = async () => {
  const response = await instance.post('/auth/refresh');
  return response;
};

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !isRetried &&
      window.location.pathname !== '/sign-in' &&
      window.location.pathname !== '/sign-up'
    ) {
      isRetried = true;
      try {
        const refreshSuccess = await instance.post('/auth/refresh', {}, { withCredentials: true });
        if (refreshSuccess.data.status && refreshSuccess.data.statusCode === 200) {
          isRetried = false;
        } else if (
          window.location.pathname !== '/sign-in' &&
          window.location.pathname !== '/sign-up'
        ) {
          window.location.href = '/sign-in';
          return;
        }
        return instance(originalConfig);
      } catch (_refreshError) {
        if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/sign-up') {
          window.location.href = '/sign-in';
          return;
        }
        return Promise.reject(error);
      }
    }
    isRetried = false;
    return Promise.reject(error);
  }
);

export default instance;

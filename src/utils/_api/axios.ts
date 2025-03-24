import axios from 'axios';

let isRetried = false;

const instance = axios.create({
  timeout: 300000,
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.defaults.withCredentials = true;

export const refreshAccessTokenFn = async () => {
  const response = await instance.post('/refresh');
  return response.data;
};

export interface SuccessResponse {
  success: true;
  data: object | null;
  message: string;
  timestamp: Date;
  path: string;
  statusCode: number;
  error: null;
}

export interface ErrorResponse {
  success: false;
  data: null;
  message: string;
  timestamp: Date;
  path: string;
  statusCode: number;
  error: {
    message: string;
    stack: string;
  };
}

instance.interceptors.response.use(
  (response) => {
    response.data = response.data as SuccessResponse;
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
        const refreshSuccess = await instance.post('/refresh', {}, { withCredentials: true });
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
      } catch (refreshError: unknown) {
        if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/sign-up') {
          window.location.href = '/sign-in';
          return;
        }
        return Promise.reject(error ?? refreshError);
      }
    }
    isRetried = false;
    return Promise.reject(error);
  }
);

export default instance;

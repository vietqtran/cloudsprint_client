import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    _skipAuthRefresh?: boolean;
    _retry?: boolean;
  }
}

interface QueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

const instance: AxiosInstance = axios.create({
  timeout: 300000,
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];
const authPages = ['/sign-in', '/sign-up', '/otp/verify', '/forgot', '/reset'];

const processQueue = (error: any | null, token: unknown = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const isAuthPage = (): boolean => {
  return authPages.some(
    (path) => window.location.pathname === path || window.location.pathname.startsWith(path + '/')
  );
};

const redirectToSignIn = (): void => {
  if (!isAuthPage()) {
    window.location.replace('/sign-in');
  }
};

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (!error.config || !error.response) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (originalRequest._skipAuthRefresh || error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (isAuthPage()) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      localStorage.removeItem('persist:root');
      redirectToSignIn();
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
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
        {
          sessionId: localStorage.getItem('session_id'),
        },
        {
          withCredentials: true,
          _skipAuthRefresh: true,
        }
      );

      if (data && data.status === 'success') {
        processQueue(null);
        isRefreshing = false;
        return instance(originalRequest);
      } else {
        processQueue(new Error('Refresh token failed'));
        isRefreshing = false;
        localStorage.removeItem('persist:root');
        redirectToSignIn();
        return Promise.reject(error);
      }
    } catch (refreshError) {
      processQueue(refreshError);
      isRefreshing = false;

      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth] Refresh token failed:', refreshError);
      }
      localStorage.removeItem('persist:root');
      redirectToSignIn();
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

'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import instance from '@/utils/_api/axios';
import { useCallback } from 'react';

export function useAuth() {
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: userError,
    refetch: refetchUserQuery,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await instance.get('/auth/me', {
        withCredentials: true,
      });
      return data;
    },
    enabled: false,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const refetchUser = useCallback(async () => {
    const result = await refetchUserQuery();
    return result;
  }, [refetchUserQuery]);

  const signIn = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await instance.post('/auth/sign-in', credentials);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return data;
    },
  });

  const signUp = useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const { data } = await instance.post('/auth/sign-up', credentials);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return data;
    },
  });

  const sendOtp = useMutation({
    mutationFn: async (email: string) => {
      const { data } = await instance.post('/auth/verify-email/send-otp', { email });
      return data;
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const { data: response } = await instance.post('/auth/verify-email/verify', data);
      return response;
    },
  });

  const isAuthenticated = Boolean(user);

  return {
    user,
    isAuthenticated,
    isLoadingUser,
    isErrorUser,
    userError,
    signIn,
    signUp,
    sendOtp,
    verifyOtp,
    refetchUser,
  };
}

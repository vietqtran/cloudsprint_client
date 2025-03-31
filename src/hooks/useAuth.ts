import { useMutation, useQuery } from '@tanstack/react-query';

import instance from '@/utils/axios';

export function useAuth() {
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: userError,
    refetch: refetchUser,
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
  });

  const signIn = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await instance.post('/auth/sign-in', credentials);
      return data;
    },
    onSuccess: () => {
      refetchUser();
    },
  });

  const signUp = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await instance.post('/auth/sign-up', credentials);
      return data;
    },
  });

  const isAuthenticated = Boolean(user);

  return {
    user: user,
    isAuthenticated,
    isLoadingUser,
    isErrorUser,
    userError,
    signIn,
    signUp,
    refetchUser,
  };
}

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import instance from "@/utils/_api/axios";
import { setUser } from "@/store/slices/auth-slice";
import { useAppDispatch } from "./useStore";
import { useCallback } from "react";

export function useAuth() {
  const dispatch = useAppDispatch();

  const {
    refetch: refetchUserQuery,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await instance.get("/auth/me", {
        withCredentials: true,
      });
      if (data.status === "success") {
        dispatch(setUser(data.data));
      }
      return data;
    },
    enabled: false,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const refetchUser = useCallback(async () => {
    try {
      const result = await refetchUserQuery();
      return result;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  }, [refetchUserQuery]);

  const signIn = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await instance.post("/auth/sign-in", credentials);
      dispatch(setUser(data.data.user));
      localStorage.setItem("session_id", data.data.session_id);
      return data;
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const { data } = await instance.post("/auth/sign-out");
      return data;
    },
    onSuccess: () => {
      localStorage.removeItem("session_id");
      dispatch(setUser(null));
    },
  });

  const signUp = useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const { data } = await instance.post("/auth/sign-up", credentials);
      return data;
    },
  });

  const sendOtp = useMutation({
    mutationFn: async (email: string) => {
      const { data } = await instance.post("/auth/verify-email/send-otp", {
        email,
      });
      return data;
    },
  });

  const verifyOtp = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const { data: response } = await instance.post(
        "/auth/verify-email/verify",
        data
      );
      dispatch(setUser(response.data.user));
      localStorage.setItem("session_id", response.data.session_id);
      return response;
    }
  });

  const googleAuth = useCallback(() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/auth`;
  }, []);

  const handleAuthCallback = useCallback(async (params: URLSearchParams) => {
    const accessToken = params.get('access_token');
    const sessionId = params.get('session_id');
    
    if (accessToken && sessionId) {
      try {
        const { data } = await instance.get("/auth/me", {
          withCredentials: true,
        });
        
        if (data.status === "success") {
          dispatch(setUser(data.data));
          localStorage.setItem("session_id", sessionId);
          return true;
        }
      } catch (error) {
        console.error("Failed to fetch user after OAuth:", error);
      }
    }
    return false;
  }, [dispatch]);

  return {
    signIn,
    signUp,
    signOut,
    sendOtp,
    verifyOtp,
    refetchUser,
    googleAuth,
    handleAuthCallback,
  };
}

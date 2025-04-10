'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks';

type Props = {
  children: React.ReactNode;
  isAuthPage?: boolean;
};

const authPages = ['/sign-in', '/sign-up', '/otp/success', '/otp/verify', '/forgot', '/reset'];

const AuthProvider = ({ children, isAuthPage = false }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, refetchUser, isLoadingUser } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isAuthRelatedPage = authPages.includes(pathName);

    const checkAuth = async () => {
      try {
        await refetchUser();
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsChecking(false);
      }
    };

    if (isAuthRelatedPage) {
      setIsChecking(false);
    } else {
      checkAuth();
    }
  }, [pathName, refetchUser]);

  useEffect(() => {
    if (!isChecking && !isLoadingUser) {
      if (isAuthPage && isAuthenticated) {
        router.replace('/');
        return;
      }

      if (!isAuthenticated && !isAuthPage) {
        router.replace('/sign-in');
      }
    }
  }, [isChecking, isLoadingUser, isAuthenticated, isAuthPage, router]);

  if (isChecking || isLoadingUser) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <LoadingSpinner color='black' />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;

'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import LoadingSpinner from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks';

type Props = {
  children: React.ReactNode;
  isAuthPage?: boolean;
};

const AuthProvider = ({ children, isAuthPage = false }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, refetchUser, isLoadingUser } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isAuthRelatedPage = pathName === '/sign-in' || pathName === '/sign-up';

    const checkAuth = async () => {
      try {
        if (!isAuthRelatedPage) {
          await refetchUser();
        }
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

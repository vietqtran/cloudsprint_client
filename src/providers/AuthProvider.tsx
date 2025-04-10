'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector, useAuth } from '@/hooks';
import { usePathname, useRouter } from 'next/navigation';

import LoadingSpinner from '@/components/ui/loading-spinner';

type Props = {
  children: React.ReactNode;
  isAuthPage?: boolean;
};

const AuthProvider = ({ children, isAuthPage = false }: Props) => {
  const {refetchUser} = useAuth();
  const {user} = useAppSelector((state) => state.auth);
  const {replace} = useRouter()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    const checkAuth = async () => { 
      if (isAuthPage) {
        if (user) {
          replace('/');
        } else {
          setIsLoading(false);
        }
      } else {
        await refetchUser();
        if (user) {
          setIsLoading(false);
        } else {
          replace('/sign-in');
        }
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <LoadingSpinner color='black' />
      </div>
    );
  } else {
    return <>{children}</>;
  };
}

export default AuthProvider;

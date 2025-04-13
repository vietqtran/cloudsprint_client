import { Header } from '@/components/common/layout/Header';
import { AppSidebar } from '@/components/common/layout/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import AuthProvider from '@/providers/AuthProvider';
import React from 'react';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AuthProvider>
        <div className='size-full'>
          <Header />
          {children}
        </div>
      </AuthProvider>
    </SidebarProvider>
  );
};

export default RootLayout;

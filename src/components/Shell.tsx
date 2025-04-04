
import React, { ReactNode } from 'react';
import MainLayout from '@/components/layouts/MainLayout';

interface ShellProps {
  children: ReactNode;
  className?: string;
}

export const Shell = ({ children, className = '' }: ShellProps) => {
  return (
    <MainLayout className={className}>
      <div className="container mx-auto py-8">
        {children}
      </div>
    </MainLayout>
  );
};

export default Shell;

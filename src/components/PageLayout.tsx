
import { ReactNode } from 'react';
import MainLayout from '@/components/layouts/MainLayout';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <MainLayout className={className}>
      {children}
    </MainLayout>
  );
};

export default PageLayout;

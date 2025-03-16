
import { ReactNode } from 'react';
import MainLayout from '@/components/layouts/MainLayout';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <MainLayout className={className}>
      <div className="px-4 sm:px-6 md:px-8">
        {children}
      </div>
    </MainLayout>
  );
};

export default PageLayout;

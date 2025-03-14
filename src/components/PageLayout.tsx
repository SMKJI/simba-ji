
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className={`flex-1 pt-24 pb-16 ${className}`}>
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;


import { ReactNode, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  // Add smooth scrolling to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className={`flex-grow w-full pt-24 ${className}`}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;

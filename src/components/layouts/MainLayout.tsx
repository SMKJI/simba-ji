
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRegistrations } from '@/hooks/useRegistrations';

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

const MainLayout = ({ children, className = '' }: MainLayoutProps) => {
  const location = useLocation();
  const { authenticated } = useRegistrations();
  
  // Determine if we should show the header based on route
  const isPublicPage = ['/', '/about', '/programs', '/faq', '/login', '/register', '/success'].includes(location.pathname);
  const showHeader = isPublicPage || !authenticated;

  // Add smooth scrolling to top on page load
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeader && <Header />}
      
      <main className={`flex-grow w-full ${showHeader ? 'pt-24' : 'pt-0'} ${className}`}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;

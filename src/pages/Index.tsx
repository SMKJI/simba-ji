
import { useEffect } from 'react';
import { useRegistrations } from '@/hooks/useRegistrations';
import Dashboard from '@/components/Dashboard';
import PageLayout from '@/components/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';

const Index = () => {
  const { stats, loading } = useRegistrations();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <PageLayout className="p-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Dashboard Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Status Pendaftaran
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pantau jumlah pendaftar dan ketersediaan grup WhatsApp secara real-time
            </p>
          </div>
          
          <Dashboard stats={stats} loading={loading} />
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />
    </PageLayout>
  );
};

export default Index;

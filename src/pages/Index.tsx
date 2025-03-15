
import PageLayout from '@/components/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import CounterSection from '@/components/home/CounterSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/home/ContactSection';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useEffect } from 'react';

const Index = () => {
  const { authenticated } = useRegistrations();
  
  useEffect(() => {
    // Smooth scroll to top on page load
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <PageLayout>
      <div className="page-transition">
        <HeroSection />
        <CounterSection />
        <FeatureSection />
        <FAQSection />
        <ContactSection />
      </div>
    </PageLayout>
  );
};

export default Index;

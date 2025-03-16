
import { useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import CounterSection from '@/components/home/CounterSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/home/ContactSection';

const Index = () => {
  useEffect(() => {
    // Smooth scroll to top on page load
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <MainLayout>
      <div className="page-transition">
        <HeroSection />
        <CounterSection />
        <FeatureSection />
        <FAQSection />
        <ContactSection />
      </div>
    </MainLayout>
  );
};

export default Index;

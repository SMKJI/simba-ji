
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import CounterSection from '@/components/home/CounterSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/home/ContactSection';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <PageLayout>
      <HeroSection />
      <CounterSection />
      <FeatureSection />
      <FAQSection />
      <ContactSection />
    </PageLayout>
  );
};

export default Index;

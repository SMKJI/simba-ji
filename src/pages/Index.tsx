
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import CounterSection from '@/components/home/CounterSection';
import ContactSection from '@/components/home/ContactSection';
import ContentDisplay from '@/components/content/ContentDisplay';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-12">
        <ContentDisplay slug="home" className="mx-auto max-w-3xl mb-16" />
      </div>
      
      <FeatureSection />
      <CounterSection />
      <ContactSection />
    </MainLayout>
  );
};

export default Index;

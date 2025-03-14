
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import HeroSection from '@/components/home/HeroSection';
import FeatureSection from '@/components/home/FeatureSection';
import FAQSection from '@/components/FAQSection';
import DemoAccounts from '@/components/DemoAccounts';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigateToLogin = (email: string) => {
    navigate('/login', { state: { prefilledEmail: email } });
  };

  return (
    <PageLayout>
      <HeroSection />
      
      <div className="mx-auto max-w-4xl px-4 py-8">
        <DemoAccounts onSelectAccount={navigateToLogin} />
      </div>
      
      <FeatureSection />
      <FAQSection />
    </PageLayout>
  );
};

export default Index;


import MainLayout from '@/components/layouts/MainLayout';
import ContentDisplay from '@/components/content/ContentDisplay';
import FAQSection from '@/components/FAQSection';

const FAQ = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <ContentDisplay slug="faq" className="mx-auto max-w-3xl mb-8" />
        <FAQSection />
      </div>
    </MainLayout>
  );
};

export default FAQ;

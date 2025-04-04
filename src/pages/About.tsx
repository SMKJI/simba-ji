
import MainLayout from '@/components/layouts/MainLayout';
import ContentDisplay from '@/components/content/ContentDisplay';

const About = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <ContentDisplay slug="about" className="mx-auto max-w-3xl" />
      </div>
    </MainLayout>
  );
};

export default About;

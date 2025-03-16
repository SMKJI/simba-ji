
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import ProgramCard from '@/components/programs/ProgramCard';
import { programs } from '@/data/programData';

const Programs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <PageTitle 
            title="Program Keahlian"
            description="SMKN 1 Kendal menawarkan berbagai program keahlian berkualitas untuk menyiapkan siswa menghadapi dunia kerja dan industri"
            className="max-w-3xl mx-auto"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {programs.map((program) => (
            <ProgramCard 
              key={program.id} 
              program={program}
            />
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Masih punya pertanyaan tentang program keahlian kami?
          </p>
          <Button asChild variant="outline">
            <Link to="/faq">
              Lihat FAQ
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Programs;

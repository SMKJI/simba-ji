
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 sm:mb-10">
          <PageTitle 
            title="Program Keahlian"
            description="SMKN 1 Kendal menawarkan berbagai program keahlian berkualitas untuk menyiapkan siswa menghadapi dunia kerja dan industri"
            className="max-w-3xl mx-auto px-4"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {programs.map((program) => (
            <ProgramCard 
              key={program.id} 
              program={program}
            />
          ))}
        </div>
        
        <div className="text-center pb-8">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Masih punya pertanyaan tentang program keahlian kami?
          </p>
          <Button asChild variant="outline" className="text-xs sm:text-sm">
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


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import ProgramCard from '@/components/programs/ProgramCard';
import { programData } from '@/data/programData';

const Programs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRegisterClick = () => {
    toast({
      title: "Mengarahkan ke pendaftaran",
      description: "Anda akan diarahkan ke halaman pendaftaran",
    });
    
    // Delay navigation to allow toast to be seen
    setTimeout(() => {
      navigate('/register');
    }, 500);
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Program Keahlian
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            SMKN 1 Kendal menawarkan berbagai program keahlian yang dirancang untuk mempersiapkan siswa menghadapi dunia kerja dan industri
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {programData.map((program, index) => (
            <ProgramCard 
              key={index} 
              program={program} 
              onRegisterClick={handleRegisterClick}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Programs;

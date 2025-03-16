
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import RegisterForm from '@/components/RegisterForm';
import PageTitle from '@/components/ui/PageTitle';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // This function will be passed to RegisterForm component
  const handleRegistrationSuccess = () => {
    toast({
      title: "Pendaftaran Berhasil",
      description: "Anda akan diarahkan ke halaman sukses.",
    });
    
    // Delay navigation to allow toast to be seen
    setTimeout(() => {
      navigate('/success');
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-10 px-4">
        <PageTitle 
          title="Pendaftaran Calon Murid Baru"
          description="Isi formulir di bawah ini dengan data yang benar dan lengkap. Setelah mendaftar, Anda akan diarahkan ke grup WhatsApp sesuai urutan pendaftaran."
        />
      </div>
      
      <div className="px-4 sm:px-6 md:px-0">
        <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
      </div>
    </MainLayout>
  );
};

export default Register;

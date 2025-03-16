
import { useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import RegisterForm from '@/components/RegisterForm';
import PageTitle from '@/components/ui/PageTitle';

const Register = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-10 px-4">
        <PageTitle 
          title="Pendaftaran Calon Murid Baru"
          description="Isi formulir di bawah ini dengan data yang benar dan lengkap. Setelah mendaftar, Anda akan diarahkan ke grup WhatsApp sesuai urutan pendaftaran."
        />
      </div>
      
      <div className="px-4 sm:px-6 md:px-0">
        <RegisterForm />
      </div>
    </MainLayout>
  );
};

export default Register;

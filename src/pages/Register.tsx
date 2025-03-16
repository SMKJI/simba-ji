
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
      <div className="max-w-3xl mx-auto text-center mb-10">
        <PageTitle 
          title="Pendaftaran Calon Murid Baru"
          description="Isi formulir di bawah ini dengan data yang benar dan lengkap. Setelah mendaftar, Anda akan diarahkan ke grup WhatsApp sesuai urutan pendaftaran."
        />
      </div>
      
      <RegisterForm />
    </MainLayout>
  );
};

export default Register;

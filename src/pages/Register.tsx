
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import RegisterForm from '@/components/RegisterForm';

const Register = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pendaftaran Calon Murid Baru
        </h1>
        <p className="text-gray-600">
          Isi formulir di bawah ini dengan data yang benar dan lengkap. Setelah mendaftar, Anda akan diarahkan ke grup WhatsApp sesuai urutan pendaftaran.
        </p>
      </div>
      
      <RegisterForm />
    </PageLayout>
  );
};

export default Register;


import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/RegisterForm';

const Register = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pendaftaran Calon Murid Baru
            </h1>
            <p className="text-gray-600">
              Isi formulir di bawah ini dengan data yang benar dan lengkap. Setelah mendaftar, Anda akan diarahkan ke grup WhatsApp sesuai urutan pendaftaran.
            </p>
          </div>
          
          <RegisterForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;

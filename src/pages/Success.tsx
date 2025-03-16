
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layouts/MainLayout';
import RegistrationCard, { RegistrationResult } from '@/components/success/RegistrationCard';

// Extend RegistrationResult to include login credentials
interface RegistrationResultWithCredentials extends RegistrationResult {
  email?: string;
  password?: string;
}

const Success = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState<RegistrationResultWithCredentials | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get registration data from sessionStorage
    const savedData = sessionStorage.getItem('registrationResult');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setRegistrationData(parsedData);
      } catch (e) {
        console.error('Error parsing registration data:', e);
        // If there's no valid data, redirect to home
        setTimeout(() => navigate('/'), 3000);
      }
    } else {
      // If there's no data, redirect to home
      toast({
        title: 'Tidak ada data pendaftaran',
        description: 'Anda akan diarahkan ke halaman utama',
        variant: 'destructive',
      });
      setTimeout(() => navigate('/'), 3000);
    }
  }, [navigate, toast]);

  // Handler to navigate to login with pre-filled email
  const handleGoToLogin = () => {
    if (registrationData?.email) {
      navigate('/login', { state: { email: registrationData.email } });
    } else {
      navigate('/login');
    }
  };

  if (!registrationData) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center p-8">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4 animate-fade-in">
            <Check className="h-6 sm:h-8 w-6 sm:w-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 animate-fade-in stagger-1">
            Pendaftaran Berhasil!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 animate-fade-in stagger-2">
            Selamat! Anda telah berhasil mendaftar sebagai calon murid baru SMKN 1 Kendal.
          </p>
        </div>
        
        <RegistrationCard data={registrationData} />
        
        {registrationData.email && (
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 sm:p-6 mt-6 sm:mt-8 animate-fade-in stagger-3">
            <h2 className="text-lg sm:text-xl font-bold text-primary mb-2 sm:mb-3">Akun Anda Telah Dibuat</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              Akun Anda telah berhasil dibuat. Silakan login menggunakan email dan password yang Anda daftarkan untuk melanjutkan ke dashboard calon murid.
            </p>
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 mb-4 sm:mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Email:</p>
                  <p className="text-sm sm:text-base font-medium">{registrationData.email}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Password:</p>
                  <p className="text-sm sm:text-base font-medium">Password yang Anda masukkan saat pendaftaran</p>
                </div>
              </div>
            </div>
            <Button onClick={handleGoToLogin} className="w-full text-sm sm:text-base">
              <LogIn className="mr-2 h-4 w-4" /> 
              Login ke Dashboard
            </Button>
          </div>
        )}
        
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pb-4 sm:pb-0">
          <Button variant="ghost" asChild className="text-sm sm:text-base">
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Success;


import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import RegistrationCard, { RegistrationResult } from '@/components/success/RegistrationCard';

const Success = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState<RegistrationResult | null>(null);

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

  if (!registrationData) {
    return (
      <PageLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center p-8">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-fade-in">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in stagger-1">
            Pendaftaran Berhasil!
          </h1>
          <p className="text-gray-600 animate-fade-in stagger-2">
            Selamat! Anda telah berhasil mendaftar sebagai calon murid baru SMKN 1 Kendal.
          </p>
        </div>
        
        <RegistrationCard data={registrationData} />
        
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              Kembali ke Beranda
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/helpdesk" className="flex items-center">
              Butuh Bantuan? 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default Success;

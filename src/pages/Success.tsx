
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface RegistrationResult {
  registrationId: number;
  assignedGroup: string;
  groupLink: string;
  timestamp: string;
}

const Success = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState<RegistrationResult | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true);
        toast({
          title: 'Tersalin ke clipboard',
          description: 'Link grup WhatsApp telah disalin',
        });
        
        setTimeout(() => setCopySuccess(false), 2000);
      },
      () => {
        toast({
          title: 'Gagal menyalin',
          description: 'Tidak dapat menyalin link. Silakan coba lagi.',
          variant: 'destructive',
        });
      }
    );
  };

  // Format date in Indonesian locale
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center p-8">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
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
            
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden animate-scale-in">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-primary/70 uppercase tracking-wide mb-1">
                      Nomor Pendaftaran
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      {registrationData.registrationId}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Waktu Pendaftaran
                    </h3>
                    <p className="font-medium">
                      {formatDate(registrationData.timestamp)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Grup WhatsApp yang Ditugaskan
                    </h3>
                    <p className="font-medium text-secondary">
                      {registrationData.assignedGroup}
                    </p>
                  </div>
                  
                  <div className="bg-accent/10 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-accent-foreground/70 uppercase tracking-wide mb-2">
                      Link Grup WhatsApp
                    </h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={registrationData.groupLink}
                        readOnly
                        className="flex-1 p-2 border rounded bg-white text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(registrationData.groupLink)}
                        className={copySuccess ? "bg-green-100 text-green-600" : ""}
                      >
                        {copySuccess ? (
                          <>
                            <Check className="h-4 w-4 mr-1" /> Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" /> Salin
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open(registrationData.groupLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Gabung Grup WhatsApp Sekarang
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500">
                    <p>
                      Silakan gabung dengan grup WhatsApp yang telah ditentukan untuk mendapatkan informasi lebih lanjut
                      mengenai proses penerimaan murid baru.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Success;

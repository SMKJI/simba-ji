
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import StudentRegistrationForm from '@/components/registration/StudentRegistrationForm';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  
  const handleRegistrationSuccess = () => {
    setSuccess(true);
    
    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };
  
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-green-50 border-b p-6">
              <CardTitle className="text-xl font-semibold text-green-700 flex items-center">
                <CheckCircle2 className="h-6 w-6 mr-2 text-green-600" />
                Pendaftaran Berhasil
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <p>
                  Selamat! Akun Anda telah berhasil dibuat. Silakan periksa email Anda untuk konfirmasi.
                </p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Masuk Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/f5ba977f-fb10-430c-b426-68c3389cee2c.png" 
            alt="SMKN 1 Kendal" 
            className="mx-auto h-16 w-auto"
          />
          <h1 className="mt-4 text-3xl font-bold">SMKN 1 Kendal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Pendaftaran Akun PPDB
          </p>
        </div>
        
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-6">
            <CardTitle className="text-xl font-semibold text-primary">
              Daftar Akun
            </CardTitle>
            <CardDescription>
              Buat akun baru untuk mengakses sistem PPDB
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <StudentRegistrationForm onSuccess={handleRegistrationSuccess} />
            
            <div className="text-center text-sm pt-4">
              <p className="text-gray-600">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500">
          <p>
            Dengan mendaftar, Anda menyetujui syarat dan ketentuan pendaftaran SMKN 1 Kendal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

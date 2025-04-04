
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';

import LoginForm from '@/components/LoginForm';

const Login = () => {
  const { authenticated } = useRegistrations();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  if (authenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          to="/"
          className="absolute left-4 top-4 flex items-center text-sm font-medium text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali ke Beranda
        </Link>
        
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="/favicon.ico" alt="Logo SMKN 1 Kendal" className="h-8 w-8 mr-2" />
            SMKN 1 Kendal
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Sistem Penerimaan Murid Baru yang kami kembangkan untuk memudahkan proses pendaftaran bagi calon siswa SMKN 1 Kendal."
              </p>
              <footer className="text-sm">Tim Pengembang PMB</footer>
            </blockquote>
          </div>
        </div>
        
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-4 py-8">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Masuk ke Akun Anda
            </h1>
            <p className="text-sm text-muted-foreground">
              Masukkan email dan password untuk masuk ke akun Anda
            </p>
          </div>
          
          <LoginForm />
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            Belum memiliki akun?{" "}
            <Link
              to="/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

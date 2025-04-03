
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, School, EyeIcon, EyeOffIcon, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, loading } = useRegistrations();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Semua kolom harus diisi');
      setIsSubmitting(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Kata sandi dan konfirmasi kata sandi tidak sama');
      setIsSubmitting(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Kata sandi harus memiliki minimal 6 karakter');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const result = await register(email, password, name);
      
      if (result.success) {
        setSuccess(true);
        toast({
          title: 'Pendaftaran Berhasil',
          description: 'Akun Anda telah dibuat. Silakan periksa email Anda untuk konfirmasi.',
        });
        
        // If user is automatically logged in, redirect after 3 seconds
        if (result.user) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      } else {
        setError(result.error || 'Pendaftaran gagal. Silakan coba lagi.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
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
          <School className="mx-auto h-12 w-12 text-primary" />
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
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Nama Lengkap
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  Konfirmasi Kata Sandi
                </label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ulangi kata sandi Anda"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  'Daftar'
                )}
              </Button>
              
              <div className="text-center text-sm pt-2">
                <p className="text-gray-600">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Masuk
                  </Link>
                </p>
              </div>
            </form>
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

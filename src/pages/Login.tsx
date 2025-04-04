
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, EyeIcon, EyeOffIcon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, loading: authLoading } = useRegistrations();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get redirect path from location state
  const from = location.state?.from || '/dashboard';
  
  // Validate form
  const isFormValid = () => {
    return email.trim() !== '' && password.trim() !== '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isFormValid()) {
      setError('Email dan kata sandi harus diisi');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang kembali, ${result.user?.name || 'Pengguna'}!`
        });
        navigate(from);
      } else {
        if (result.error?.includes('Profil pengguna tidak ditemukan')) {
          setError('Profil pengguna tidak ditemukan. Silakan daftar terlebih dahulu atau hubungi administrator.');
        } else {
          setError(result.error || 'Login gagal. Periksa email dan kata sandi Anda.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/lovable-uploads/f5ba977f-fb10-430c-b426-68c3389cee2c.png" alt="SMKN 1 Kendal" className="mx-auto h-16 w-auto" />
          <h1 className="mt-4 text-3xl font-bold">SMKN 1 Kendal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sistem Penjaringan Calon Murid Baru
          </p>
        </div>
        
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-6">
            <CardTitle className="text-xl font-semibold text-primary">
              Masuk
            </CardTitle>
            <CardDescription>Masuk ke akun Anda untuk akses sistem PMB</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  disabled={isSubmitting || authLoading}
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
                    placeholder="Kata sandi Anda" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required
                    disabled={isSubmitting || authLoading}
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={toggleShowPassword}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || authLoading || !isFormValid()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Masuk...
                  </>
                ) : 'Masuk'}
              </Button>
              
              <div className="text-center text-sm pt-2">
                <p className="text-gray-600">
                  Belum punya akun?{' '}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Daftar Sekarang
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} SMKN 1 Kendal
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

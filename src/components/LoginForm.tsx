
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegistrations } from '@/hooks/useRegistrations';
import { DEMO_ACCOUNTS } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Info,
  UserCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter')
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: (role: string) => void }) => {
  const { login, DEMO_ACCOUNTS } = useRegistrations();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login(values.email, values.password);
      
      if (result.success && result.user) {
        toast({
          title: "Login berhasil",
          description: `Selamat datang ${result.user.name || result.user.email}`,
        });
        
        onLoginSuccess(result.user.role);
      } else {
        setError(result.error || 'Login gagal, periksa email dan password Anda');
        toast({
          title: "Login gagal",
          description: result.error || "Periksa email dan password Anda",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Terjadi kesalahan saat login');
      toast({
        title: "Terjadi kesalahan",
        description: err.message || "Tidak dapat memproses login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = form.getValues('email');
    
    if (!email) {
      toast({
        title: "Email diperlukan",
        description: "Masukkan email Anda untuk reset password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Email reset password terkirim",
        description: "Silakan periksa email Anda untuk instruksi reset password",
      });
    } catch (error: any) {
      toast({
        title: "Gagal mengirim reset password",
        description: error.message || "Terjadi kesalahan saat mengirim email reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccountClick = (email: string, role: string) => {
    form.setValue('email', email);
    form.setValue('password', 'password123'); // Demo password
    toast({
      title: `Akun ${role}`,
      description: "Detail akun telah diisi. Klik Login untuk masuk.",
    });
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-semibold">Masuk</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
          >
            Kembali ke Beranda
          </Button>
        </div>
        <p className="text-muted-foreground">
          Masukkan email dan password Anda untuk masuk ke dalam sistem
        </p>
      </CardHeader>
      
      <CardContent className="p-6 pt-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="nama@email.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                className="px-0 text-sm"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Lupa Password?
              </Button>
              
              <Button 
                type="button"
                variant="link" 
                size="sm"
                className="px-0 text-sm"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              >
                <UserCheck className="h-4 w-4 mr-1" />
                {showDemoAccounts ? 'Sembunyikan Akun Demo' : 'Lihat Akun Demo'}
              </Button>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Belum punya akun?{' '}
                <Button variant="link" className="p-0" onClick={() => navigate('/register')}>
                  Daftar Sekarang
                </Button>
              </p>
            </div>
          </form>
        </Form>
        
        {showDemoAccounts && (
          <div className="mt-6 border rounded-md p-4">
            <div className="flex items-center mb-3 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-2" />
              <span>Klik pada akun untuk mengisi formulir</span>
            </div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <Button
                  key={account.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleDemoAccountClick(account.email, account.role)}
                >
                  <div className="flex flex-col items-start">
                    <span>{account.name}</span>
                    <span className="text-xs text-muted-foreground">{account.email} ({account.role})</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginForm;

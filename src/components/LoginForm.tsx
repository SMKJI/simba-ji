
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, EyeIcon, EyeOffIcon, UserCheck, ChevronLeft } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from '@/integrations/supabase/client';
import DemoAccounts from './DemoAccounts';

const formSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  prefilledEmail?: string;
  onLoginSuccess?: (role: string) => void;
}

const LoginForm = ({ prefilledEmail, onLoginSuccess }: LoginFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useRegistrations();
  const emailFromState = location.state?.email || prefilledEmail || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: emailFromState,
      password: '',
    },
  });

  useEffect(() => {
    console.log("LoginForm mounted. Email from state:", emailFromState);
  }, [emailFromState]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      console.log("Attempting login with:", data.email);
      
      // Try regular login through the login function from context
      const result = await login(data.email, data.password);
      
      if (result.success && result.user) {
        console.log("Login successful:", result.user);
        
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang, ${result.user?.name}`,
        });
        
        // Handle redirect based on role
        if (onLoginSuccess && result.user?.role) {
          onLoginSuccess(result.user.role);
        } else if (result.user?.role) {
          handleRoleBasedRedirect(result.user.role);
        }
      } else {
        console.error("Login failed:", result.error);
        setLoginError(result.error || 'Email atau password salah');
        toast({
          title: 'Login Gagal',
          description: result.error || 'Email atau password salah',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error("Login exception:", error);
      setLoginError(error.message || 'Terjadi kesalahan saat login');
      toast({
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat login. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleBasedRedirect = (role: string) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'helpdesk':
        navigate('/helpdesk');
        break;
      case 'helpdesk_offline':
        navigate('/offline-helpdesk');
        break;
      case 'content':
        navigate('/content');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const fillDemoAccount = (email: string) => {
    form.setValue('email', email);
    form.setValue('password', 'password123');
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg rounded-xl overflow-hidden animate-scale-in">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mr-2" asChild>
            <Link to="/">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <CardTitle className="text-2xl font-bold text-primary">Login</CardTitle>
        </div>
        <CardDescription>
          Masuk ke sistem pendaftaran SMKN 1 Kendal
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {loginError}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Masukkan email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Masukkan password" 
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Masuk
                </>
              )}
            </Button>
            
            <div className="text-center text-sm mt-4">
              <p className="text-muted-foreground">
                Belum memiliki akun?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Daftar
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="bg-muted/50 p-6 block">
        <DemoAccounts onSelectAccount={fillDemoAccount} />
      </CardFooter>
    </Card>
  );
};

export default LoginForm;


import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserCheck, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DEMO_ACCOUNTS } from '@/hooks/useRegistrations';
import { supabase } from '@/integrations/supabase/client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const emailFromState = location.state?.email || prefilledEmail || '';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: emailFromState,
      password: '',
    },
  });

  const loginWithSupabase = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed') || error.message.includes('Invalid login credentials')) {
        return tryDemoLogin(email, password);
      }
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      // We're using demo mode for now since the profiles table doesn't exist
      const demoUser = DEMO_ACCOUNTS.find(account => account.email === email);
      
      if (demoUser) {
        return { 
          success: true, 
          user: demoUser 
        };
      }
      
      // Default user info without profile data
      return { 
        success: true, 
        user: {
          id: data.user.id,
          name: data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: 'applicant',
          avatarUrl: undefined
        }
      };
    }
    
    return { success: false, error: 'Unknown error occurred' };
  };

  const tryDemoLogin = (email: string, password: string) => {
    const demoUser = DEMO_ACCOUNTS.find(u => u.email === email);
    
    if (demoUser && password === 'password123') {
      sessionStorage.setItem('currentUser', JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }
    
    return { success: false, error: 'Email atau password salah' };
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await loginWithSupabase(data.email, data.password);
      
      if (result.success) {
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang, ${result.user?.name}`,
        });
        
        if (onLoginSuccess && result.user?.role) {
          onLoginSuccess(result.user.role);
        }
        
        switch (result.user?.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'helpdesk':
            navigate('/helpdesk');
            break;
          case 'content':
            navigate('/content');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        // Fixing the type error by checking if error exists
        const errorMessage = 'error' in result ? result.error : 'Email atau password salah';
        toast({
          title: 'Login Gagal',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat login. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (email: string) => {
    form.setValue('email', email);
    form.setValue('password', 'password123');
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-lg rounded-xl overflow-hidden animate-scale-in">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-2xl font-bold text-primary">Login</CardTitle>
        <CardDescription>
          Masuk ke sistem pendaftaran SMKN 1 Kendal
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <Input type="password" placeholder="Masukkan password" {...field} />
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
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="bg-muted/50 p-6 block">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="demo-accounts">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center text-primary">
                <Info className="w-4 h-4 mr-2" />
                Akun Demo untuk Testing
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 text-sm mt-2">
                <p className="font-medium text-muted-foreground mb-2">
                  Klik pada akun untuk mengisi form otomatis (password: password123)
                </p>
                
                {DEMO_ACCOUNTS.map((account) => (
                  <div 
                    key={account.id}
                    className="p-2 border rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => fillDemoAccount(account.email)}
                  >
                    <p className="font-semibold">{account.name}</p>
                    <p className="text-xs text-muted-foreground">Email: {account.email}</p>
                    <p className="text-xs text-muted-foreground">Role: {account.role}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

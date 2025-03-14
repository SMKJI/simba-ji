
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRegistrations } from '@/hooks/useRegistrations';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useRegistrations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast({
          title: 'Login Berhasil',
          description: `Selamat datang, ${result.user?.name}`,
        });
        
        // Navigate based on user role
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
            navigate('/');
        }
      } else {
        toast({
          title: 'Login Gagal',
          description: result.error || 'Email atau password salah',
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
    </Card>
  );
};

export default LoginForm;

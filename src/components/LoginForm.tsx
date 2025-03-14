
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserCheck, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRegistrations, DEMO_ACCOUNTS } from '@/hooks/useRegistrations';

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
}

const LoginForm = ({ prefilledEmail }: LoginFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useRegistrations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: prefilledEmail || '',
      password: '',
    },
  });

  // Update form values when prefilledEmail changes
  useEffect(() => {
    if (prefilledEmail) {
      form.setValue('email', prefilledEmail);
      form.setValue('password', 'password123');
    }
  }, [prefilledEmail, form]);

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

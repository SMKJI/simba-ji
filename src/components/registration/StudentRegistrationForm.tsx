
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const studentSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(50, 'Password maksimal 50 karakter'),
  confirmPassword: z.string().min(6, 'Password minimal 6 karakter'),
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak sama',
  path: ['confirmPassword'],
});

type StudentFormValues = z.infer<typeof studentSchema>;

const StudentRegistrationForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { register } = useRegistrations();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: StudentFormValues) {
    setIsLoading(true);

    try {
      const result = await register(values.email, values.password, values.name);
      
      if (result.success) {
        toast({
          title: "Pendaftaran Berhasil",
          description: "Akun Anda telah berhasil didaftarkan",
        });
        onSuccess();
      } else {
        toast({
          title: "Pendaftaran Gagal",
          description: result.error || "Gagal mendaftarkan akun Anda",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat mendaftar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-semibold">Daftar Akun</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/')}
        >
          Kembali ke Beranda
        </Button>
      </div>
    
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="nama@email.com" {...field} />
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
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Mendaftar..." : "Daftar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StudentRegistrationForm;

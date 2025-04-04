
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRegistrations } from '@/hooks/useRegistrations';
import { supabase } from '@/integrations/supabase/client';
import { programData } from '@/data/programData';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap harus minimal 3 karakter' }),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, {
    message: 'Nomor telepon tidak valid (contoh: 08XXXXXXXXXX)',
  }),
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  confirmPassword: z.string().min(6, { message: 'Konfirmasi password minimal 6 karakter' }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Format tanggal lahir tidak valid (YYYY-MM-DD)',
  }),
  birthPlace: z.string().min(2, { message: 'Tempat lahir harus diisi' }),
  gender: z.string().min(1, { message: 'Jenis kelamin harus dipilih' }),
  address: z.string().min(5, { message: 'Alamat harus minimal 5 karakter' }),
  previousSchool: z.string().min(3, { message: 'Nama sekolah sebelumnya harus diisi' }),
  previousSchoolAddress: z.string().min(5, { message: 'Alamat sekolah sebelumnya harus diisi' }),
  parentName: z.string().min(3, { message: 'Nama orang tua harus diisi' }),
  parentPhone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, {
    message: 'Nomor telepon tidak valid (contoh: 08XXXXXXXXXX)',
  }),
  preferredProgram: z.string().min(1, { message: 'Program keahlian harus dipilih' }),
  reason: z.string().optional(),
  agreement: z.boolean().refine((val) => val === true, {
    message: 'Anda harus menyetujui syarat dan ketentuan',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface RegisterFormProps {
  onRegistrationSuccess?: () => void;
}

const RegisterForm = ({ onRegistrationSuccess }: RegisterFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { submitRegistration } = useRegistrations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      birthPlace: '',
      gender: '',
      address: '',
      previousSchool: '',
      previousSchoolAddress: '',
      parentName: '',
      parentPhone: '',
      preferredProgram: '',
      reason: '',
      agreement: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    console.log("Registration data:", data);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
          },
        }
      });
      
      if (authError) {
        console.error("Auth error:", authError);
        throw new Error(authError.message);
      }

      if (authData.user) {
        const result = await submitRegistration({
          ...data,
          userId: authData.user.id
        });
        
        if (result && result.success) {
          const registrationData = {
            ...result.data,
            email: data.email,
            password: data.password
          };
          
          sessionStorage.setItem('registrationResult', JSON.stringify(registrationData));
          
          toast({
            title: 'Pendaftaran Berhasil',
            description: 'Akun Anda telah dibuat. Silakan login untuk melanjutkan.',
          });
          
          if (onRegistrationSuccess) {
            onRegistrationSuccess();
          } else {
            navigate('/success');
          }
        }
      }
    } catch (error) {
      let errorMessage = 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Pendaftaran Gagal',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-0 shadow-lg rounded-xl overflow-hidden animate-scale-in">
      <CardHeader className="bg-primary/5 border-b p-6">
        <CardTitle className="text-2xl font-bold text-primary">Formulir Penjaringan Awal</CardTitle>
        <CardDescription>
          Isi data diri Anda dengan lengkap dan benar untuk penjaringan awal PPDB
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Data Diri Calon Siswa</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon (WhatsApp)</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 081234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Konfirmasi password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Lahir</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempat Lahir</FormLabel>
                      <FormControl>
                        <Input placeholder="Tempat lahir" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Kelamin</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Laki-laki</SelectItem>
                        <SelectItem value="female">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan alamat lengkap" 
                        className="resize-none min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-lg font-medium text-gray-900">Data Asal Sekolah</h3>
              
              <FormField
                control={form.control}
                name="previousSchool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sekolah Asal</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama sekolah asal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="previousSchoolAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Sekolah Asal</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan alamat sekolah asal" 
                        className="resize-none min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-lg font-medium text-gray-900">Data Orang Tua/Wali</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Orang Tua/Wali</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama orang tua/wali" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon Orang Tua/Wali</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 081234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-lg font-medium text-gray-900">Program Keahlian</h3>
              
              <FormField
                control={form.control}
                name="preferredProgram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program Keahlian yang Diminati</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih program keahlian" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {programData.map(program => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alasan Memilih Program Keahlian Tersebut</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Jelaskan alasan Anda memilih program keahlian tersebut" 
                        className="resize-none min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="agreement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-muted/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Saya menyetujui semua syarat dan ketentuan yang berlaku pada penjaringan awal PPDB SMKN 1 Kendal
                    </FormLabel>
                    <FormMessage />
                  </div>
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
                'Daftar Sekarang'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;

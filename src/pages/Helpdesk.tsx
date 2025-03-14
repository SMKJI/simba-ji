
import { useEffect, useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap harus minimal 3 karakter' }),
  email: z.string().email({ message: 'Format email tidak valid' }),
  subject: z.string().min(5, { message: 'Subjek harus minimal 5 karakter' }),
  message: z.string().min(10, { message: 'Pesan harus minimal 10 karakter' }),
});

type FormValues = z.infer<typeof formSchema>;

const Helpdesk = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: 'Pesan Terkirim',
        description: 'Kami akan segera menghubungi Anda melalui email yang diberikan.',
      });
      
      form.reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pusat Bantuan
            </h1>
            <p className="text-gray-600">
              Temukan jawaban atas pertanyaan Anda atau hubungi kami untuk bantuan lebih lanjut.
            </p>
          </div>
          
          <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="faq" className="text-base">Pertanyaan Umum</TabsTrigger>
              <TabsTrigger value="contact" className="text-base">Kontak Kami</TabsTrigger>
            </TabsList>
            <TabsContent value="faq" className="animate-fade-in">
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b p-6">
                  <CardTitle className="text-xl font-semibold text-primary">
                    Pertanyaan yang Sering Diajukan (FAQ)
                  </CardTitle>
                  <CardDescription>
                    Temukan jawaban atas pertanyaan yang sering diajukan mengenai proses pendaftaran
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <FAQSection />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact" className="animate-fade-in">
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b p-6">
                  <CardTitle className="text-xl font-semibold text-primary">
                    Kirim Pesan
                  </CardTitle>
                  <CardDescription>
                    Kirim pertanyaan atau laporan masalah kepada tim kami
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Masukkan email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subjek</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan subjek pesan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pesan</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tulis pesan Anda di sini..." 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90 min-w-[150px]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <MessageSquare className="mr-2 h-4 w-4 animate-spin" />
                              Mengirim...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Kirim Pesan
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="max-w-4xl mx-auto mt-12 p-6 bg-accent/10 rounded-xl text-center">
            <h3 className="text-lg font-semibold mb-2">Butuh bantuan segera?</h3>
            <p className="text-gray-600 mb-4">
              Hubungi kami melalui WhatsApp atau telepon selama jam kerja (08:00 - 16:00 WIB)
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" className="bg-white">
                <a 
                  href="https://wa.me/6281234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-green-500">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                  WhatsApp (0812-3456-7890)
                </a>
              </Button>
              
              <Button variant="outline" className="bg-white">
                <a 
                  href="tel:+6294381137" 
                  className="flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                  Telepon (0294) 381137
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Helpdesk;

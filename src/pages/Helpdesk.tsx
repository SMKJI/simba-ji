
import { useEffect, useState } from 'react';
import { MessageSquare, Send, User, UserCheck, Clock, Check } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRegistrations } from '@/hooks/useRegistrations';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap harus minimal 3 karakter' }),
  email: z.string().email({ message: 'Format email tidak valid' }),
  subject: z.string().min(5, { message: 'Subjek harus minimal 5 karakter' }),
  message: z.string().min(10, { message: 'Pesan harus minimal 10 karakter' }),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data for helpdesk tickets
const MOCK_TICKETS = [
  {
    id: 'T1001',
    name: 'Ahmad Fauzi',
    email: 'ahmad@example.com',
    subject: 'Kesulitan mengisi formulir pendaftaran',
    message: 'Saya tidak bisa mengisi field tanggal lahir, selalu muncul error.',
    status: 'open',
    createdAt: '2023-06-10T09:30:00Z',
    replies: []
  },
  {
    id: 'T1002',
    name: 'Siti Nurhaliza',
    email: 'siti@example.com',
    subject: 'Link grup WhatsApp tidak aktif',
    message: 'Link grup WhatsApp yang saya terima tidak bisa diakses. Mohon bantuan.',
    status: 'inProgress',
    createdAt: '2023-06-11T14:15:00Z',
    replies: [
      {
        id: 'R1',
        message: 'Kami akan segera memeriksa link tersebut dan mengirimkan link baru. Mohon tunggu sebentar.',
        sender: 'operator',
        createdAt: '2023-06-11T15:20:00Z',
      }
    ]
  },
  {
    id: 'T1003',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    subject: 'Pertanyaan tentang program keahlian',
    message: 'Saya ingin mengetahui lebih detail tentang program keahlian Teknik Komputer dan Jaringan.',
    status: 'closed',
    createdAt: '2023-06-09T11:45:00Z',
    replies: [
      {
        id: 'R2',
        message: 'Terima kasih atas pertanyaannya. Program keahlian TKJ fokus pada pengembangan jaringan komputer dan troubleshooting. Kurikulum meliputi Cisco Networking, server management, dan keamanan jaringan.',
        sender: 'operator',
        createdAt: '2023-06-09T13:10:00Z',
      },
      {
        id: 'R3',
        message: 'Terima kasih atas penjelasannya. Saya sudah mengerti.',
        sender: 'user',
        createdAt: '2023-06-09T14:05:00Z',
      }
    ]
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Baru</Badge>;
    case 'inProgress':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Diproses</Badge>;
    case 'closed':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Selesai</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const Helpdesk = () => {
  const { toast } = useToast();
  const { hasRole, authenticated } = useRegistrations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const isOperator = authenticated && hasRole('helpdesk');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form for user message submission
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
      
      // Add new ticket to the list (for demo)
      if (isOperator) {
        const newTicket = {
          id: `T${1000 + tickets.length + 1}`,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: 'open',
          createdAt: new Date().toISOString(),
          replies: []
        };
        
        setTickets([newTicket, ...tickets]);
      }
      
      toast({
        title: 'Pesan Terkirim',
        description: 'Kami akan segera menghubungi Anda melalui email yang diberikan.',
      });
      
      form.reset();
    }, 1500);
  };

  const handleReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: ticket.status === 'open' ? 'inProgress' : ticket.status,
          replies: [
            ...ticket.replies,
            {
              id: `R${Math.floor(Math.random() * 1000)}`,
              message: replyText,
              sender: 'operator',
              createdAt: new Date().toISOString(),
            }
          ]
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setReplyText('');
    
    toast({
      title: 'Balasan Terkirim',
      description: 'Balasan Anda telah dikirim ke pengguna.',
    });
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: newStatus
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    
    toast({
      title: 'Status Diperbarui',
      description: `Tiket #${ticketId} telah diperbarui.`,
    });
  };

  // Render operator helpdesk view
  if (isOperator) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Helpdesk Operator Dashboard
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card className="border-0 shadow-lg rounded-xl overflow-hidden sticky top-24">
                    <CardHeader className="bg-primary/5 border-b p-4">
                      <CardTitle className="text-lg font-semibold text-primary">
                        Daftar Tiket
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-0 divide-y">
                        {tickets.map((ticket) => (
                          <div 
                            key={ticket.id}
                            className={`p-4 hover:bg-muted/30 cursor-pointer transition-colors ${selectedTicket === ticket.id ? 'bg-muted/50' : ''}`}
                            onClick={() => setSelectedTicket(ticket.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-sm line-clamp-1">{ticket.subject}</h3>
                                <p className="text-xs text-muted-foreground">{ticket.name}</p>
                              </div>
                              {getStatusBadge(ticket.status)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(ticket.createdAt).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  {selectedTicket ? (
                    (() => {
                      const ticket = tickets.find(t => t.id === selectedTicket);
                      if (!ticket) return null;
                      
                      return (
                        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                          <CardHeader className="bg-primary/5 border-b p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-lg font-semibold text-primary">
                                    {ticket.subject}
                                  </CardTitle>
                                  {getStatusBadge(ticket.status)}
                                </div>
                                <CardDescription>
                                  Dari: {ticket.name} ({ticket.email})
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                {ticket.status !== 'closed' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleStatusChange(ticket.id, 'closed')}
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Tutup Tiket
                                  </Button>
                                )}
                                {ticket.status === 'open' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleStatusChange(ticket.id, 'inProgress')}
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Proses Tiket
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div className="flex gap-4 items-start">
                                <Avatar>
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {ticket.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="bg-muted/30 p-3 rounded-lg w-full">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-sm">{ticket.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(ticket.createdAt).toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                  <p className="text-sm">{ticket.message}</p>
                                </div>
                              </div>
                              
                              {ticket.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-4 items-start">
                                  <Avatar>
                                    <AvatarFallback className={`${reply.sender === 'operator' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                                      {reply.sender === 'operator' ? 'OP' : ticket.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className={`p-3 rounded-lg w-full ${reply.sender === 'operator' ? 'bg-secondary/10' : 'bg-muted/30'}`}>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium text-sm">
                                        {reply.sender === 'operator' ? 'Operator Helpdesk' : ticket.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(reply.createdAt).toLocaleString('id-ID')}
                                      </span>
                                    </div>
                                    <p className="text-sm">{reply.message}</p>
                                  </div>
                                </div>
                              ))}
                              
                              {ticket.status !== 'closed' && (
                                <div className="mt-6">
                                  <Textarea 
                                    placeholder="Tulis balasan..." 
                                    className="w-full min-h-[120px]"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                  />
                                  <div className="flex justify-end mt-3">
                                    <Button 
                                      type="button" 
                                      onClick={() => handleReply(ticket.id)}
                                      disabled={!replyText.trim()}
                                    >
                                      <Send className="mr-2 h-4 w-4" />
                                      Kirim Balasan
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()
                  ) : (
                    <div className="h-full flex items-center justify-center p-12 bg-muted/10 rounded-xl">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Pilih Tiket</h3>
                        <p className="text-muted-foreground">
                          Pilih tiket dari daftar untuk melihat detailnya.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Regular user helpdesk view
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


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrations } from '@/hooks/useRegistrations';
import { QueueTicket, TicketCategory } from '@/types/supabase';
import QueueManagement from '@/components/helpdesk/QueueManagement';
import { 
  ArrowRight, Clock, AlertTriangle, Users, Volume2, 
  ExternalLink, CheckCircle2, Loader2
} from 'lucide-react';

const OfflineHelpdesk = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, hasRole } = useRegistrations();
  
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [queueTickets, setQueueTickets] = useState<QueueTicket[]>([]);
  const [myTicket, setMyTicket] = useState<QueueTicket | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [registering, setRegistering] = useState<boolean>(false);
  const [todayCapacity, setTodayCapacity] = useState<{ 
    offline: number, 
    used: number 
  }>({ offline: 30, used: 0 });
  
  const isHelpdeskOffline = hasRole('helpdesk_offline');
  const isAdmin = hasRole('admin');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    loadData();
    
    // Set up real-time subscription for queue tickets
    const queueChannel = supabase
      .channel('queue_tickets_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'queue_tickets',
      }, () => {
        fetchQueueTickets();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(queueChannel);
    };
  }, [currentUser]);
  
  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCategories(),
      fetchQueueTickets(),
      fetchCapacity()
    ]);
    setLoading(false);
  };
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_categories')
        .select('*')
        .eq('is_offline', true)
        .order('name');
      
      if (error) throw error;
      setCategories(data as TicketCategory[]);
      
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal mengambil data kategori",
        variant: "destructive"
      });
    }
  };
  
  const fetchQueueTickets = async () => {
    if (!currentUser) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get all tickets for today
      const { data, error } = await supabase
        .from('queue_tickets')
        .select(`
          *,
          category:category_id(name),
          counter:counter_id(name),
          operator:operator_id(user_id, profiles:user_id(name))
        `)
        .gte('created_at', today)
        .order('queue_number', { ascending: true });
      
      if (error) throw error;
      
      // Format data
      const formattedData = data.map(ticket => ({
        ...ticket,
        categoryName: ticket.category?.name,
        counterName: ticket.counter?.name,
        operatorName: ticket.operator?.profiles?.name
      })) as QueueTicket[];
      
      setQueueTickets(formattedData);
      
      // Find my active ticket if exists
      const userTicket = formattedData.find(t => 
        t.user_id === currentUser.id && 
        ['waiting', 'called', 'serving'].includes(t.status)
      );
      
      setMyTicket(userTicket || null);
      
    } catch (error) {
      console.error('Error fetching queue tickets:', error);
    }
  };
  
  const fetchCapacity = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's capacity
      const { data: capacityData, error: capacityError } = await supabase
        .from('daily_helpdesk_capacity')
        .select('*')
        .eq('date', today)
        .single();
      
      if (capacityError) {
        if (capacityError.code === 'PGRST116') { // No rows found
          // Create default capacity for today
          const { data: newCapacity, error: insertError } = await supabase
            .from('daily_helpdesk_capacity')
            .insert({ date: today, offline_capacity: 30, online_capacity: 50 })
            .select()
            .single();
          
          if (insertError) throw insertError;
          
          setTodayCapacity({
            offline: newCapacity.offline_capacity,
            used: 0
          });
        } else {
          throw capacityError;
        }
      } else if (capacityData) {
        // Get today's ticket count
        const today = new Date().toISOString().split('T')[0];
        const { count, error: countError } = await supabase
          .from('queue_tickets')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today);
        
        if (countError) throw countError;
        
        setTodayCapacity({
          offline: capacityData.offline_capacity,
          used: count || 0
        });
      }
    } catch (error) {
      console.error('Error fetching capacity:', error);
    }
  };
  
  const registerQueueTicket = async () => {
    if (!currentUser) {
      toast({
        title: "Tidak dapat mendaftar",
        description: "Anda perlu masuk untuk mendaftar antrean",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedCategory) {
      toast({
        title: "Pilih kategori",
        description: "Silakan pilih kategori permasalahan Anda",
        variant: "destructive"
      });
      return;
    }
    
    if (myTicket) {
      toast({
        title: "Anda sudah memiliki antrean",
        description: "Anda sudah terdaftar dalam antrean hari ini",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setRegistering(true);
      
      // Check if we've reached the daily limit
      if (todayCapacity.used >= todayCapacity.offline) {
        toast({
          title: "Kuota antrean habis",
          description: "Kuota antrean hari ini telah habis, silakan coba lagi besok",
          variant: "destructive"
        });
        setRegistering(false);
        return;
      }
      
      // Create queue ticket
      const { data, error } = await supabase
        .from('queue_tickets')
        .insert({
          user_id: currentUser.id,
          category_id: selectedCategory,
          status: 'waiting',
          // queue_number will be set by the database trigger
        })
        .select(`
          *,
          category:category_id(name)
        `)
        .single();
      
      if (error) throw error;
      
      // Set my ticket
      setMyTicket({
        ...data,
        categoryName: data.category?.name
      });
      
      // Update capacity used count
      setTodayCapacity(prev => ({
        ...prev,
        used: prev.used + 1
      }));
      
      // Show success message
      toast({
        title: "Antrean berhasil didaftarkan",
        description: `Nomor antrean Anda adalah ${data.queue_number}`
      });
      
    } catch (error) {
      console.error('Error registering queue ticket:', error);
      toast({
        title: "Gagal mendaftar antrean",
        description: "Terjadi kesalahan saat mencoba mendaftar antrean",
        variant: "destructive"
      });
    } finally {
      setRegistering(false);
    }
  };

  // Get queue statistics
  const getQueueStats = () => {
    return {
      waiting: queueTickets.filter(t => t.status === 'waiting').length,
      called: queueTickets.filter(t => t.status === 'called').length,
      serving: queueTickets.filter(t => t.status === 'serving').length,
      completed: queueTickets.filter(t => 
        t.status === 'completed' || t.status === 'skipped'
      ).length
    };
  };
  
  // Get estimated waiting time
  const getEstimatedWaitingTime = () => {
    if (!myTicket) return 0;
    
    const position = queueTickets
      .filter(t => t.status === 'waiting')
      .findIndex(t => t.id === myTicket.id);
    
    // If not found or first in line
    if (position === -1 || position === 0) return 0;
    
    // Average time per person (in minutes)
    const avgTimePerPerson = 10;
    
    return position * avgTimePerPerson;
  };
  
  // Get capacity percentage
  const getCapacityPercentage = () => {
    return Math.min(Math.round((todayCapacity.used / todayCapacity.offline) * 100), 100);
  };
  
  // Go to queue display page
  const goToQueueDisplay = () => {
    navigate('/queue-display');
  };
  
  const stats = getQueueStats();
  const queuePosition = myTicket ? queueTickets
    .filter(t => t.status === 'waiting')
    .findIndex(t => t.id === myTicket.id) + 1 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold">Helpdesk Tatap Muka</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sistem antrean untuk bantuan tatap muka
          </p>
        </div>

        {isHelpdeskOffline || isAdmin ? (
          // Helpdesk officer view
          <Tabs defaultValue="manage">
            <TabsList className="w-full sm:w-auto mb-4">
              <TabsTrigger value="manage">Kelola Antrean</TabsTrigger>
              <TabsTrigger value="display">Tampilan Antrean</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manage" className="space-y-6">
              <QueueManagement currentUser={currentUser} />
            </TabsContent>
            
            <TabsContent value="display">
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">
                      Tampilan Layar Antrean
                    </CardTitle>
                    <Button onClick={goToQueueDisplay} variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Buka di Layar Baru
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="bg-gray-50 border rounded-lg p-4 aspect-video flex items-center justify-center">
                    <iframe 
                      src="/queue-display" 
                      title="Queue Display"
                      className="w-full h-full border-0 rounded"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          // Applicant view
          <Tabs defaultValue={myTicket ? "status" : "register"}>
            <TabsList className="w-full sm:w-auto mb-4">
              <TabsTrigger value="register">
                Daftar Antrean
              </TabsTrigger>
              <TabsTrigger value="status">
                Status Antrean
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="register">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Daftar Antrean Helpdesk</CardTitle>
                    <CardDescription>
                      Daftarkan diri Anda untuk mendapatkan bantuan tatap muka
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="py-8 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : myTicket ? (
                      <div className="text-center py-6 px-4">
                        <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Anda Sudah Terdaftar</h3>
                        <p className="text-muted-foreground mb-4">
                          Anda telah terdaftar dalam antrean dengan nomor <strong>{myTicket.queue_number}</strong>
                        </p>
                        <Button 
                          variant="secondary" 
                          onClick={() => document.getElementById('status-tab')?.click()}
                        >
                          Lihat Status Antrean
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="category" className="block text-sm font-medium mb-1">
                              Kategori Permasalahan
                            </label>
                            <Select 
                              value={selectedCategory} 
                              onValueChange={setSelectedCategory}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori permasalahan" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label htmlFor="notes" className="block text-sm font-medium mb-1">
                              Catatan (Opsional)
                            </label>
                            <Textarea
                              id="notes"
                              placeholder="Masukkan catatan tambahan tentang masalah Anda"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              rows={3}
                            />
                          </div>
                          
                          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
                            <div className="flex">
                              <AlertTriangle className="h-5 w-5 text-yellow-700 mr-2 flex-shrink-0" />
                              <div>
                                <p className="font-medium">Perhatian!</p>
                                <p className="mt-1">
                                  Pendaftaran antrean hanya berlaku untuk hari ini. Pastikan Anda hadir saat nomor antrean dipanggil.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2">
                            <div className="text-sm text-muted-foreground">
                              Kuota Tersisa: <span className="font-medium">{todayCapacity.offline - todayCapacity.used}</span>
                            </div>
                            <Button 
                              onClick={registerQueueTicket} 
                              disabled={registering || !selectedCategory || todayCapacity.used >= todayCapacity.offline}
                            >
                              {registering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Daftar Antrean
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Informasi Antrean</CardTitle>
                    <CardDescription>
                      Status antrean helpdesk tatap muka hari ini
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {loading ? '-' : stats.waiting}
                          </div>
                          <div className="text-sm text-muted-foreground">Sedang Menunggu</div>
                        </div>
                        <div className="border rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-primary">
                            {loading ? '-' : stats.serving + stats.called}
                          </div>
                          <div className="text-sm text-muted-foreground">Sedang Dilayani</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            Kapasitas Terpakai
                          </div>
                          <span className="font-medium">
                            {getCapacityPercentage()}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              getCapacityPercentage() >= 90 ? 'bg-red-500' : 
                              getCapacityPercentage() >= 70 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${getCapacityPercentage()}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {todayCapacity.used} dari {todayCapacity.offline} kuota hari ini
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Kategori Bantuan Tatap Muka</h4>
                        <ul className="space-y-2 text-sm">
                          {categories.map((category, index) => (
                            <li key={category.id} className="flex items-start">
                              <span className="h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary mr-2 mt-0.5">
                                {index + 1}
                              </span>
                              <span>{category.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="status" id="status-tab">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status Antrean Anda</CardTitle>
                    <CardDescription>
                      Informasi tentang antrean Anda saat ini
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="py-8 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : myTicket ? (
                      <div className="border-2 rounded-lg overflow-hidden">
                        <div className="bg-primary/10 p-6 text-center">
                          <div className="text-6xl font-bold text-primary mb-2">
                            {myTicket.queue_number}
                          </div>
                          <Badge className={`
                            ${myTicket.status === 'waiting' ? 'bg-yellow-500' : 
                              myTicket.status === 'called' ? 'bg-blue-500' : 
                              'bg-green-500'}
                          `}>
                            {myTicket.status === 'waiting' ? 'Menunggu' : 
                             myTicket.status === 'called' ? 'Dipanggil' : 
                             'Sedang Dilayani'}
                          </Badge>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {myTicket.categoryName}
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          {myTicket.status === 'waiting' && (
                            <>
                              <div className="flex justify-between text-sm p-3 bg-muted/20 rounded-lg">
                                <span>Posisi Anda dalam antrean:</span>
                                <span className="font-medium">{queuePosition}</span>
                              </div>
                              
                              <div className="flex justify-between text-sm p-3 bg-muted/20 rounded-lg">
                                <span>Perkiraan waktu tunggu:</span>
                                <span className="font-medium">±{getEstimatedWaitingTime()} menit</span>
                              </div>
                            </>
                          )}
                          
                          {myTicket.status === 'called' && (
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                              <div className="font-medium text-blue-800 mb-1">Anda telah dipanggil!</div>
                              <p className="text-blue-700 text-sm">
                                Silakan menuju ke {myTicket.counterName || 'loket yang ditentukan'}.
                              </p>
                            </div>
                          )}
                          
                          {myTicket.status === 'serving' && (
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                              <div className="font-medium text-green-800 mb-1">Sedang dilayani</div>
                              <p className="text-green-700 text-sm">
                                Anda sedang dilayani di {myTicket.counterName || 'loket yang ditentukan'}.
                              </p>
                            </div>
                          )}
                          
                          <Button 
                            onClick={goToQueueDisplay} 
                            variant="outline" 
                            className="w-full"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Buka Tampilan Antrean
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 px-4">
                        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Belum Terdaftar</h3>
                        <p className="text-muted-foreground mb-4">
                          Anda belum terdaftar dalam antrean helpdesk hari ini
                        </p>
                        <Button 
                          variant="secondary" 
                          onClick={() => document.getElementById('register-tab')?.click()}
                        >
                          Daftar Antrean Sekarang
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Antrean Saat Ini</CardTitle>
                    <CardDescription>
                      Status antrean helpdesk tatap muka hari ini
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="waiting">
                      <TabsList className="w-full">
                        <TabsTrigger value="waiting" className="flex-1">
                          Menunggu <Badge variant="secondary" className="ml-1">{stats.waiting}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="active" className="flex-1">
                          Aktif <Badge variant="secondary" className="ml-1">{stats.called + stats.serving}</Badge>
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="waiting" className="pt-4">
                        {stats.waiting === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">
                              Tidak ada antrean yang menunggu
                            </p>
                          </div>
                        ) : (
                          <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {queueTickets
                              .filter(t => t.status === 'waiting')
                              .map((ticket, index) => (
                                <div 
                                  key={ticket.id} 
                                  className={`
                                    flex justify-between items-center p-3 rounded-lg border
                                    ${ticket.id === myTicket?.id ? 'bg-primary/5 border-primary' : ''}
                                  `}
                                >
                                  <div className="flex items-center">
                                    <div className="font-medium min-w-[3rem]">
                                      {ticket.queue_number}
                                    </div>
                                    <div className="text-sm">{ticket.categoryName}</div>
                                  </div>
                                  {ticket.id === myTicket?.id && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                                      Anda
                                    </Badge>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="active" className="pt-4">
                        {stats.called + stats.serving === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">
                              Tidak ada antrean yang aktif
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {queueTickets
                              .filter(t => t.status === 'called' || t.status === 'serving')
                              .map(ticket => (
                                <div 
                                  key={ticket.id} 
                                  className={`
                                    p-3 rounded-lg border ${ticket.id === myTicket?.id ? 'border-primary bg-primary/5' : 
                                      ticket.status === 'called' ? 'bg-blue-50 border-blue-200' : 
                                      'bg-green-50 border-green-200'}
                                  `}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="font-medium">
                                      {ticket.queue_number}
                                    </div>
                                    <Badge className={
                                      ticket.id === myTicket?.id ? 'bg-primary' :
                                      ticket.status === 'called' ? 'bg-blue-500' : 
                                      'bg-green-500'
                                    }>
                                      {ticket.status === 'called' ? 'Dipanggil' : 'Dilayani'}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between mt-1 text-sm">
                                    <div>{ticket.categoryName}</div>
                                    {ticket.counterName && (
                                      <div>Loket: {ticket.counterName}</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        onClick={goToQueueDisplay}
                        variant="outline"
                        className="w-full"
                      >
                        <Volume2 className="mr-2 h-4 w-4" />
                        Buka Tampilan Antrean
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OfflineHelpdesk;

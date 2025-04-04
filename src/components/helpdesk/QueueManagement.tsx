
import { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  QueueTicket, HelpdeskCounter, HelpdeskOperator, User
} from '@/types/supabase';
import { 
  Volume2, PlayCircle, CheckCircle2, SkipForward, 
  PauseCircle, RefreshCw, UserCheck
} from 'lucide-react';

export const QueueManagement = ({ currentUser }: { currentUser: User | null }) => {
  const { toast } = useToast();
  const [queueTickets, setQueueTickets] = useState<QueueTicket[]>([]);
  const [counters, setCounters] = useState<HelpdeskCounter[]>([]);
  const [userCounter, setUserCounter] = useState<HelpdeskCounter | null>(null);
  const [operator, setOperator] = useState<HelpdeskOperator | null>(null);
  const [currentTicket, setCurrentTicket] = useState<QueueTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchOperatorInfo();
      fetchQueueData();
      
      // Set up real-time subscription for queue tickets
      const queueChannel = supabase
        .channel('queue_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'queue_tickets',
        }, () => {
          fetchQueueData();
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(queueChannel);
      };
    }
  }, [currentUser]);

  const fetchOperatorInfo = async () => {
    if (!currentUser) return;
    
    try {
      // Get operator info
      const { data: operatorData, error: operatorError } = await supabase
        .from('helpdesk_operators')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_offline', true)
        .single();
      
      if (operatorError) {
        if (operatorError.code !== 'PGRST116') { // No rows found
          throw operatorError;
        }
        return;
      }
      
      if (operatorData) {
        // Create a properly typed HelpdeskOperator object
        const opObj: HelpdeskOperator = {
          id: operatorData.id,
          user_id: operatorData.user_id,
          name: currentUser.name, // Use the current user's name
          email: currentUser.email, // Use the current user's email
          assignedTickets: 0, // We'll calculate this later if needed
          status: operatorData.is_active ? 'active' : 'inactive',
          is_offline: operatorData.is_offline,
          lastActive: operatorData.updated_at
        };
        
        setOperator(opObj);
      
        // Get counter info if operator exists
        if (operatorData) {
          const { data: counterData, error: counterError } = await supabase
            .from('helpdesk_counters')
            .select('*')
            .eq('operator_id', operatorData.id)
            .single();
          
          if (counterError && counterError.code !== 'PGRST116') {
            throw counterError;
          }
          
          setUserCounter(counterData || null);
          
          // Get current active ticket for this counter
          if (counterData) {
            const { data: ticketData, error: ticketError } = await supabase
              .from('queue_tickets')
              .select(`
                *,
                category:category_id(name),
                counter:counter_id(name)
              `)
              .eq('counter_id', counterData.id)
              .in('status', ['called', 'serving'])
              .order('served_at', { ascending: false })
              .limit(1)
              .single();
            
            if (ticketError && ticketError.code !== 'PGRST116') {
              throw ticketError;
            }
            
            if (ticketData) {
              const queueTicket: QueueTicket = {
                id: ticketData.id,
                user_id: ticketData.user_id,
                queue_number: ticketData.queue_number,
                category_id: ticketData.category_id,
                categoryName: ticketData.category?.name,
                status: ticketData.status as 'waiting' | 'called' | 'serving' | 'completed' | 'skipped',
                counter_id: ticketData.counter_id,
                counterName: ticketData.counter?.name,
                operator_id: ticketData.operator_id,
                created_at: ticketData.created_at,
                served_at: ticketData.served_at,
                completed_at: ticketData.completed_at,
                updated_at: ticketData.updated_at
              };
              
              setCurrentTicket(queueTicket);
            }
          }
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching operator info:', error);
      setLoading(false);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal mengambil informasi operator",
        variant: "destructive"
      });
    }
  };

  const fetchQueueData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('queue_tickets')
        .select(`
          *,
          category:category_id(name),
          counter:counter_id(name)
        `)
        .eq('status', 'waiting')
        .gte('created_at', today)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const formattedData = data.map(ticket => ({
        id: ticket.id,
        user_id: ticket.user_id,
        queue_number: ticket.queue_number,
        category_id: ticket.category_id,
        categoryName: ticket.category?.name,
        status: ticket.status as 'waiting' | 'called' | 'serving' | 'completed' | 'skipped',
        counter_id: ticket.counter_id,
        counterName: ticket.counter?.name,
        operator_id: ticket.operator_id,
        created_at: ticket.created_at,
        served_at: ticket.served_at,
        completed_at: ticket.completed_at,
        updated_at: ticket.updated_at
      }));
      
      setQueueTickets(formattedData);
    } catch (error) {
      console.error('Error fetching queue data:', error);
    }
  };

  const fetchCounters = async () => {
    try {
      const { data, error } = await supabase
        .from('helpdesk_counters')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setCounters(data as HelpdeskCounter[]);
    } catch (error) {
      console.error('Error fetching counters:', error);
    }
  };

  const callNextTicket = async () => {
    if (!operator || !userCounter) {
      toast({
        title: "Tidak dapat memanggil antrian",
        description: "Anda tidak terhubung dengan loket aktif",
        variant: "destructive"
      });
      return;
    }
    
    if (currentTicket && (currentTicket.status === 'called' || currentTicket.status === 'serving')) {
      toast({
        title: "Masih ada antrian aktif",
        description: "Selesaikan atau lewati antrian yang sedang aktif terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Get next waiting ticket
      if (queueTickets.length === 0) {
        toast({
          title: "Tidak ada antrian",
          description: "Tidak ada antrian yang menunggu saat ini",
        });
        return;
      }
      
      const nextTicket = queueTickets[0];
      
      // Update ticket status and assign counter
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('queue_tickets')
        .update({
          status: 'called',
          counter_id: userCounter.id,
          operator_id: operator.id,
          served_at: now,
          updated_at: now
        })
        .eq('id', nextTicket.id)
        .select(`
          *,
          category:category_id(name),
          counter:counter_id(name)
        `)
        .single();
      
      if (error) throw error;
      
      // Update local state
      setCurrentTicket({
        ...data,
        categoryName: data.category?.name,
        counterName: data.counter?.name
      });
      
      // Remove from waiting queue
      setQueueTickets(prev => prev.filter(t => t.id !== nextTicket.id));
      
      // Show success message
      toast({
        title: "Antrian berhasil dipanggil",
        description: `Nomor antrian ${nextTicket.queue_number} dipanggil ke ${userCounter.name}`
      });
      
      // Play announcement (this will actually be played on the QueueDisplay page)
      // This is just for triggering the real-time event
      
    } catch (error) {
      console.error('Error calling next ticket:', error);
      toast({
        title: "Gagal memanggil antrian",
        description: "Terjadi kesalahan saat memanggil antrian berikutnya",
        variant: "destructive"
      });
    }
  };

  const recallTicket = async () => {
    if (!currentTicket) return;
    
    try {
      // Re-call same ticket (update timestamp to trigger notification)
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('queue_tickets')
        .update({
          status: 'called', // Keep as called
          updated_at: now
        })
        .eq('id', currentTicket.id);
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Antrian dipanggil ulang",
        description: `Nomor antrian ${currentTicket.queue_number} dipanggil ulang`
      });
      
    } catch (error) {
      console.error('Error recalling ticket:', error);
      toast({
        title: "Gagal memanggil ulang",
        description: "Terjadi kesalahan saat mencoba memanggil ulang antrian",
        variant: "destructive"
      });
    }
  };

  const startServingTicket = async () => {
    if (!currentTicket) return;
    
    try {
      // Update ticket status to serving
      const { data, error } = await supabase
        .from('queue_tickets')
        .update({
          status: 'serving',
          updated_at: new Date().toISOString()
        })
        .eq('id', currentTicket.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setCurrentTicket({
        ...currentTicket,
        ...data,
        status: 'serving'
      });
      
      // Show success message
      toast({
        title: "Mulai melayani",
        description: `Nomor antrian ${currentTicket.queue_number} sedang dilayani`
      });
      
    } catch (error) {
      console.error('Error starting service:', error);
      toast({
        title: "Gagal memulai layanan",
        description: "Terjadi kesalahan saat mencoba memulai layanan",
        variant: "destructive"
      });
    }
  };

  const completeTicket = async () => {
    if (!currentTicket) return;
    
    try {
      // Update ticket status to completed
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('queue_tickets')
        .update({
          status: 'completed',
          completed_at: now,
          updated_at: now
        })
        .eq('id', currentTicket.id);
      
      if (error) throw error;
      
      // Reset current ticket
      setCurrentTicket(null);
      
      // Show success message
      toast({
        title: "Antrian selesai",
        description: "Layanan untuk antrian ini telah selesai"
      });
      
    } catch (error) {
      console.error('Error completing ticket:', error);
      toast({
        title: "Gagal menyelesaikan antrian",
        description: "Terjadi kesalahan saat mencoba menyelesaikan antrian",
        variant: "destructive"
      });
    }
  };

  const skipTicket = async () => {
    if (!currentTicket) return;
    
    try {
      // Update ticket status to skipped
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('queue_tickets')
        .update({
          status: 'skipped',
          completed_at: now,
          updated_at: now
        })
        .eq('id', currentTicket.id);
      
      if (error) throw error;
      
      // Reset current ticket
      setCurrentTicket(null);
      
      // Show success message
      toast({
        title: "Antrian dilewati",
        description: "Antrian ini telah dilewati"
      });
      
    } catch (error) {
      console.error('Error skipping ticket:', error);
      toast({
        title: "Gagal melewati antrian",
        description: "Terjadi kesalahan saat mencoba melewati antrian",
        variant: "destructive"
      });
    }
  };

  const selectCounter = async (counterId: string) => {
    if (!operator) {
      toast({
        title: "Tidak dapat memilih loket",
        description: "Anda tidak terdaftar sebagai operator helpdesk",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Update counter with operator id
      const { data, error } = await supabase
        .from('helpdesk_counters')
        .update({ operator_id: operator.id })
        .eq('id', counterId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setUserCounter(data);
      
      // Show success message
      toast({
        title: "Loket dipilih",
        description: `Anda sekarang mengoperasikan ${data.name}`
      });
      
    } catch (error) {
      console.error('Error selecting counter:', error);
      toast({
        title: "Gagal memilih loket",
        description: "Terjadi kesalahan saat mencoba memilih loket",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!operator) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Akses Ditolak</CardTitle>
          <CardDescription>
            Anda tidak terdaftar sebagai operator helpdesk tatap muka. Silakan hubungi administrator.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!userCounter) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pilih Loket</CardTitle>
          <CardDescription>
            Pilih loket yang akan Anda operasikan saat ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {counters.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Tidak ada loket yang tersedia</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchCounters}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Muat ulang
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {counters.map(counter => (
                <Card 
                  key={counter.id}
                  className={counter.operator_id ? "border-red-200 bg-red-50" : "cursor-pointer hover:border-primary"}
                  onClick={() => !counter.operator_id && selectCounter(counter.id)}
                >
                  <CardContent className="p-4">
                    <div className="font-medium">{counter.name}</div>
                    {counter.operator_id ? (
                      <Badge variant="outline" className="mt-2 bg-red-100 text-red-700">
                        Sudah dioperasikan
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mt-2 bg-green-100 text-green-700">
                        Tersedia
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl text-primary font-bold flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              {userCounter.name}
            </CardTitle>
            <CardDescription>
              Panel pengelolaan antrian helpdesk tatap muka
            </CardDescription>
          </div>
          <Button 
            onClick={fetchQueueData}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Muat Ulang
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Ticket Panel */}
          <div>
            <h3 className="text-lg font-medium mb-4">Antrian Aktif</h3>
            {currentTicket ? (
              <div className="border-2 border-primary rounded-lg p-6 bg-primary/5">
                <div className="text-center mb-4">
                  <div className="text-6xl font-bold text-primary">{currentTicket.queue_number}</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {currentTicket.categoryName}
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-4">
                  <Badge className={
                    currentTicket.status === 'called' 
                      ? 'bg-yellow-500' 
                      : 'bg-blue-500'
                  }>
                    {currentTicket.status === 'called' ? 'Dipanggil' : 'Sedang Dilayani'}
                  </Badge>
                </div>
                
                <div className="mt-6 space-y-3">
                  {currentTicket.status === 'called' && (
                    <>
                      <Button className="w-full" onClick={recallTicket}>
                        <Volume2 className="mr-2 h-4 w-4" />
                        Panggil Ulang
                      </Button>
                      
                      <Button className="w-full" onClick={startServingTicket} variant="default">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Mulai Layanan
                      </Button>
                    </>
                  )}
                  
                  {currentTicket.status === 'serving' && (
                    <Button className="w-full" onClick={completeTicket} variant="default">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Selesai
                    </Button>
                  )}
                  
                  <Button 
                    className="w-full" 
                    onClick={skipTicket} 
                    variant="outline"
                  >
                    <SkipForward className="mr-2 h-4 w-4" />
                    Lewati
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Belum ada antrian yang aktif
                </p>
                <Button 
                  onClick={callNextTicket} 
                  disabled={queueTickets.length === 0}
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Panggil Antrian Berikutnya
                </Button>
              </div>
            )}
          </div>
          
          {/* Waiting Queue Panel */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Daftar Tunggu</h3>
              <Badge variant="outline">
                {queueTickets.length} antrian
              </Badge>
            </div>
            
            {queueTickets.length === 0 ? (
              <div className="border rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  Tidak ada antrian yang menunggu
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">No.</th>
                        <th className="text-left p-3 font-medium">Kategori</th>
                        <th className="text-left p-3 font-medium">Waktu Daftar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {queueTickets.map(ticket => (
                        <tr key={ticket.id} className="hover:bg-muted/20">
                          <td className="p-3 font-medium">{ticket.queue_number}</td>
                          <td className="p-3">{ticket.categoryName}</td>
                          <td className="p-3 text-sm">
                            {new Date(ticket.created_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {!currentTicket && (
                  <div className="p-3 border-t bg-muted/10">
                    <Button 
                      onClick={callNextTicket} 
                      className="w-full"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Panggil Antrian Berikutnya
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueueManagement;

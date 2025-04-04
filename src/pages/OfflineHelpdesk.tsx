import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrations } from '@/hooks/useRegistrations';
import type { QueueTicket, TicketCategory, HelpdeskCounter, User } from '@/hooks/useRegistrations';
import { 
  Volume2, PlayCircle, CheckCircle2, SkipForward, 
  PauseCircle, RefreshCw, UserCheck, AlertTriangle
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

const OfflineHelpdesk = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, authenticated } = useRegistrations();
  const [userTicket, setUserTicket] = useState<QueueTicket | null>(null);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [counters, setCounters] = useState<HelpdeskCounter[]>([]);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
    
    fetchCategories();
    fetchCounters();
    fetchUserTicket();
  }, [currentUser, navigate]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_categories')
        .select('*')
        .eq('is_offline', true)
        .order('name');
      
      if (error) throw error;
      setCategories(data as TicketCategory[]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load ticket categories',
        variant: 'destructive'
      });
    }
  };

  const fetchCounters = async () => {
    try {
      const { data, error } = await supabase
        .from('helpdesk_counters')
        .select(`
          *,
          operators:operator_id(name)
        `);
      
      if (error) throw error;
      
      const formattedCounters = data.map(counter => ({
        id: counter.id,
        name: counter.name,
        is_active: counter.is_active,
        operator_id: counter.operator_id,
        operatorName: counter.operators && typeof counter.operators === 'object' && 'name' in counter.operators ? 
          counter.operators.name : null
      }));
      
      setCounters(formattedCounters);
    } catch (error) {
      console.error('Error fetching counters:', error);
      toast({
        title: 'Error',
        description: 'Failed to load counters',
        variant: 'destructive'
      });
    }
  };

  const fetchUserTicket = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('queue_tickets')
        .select(`
          *,
          category:category_id(name)
        `)
        .eq('user_id', currentUser.id)
        .not('status', 'in', ['completed', 'skipped'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') {
          throw error;
        }
        setUserTicket(null);
      } else {
        const ticketStatus = data.status as 'waiting' | 'called' | 'serving' | 'completed' | 'skipped';
        
        setUserTicket({
          id: data.id,
          user_id: data.user_id,
          queue_number: data.queue_number,
          category_id: data.category_id,
          categoryName: data.category?.name,
          status: ticketStatus,
          counter_id: data.counter_id,
          operator_id: data.operator_id,
          created_at: data.created_at,
          served_at: data.served_at,
          completed_at: data.completed_at
        });
      }
    } catch (error) {
      console.error('Error fetching user ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your ticket',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createQueueTicket = async () => {
    if (!selectedCategory || !currentUser) return;
    
    setCreatingTicket(true);
    
    try {
      const { data, error } = await supabase
        .from('queue_tickets')
        .insert({
          user_id: currentUser.id,
          category_id: selectedCategory,
          status: 'waiting',
          queue_number: 0 // This will be overridden by the trigger
        } as any)
        .select()
        .single();
    
      if (error) throw error;
    
      const ticketStatus = data.status as 'waiting' | 'called' | 'serving' | 'completed' | 'skipped';
      
      const ticket: QueueTicket = {
        id: data.id,
        user_id: data.user_id,
        queue_number: data.queue_number,
        category_id: data.category_id,
        status: ticketStatus,
        counter_id: data.counter_id,
        operator_id: data.operator_id,
        created_at: data.created_at,
        served_at: data.served_at,
        completed_at: data.completed_at
      };
    
      setUserTicket(ticket);
    
      toast({
        title: 'Sukses',
        description: `Nomor antrian Anda: ${data.queue_number}`,
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat tiket antrian',
        variant: 'destructive'
      });
    } finally {
      setCreatingTicket(false);
    }
  };

  const cancelQueueTicket = async () => {
    if (!userTicket) return;
    
    try {
      const { error } = await supabase
        .from('queue_tickets')
        .delete()
        .eq('id', userTicket.id);
      
      if (error) throw error;
      
      setUserTicket(null);
      toast({
        title: 'Sukses',
        description: 'Antrian Anda telah dibatalkan',
      });
    } catch (error) {
      console.error('Error cancelling ticket:', error);
      toast({
        title: 'Error',
        description: 'Gagal membatalkan antrian',
        variant: 'destructive'
      });
    }
  };

  if (!authenticated || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AlertTriangle className="mr-2 h-4 w-4" />
        Anda harus login untuk mengakses halaman ini.
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Helpdesk Tatap Muka</h1>
        <p className="text-muted-foreground mb-4">
          Ambil nomor antrian untuk mendapatkan bantuan secara langsung.
        </p>
        
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Antrian Anda</CardTitle>
            <CardDescription>
              Status antrian Anda saat ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex justify-center">
                <RefreshCw className="animate-spin h-6 w-6" />
              </div>
            ) : userTicket ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">
                    Nomor Antrian: {userTicket.queue_number}
                  </div>
                  <Badge variant="secondary">
                    {userTicket.status}
                  </Badge>
                </div>
                <div>
                  Kategori: {userTicket.categoryName}
                </div>
                <div>
                  Waktu Daftar: {new Date(userTicket.created_at).toLocaleString()}
                </div>
                <Button 
                  variant="destructive"
                  onClick={cancelQueueTicket}
                >
                  Batalkan Antrian
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p>Anda belum memiliki antrian. Silakan buat antrian baru.</p>
                <Select onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={createQueueTicket}
                  disabled={!selectedCategory || creatingTicket}
                >
                  {creatingTicket ? (
                    <>
                      Membuat Antrian...
                      <RefreshCw className="animate-spin h-4 w-4 ml-2" />
                    </>
                  ) : (
                    "Buat Antrian"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Loket yang Tersedia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {counters.map(counter => (
              <Card key={counter.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="font-semibold">{counter.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Operator: {counter.operatorName || 'Belum ada'}
                  </div>
                  <Badge className="mt-2">
                    {counter.is_active ? 'Buka' : 'Tutup'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OfflineHelpdesk;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  QueueTicket, HelpdeskCounter, HelpdeskOperator, User
} from '@/types/supabase';
import { 
  Volume2, PlayCircle, CheckCircle2, SkipForward, 
  PauseCircle, RefreshCw, UserCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const QueueDisplay = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [queueStatus, setQueueStatus] = useState<'waiting' | 'serving'>('waiting');
  const [currentQueue, setCurrentQueue] = useState<
    (QueueTicket & { operator?: HelpdeskOperator }) | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentQueue();
    
    // Subscribe to queue changes
    const queueChannel = supabase
      .channel('queue_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'queue_tickets',
      }, () => {
        fetchCurrentQueue();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(queueChannel);
    };
  }, []);

  const fetchCurrentQueue = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('queue_tickets')
        .select(`
          *,
          category:category_id(name),
          counter:counter_id(name),
          operator:operator_id(profiles(name))
        `)
        .in('status', ['called', 'serving'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const status = data.status as 'waiting' | 'called' | 'serving' | 'completed' | 'skipped';
        
        const queueTicket: QueueTicket & { operator?: HelpdeskOperator } = {
          id: data.id,
          user_id: data.user_id,
          queue_number: data.queue_number,
          category_id: data.category_id,
          categoryName: data.category?.name,
          status: status,
          counter_id: data.counter_id,
          counterName: data.counter?.name,
          operator_id: data.operator_id,
          operator: data.operator,
          created_at: data.created_at,
          served_at: data.served_at,
          completed_at: data.completed_at,
          updated_at: data.updated_at
        };
        
        setCurrentQueue(queueTicket);
        setQueueStatus(status === 'serving' ? 'serving' : 'waiting');
      } else {
        setCurrentQueue(null);
        setQueueStatus('waiting');
      }
      
    } catch (error) {
      console.error('Error fetching current queue:', error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal mengambil antrian saat ini",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Tampilan Antrian
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {queueStatus === 'waiting' && (
            <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-medium mb-4">
                Tidak ada antrian yang sedang dilayani
              </h2>
              <p className="text-muted-foreground">
                Silakan menunggu hingga nomor antrian Anda dipanggil
              </p>
            </div>
          )}
          
          {queueStatus === 'serving' && currentQueue && (
            <div className="bg-primary/10 border border-primary p-8 rounded-lg text-center">
              <div className="flex justify-between items-center mb-6">
                <div className="text-left">
                  <Badge variant="secondary" className="text-base px-4 py-1 font-normal mb-2">
                    {currentQueue.categoryName || 'General'}
                  </Badge>
                  <h3 className="text-2xl font-medium">
                    {currentQueue.counterName || 'Counter'}
                  </h3>
                </div>
                <div className="text-5xl font-bold text-primary">
                  {currentQueue.queue_number}
                </div>
              </div>
              
              <div className="mt-4 text-lg">
                <div className="flex items-center justify-center">
                  <UserCheck className="mr-2 h-5 w-5 text-primary" />
                  <span>
                    {currentQueue.operator && currentQueue.operator.name ? 
                      `Dilayani oleh: ${currentQueue.operator.name}` : 
                      'Sedang dilayani'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QueueDisplay;

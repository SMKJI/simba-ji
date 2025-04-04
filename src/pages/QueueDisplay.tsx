import { useState, useEffect } from 'react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from 'lucide-react';

interface CurrentTicket {
  number: number;
  status: string;
  counter: string;
  operatorName: string;
  categoryName: string;
}

const QueueDisplay = () => {
  const { toast } = useToast();
  const [currentTicket, setCurrentTicket] = useState<CurrentTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentTicket();

    const channel = supabase
      .channel('queue_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'queue_tickets'
      }, (payload: any) => {
        if (payload.new && (payload.new.status === 'called' || payload.new.status === 'serving')) {
          fetchCurrentTicket();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const playAnnouncement = (queueNumber: number, counterName: string) => {
    const announcementText = `Nomor antrian ${queueNumber}, silahkan menuju ke loket ${counterName}`;
    const utterance = new SpeechSynthesisUtterance(announcementText);
    speechSynthesis.speak(utterance);
  };

  const fetchCurrentTicket = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('queue_tickets')
        .select(`
          *,
          category:category_id(name),
          counter:counter_id(name),
          operator:operator_id(name)
        `)
        .in('status', ['called', 'serving'])
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
      if (error.code === 'PGRST116') {
        setCurrentTicket(null);
      } else {
        throw error;
      }
    } else {
      // Safe type assertion or default value
      const operatorName = data.operator && typeof data.operator === 'object' && 'name' in data.operator
        ? data.operator.name || 'Operator'
        : 'Operator';
      
      setCurrentTicket({
        counter: data.counter && typeof data.counter === 'object' && 'name' in data.counter 
          ? data.counter.name || '' 
          : '',
        number: data.queue_number,
        status: data.status,
        operatorName,
        categoryName: data.category && typeof data.category === 'object' && 'name' in data.category
          ? data.category.name || '' 
          : ''
      });

      if (data.status === 'called') {
        playAnnouncement(data.queue_number, data.counter ? data.counter.name || '' : '');
      }
    }
  } catch (error) {
    console.error('Error fetching current ticket:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-24">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-6">
            <CardTitle className="text-2xl font-bold text-primary">
              Tampilan Antrian
            </CardTitle>
            <CardDescription>
              Informasi antrian terkini
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-500">Memuat data antrian...</p>
              </div>
            ) : currentTicket ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-extrabold text-primary">{currentTicket.number}</div>
                  <p className="text-lg text-gray-600">
                    Silakan menuju ke <span className="font-semibold">{currentTicket.counter}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Kategori: {currentTicket.categoryName}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-gray-700">
                    Status: <Badge variant="secondary">{currentTicket.status}</Badge>
                  </div>
                  <div className="text-gray-700">
                    Operator: {currentTicket.operatorName}
                  </div>
                </div>
                {currentTicket.status === 'called' && (
                  <div className="text-center">
                    <Volume2 className="mx-auto h-6 w-6 text-primary mb-2" />
                    <p className="text-sm text-gray-500">
                      Dipanggil, mohon segera menuju loket.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">Tidak ada antrian yang sedang berlangsung.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueDisplay;

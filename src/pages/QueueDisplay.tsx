
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QueueTicket, HelpdeskCounter } from '@/types/supabase';
import { Volume2, VolumeX } from 'lucide-react';

const QueueDisplayPage = () => {
  const { toast } = useToast();
  const [queueTickets, setQueueTickets] = useState<QueueTicket[]>([]);
  const [counters, setCounters] = useState<HelpdeskCounter[]>([]);
  const [activeQueue, setActiveQueue] = useState<QueueTicket | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchQueueData();
    // Set up real-time subscription
    const queueChannel = supabase
      .channel('public:queue_tickets')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'queue_tickets',
      }, (payload) => {
        fetchQueueData();
        if (payload.eventType === 'UPDATE') {
          const updatedTicket = payload.new as QueueTicket;
          if (updatedTicket.status === 'called') {
            setActiveQueue(updatedTicket);
            if (audioEnabled) {
              playCallAnnouncement(updatedTicket);
            }
          }
        }
      })
      .subscribe();

    // Fetch initial data
    fetchCounters();

    return () => {
      supabase.removeChannel(queueChannel);
    };
  }, []);

  // Function to play voice announcement for called ticket
  const playCallAnnouncement = (ticket: QueueTicket) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    // Find counter for announcement
    const counter = counters.find(c => c.id === ticket.counter_id);
    if (!counter) return;

    // Create the announcement text
    const announcementText = `Nomor antrian ${ticket.queue_number}, silakan menuju ke ${counter.name}`;
    
    // Use Web Speech API for voice announcement
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'id-ID';
    speech.text = announcementText;
    speech.volume = 1;
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);

    // Also play bell sound
    const audio = new Audio('/bell-sound.mp3');
    setCurrentAudio(audio);
    audio.play();
  };

  const fetchQueueData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('queue_tickets')
        .select(`
          *,
          category:category_id(name),
          counter:counter_id(name),
          operator:operator_id(user_id)
        `)
        .gte('created_at', today)
        .order('queue_number', { ascending: true });

      if (error) throw error;
      
      // Format and set queue data
      const formattedData = data.map(ticket => ({
        ...ticket,
        categoryName: ticket.category?.name,
        counterName: ticket.counter?.name,
        operatorId: ticket.operator?.user_id
      })) as QueueTicket[];
      
      setQueueTickets(formattedData);
      
      // Find active called ticket
      const calledTicket = formattedData.find(t => t.status === 'called');
      if (calledTicket) {
        setActiveQueue(calledTicket);
      }
    } catch (error) {
      console.error('Error fetching queue data:', error);
      toast({
        title: "Gagal mengambil data antrian",
        description: "Terjadi kesalahan saat mengambil data antrian",
        variant: "destructive"
      });
    }
  };

  const fetchCounters = async () => {
    try {
      const { data, error } = await supabase
        .from('helpdesk_counters')
        .select(`
          *,
          operator:operator_id(
            user_id,
            profiles:user_id(name)
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      
      const formattedCounters = data.map(counter => ({
        ...counter,
        operatorName: counter.operator?.profiles?.name
      })) as HelpdeskCounter[];
      
      setCounters(formattedCounters);
    } catch (error) {
      console.error('Error fetching counters:', error);
    }
  };

  // Group tickets by status
  const waitingTickets = queueTickets.filter(t => t.status === 'waiting');
  const calledTickets = queueTickets.filter(t => t.status === 'called');
  const servingTickets = queueTickets.filter(t => t.status === 'serving');
  const completedTickets = queueTickets.filter(t => 
    t.status === 'completed' || t.status === 'skipped'
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">SMKN 1 Kendal</h1>
          <p className="text-xl text-gray-600">Sistem Antrian Helpdesk PPDB 2025</p>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="h-5 w-5 text-primary" />
                  <span>Suara Aktif</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-5 w-5 text-gray-500" />
                  <span>Suara Nonaktif</span>
                </>
              )}
            </button>
          </div>
        </header>

        {activeQueue && (
          <Card className="mb-8 border-4 border-primary bg-primary/5 shadow-xl animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl text-center font-bold">
                NOMOR ANTRIAN YANG DIPANGGIL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8">
                <div className="text-8xl font-bold text-primary">{activeQueue.queue_number}</div>
                {activeQueue.counterName && (
                  <div className="mt-4 text-2xl font-medium">
                    Silakan menuju ke <span className="text-primary font-bold">{activeQueue.counterName}</span>
                  </div>
                )}
                <div className="mt-2 text-lg">{activeQueue.categoryName}</div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Status Loket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {counters.map(counter => (
                  <div 
                    key={counter.id} 
                    className={`border rounded-lg p-4 ${
                      counter.operator_id ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-lg">{counter.name}</div>
                    <div className="text-sm mt-1">
                      {counter.operator_id ? (
                        <span className="text-green-700">Aktif: {counter.operatorName}</span>
                      ) : (
                        <span className="text-gray-500">Tidak ada operator</span>
                      )}
                    </div>
                    {counter.operator_id && (
                      <div className="mt-2">
                        {servingTickets.find(t => t.counter_id === counter.id) ? (
                          <Badge className="bg-blue-500">Sedang Melayani</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">Menunggu</Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Daftar Antrian</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="waiting">
                <TabsList className="w-full">
                  <TabsTrigger value="waiting" className="flex-1">
                    Menunggu <Badge variant="secondary" className="ml-2">{waitingTickets.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="called" className="flex-1">
                    Dipanggil <Badge variant="secondary" className="ml-2">{calledTickets.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="serving" className="flex-1">
                    Dilayani <Badge variant="secondary" className="ml-2">{servingTickets.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1">
                    Selesai <Badge variant="secondary" className="ml-2">{completedTickets.length}</Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="waiting" className="pt-4">
                  {waitingTickets.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      Tidak ada antrian yang menunggu
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-auto">
                      {waitingTickets.map(ticket => (
                        <div key={ticket.id} className="flex justify-between border p-3 rounded">
                          <div className="font-bold text-primary">No. {ticket.queue_number}</div>
                          <div>{ticket.categoryName}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="called" className="pt-4">
                  {calledTickets.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      Tidak ada antrian yang dipanggil
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-auto">
                      {calledTickets.map(ticket => (
                        <div key={ticket.id} className="border p-3 rounded bg-yellow-50">
                          <div className="flex justify-between">
                            <div className="font-bold text-primary">No. {ticket.queue_number}</div>
                            <Badge className="bg-yellow-500">Dipanggil</Badge>
                          </div>
                          <div className="mt-1 text-sm">
                            <span>Loket: {ticket.counterName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="serving" className="pt-4">
                  {servingTickets.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      Tidak ada antrian yang sedang dilayani
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-auto">
                      {servingTickets.map(ticket => (
                        <div key={ticket.id} className="border p-3 rounded bg-blue-50">
                          <div className="flex justify-between">
                            <div className="font-bold text-primary">No. {ticket.queue_number}</div>
                            <Badge className="bg-blue-500">Dilayani</Badge>
                          </div>
                          <div className="mt-1 text-sm">
                            <span>Loket: {ticket.counterName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="completed" className="pt-4">
                  {completedTickets.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      Tidak ada antrian yang selesai
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-auto">
                      {completedTickets.slice(0, 20).map(ticket => (
                        <div key={ticket.id} className="border p-3 rounded bg-gray-50">
                          <div className="flex justify-between">
                            <div className="font-medium">No. {ticket.queue_number}</div>
                            <Badge variant="outline" className="bg-gray-100">
                              {ticket.status === 'completed' ? 'Selesai' : 'Dilewati'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueueDisplayPage;

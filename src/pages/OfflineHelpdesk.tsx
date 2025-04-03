
import { useEffect, useState } from 'react';
import { useRegistrations } from '@/hooks/useRegistrations';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { QueueTicket, TicketCategory, HelpdeskCounter } from '@/types/supabase';
import { Volume2, SkipForward, Phone, CheckCircle2, AlertCircle, XCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OfflineHelpdesk = () => {
  const { 
    categories, 
    fetchCategories,
    fetchQueueTickets,
    fetchHelpdeskCounters,
    createQueueTicket,
    updateQueueTicketStatus,
    queueTickets,
    counters,
    currentUser,
    hasRole
  } = useRegistrations();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [offlineCategories, setOfflineCategories] = useState<TicketCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isConfirmRegisterDialogOpen, setIsConfirmRegisterDialogOpen] = useState(false);
  const [myTicket, setMyTicket] = useState<QueueTicket | null>(null);
  const [displayData, setDisplayData] = useState({
    now_serving: [] as QueueTicket[],
    called: [] as QueueTicket[],
    waiting: [] as QueueTicket[],
    completed: [] as QueueTicket[]
  });
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  
  // Check for audio support
  useEffect(() => {
    try {
      // For sound effects
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      setAudioContext(new AudioContext());
      
      // For speech synthesis
      if ('speechSynthesis' in window) {
        setSpeechSynthesis(window.speechSynthesis);
      }
    } catch (e) {
      console.error("Audio not supported", e);
    }
  }, []);
  
  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchQueueTickets(),
        fetchHelpdeskCounters()
      ]);
      setLoading(false);
    };
    
    loadData();
    
    // Set up regular polling for queue updates
    const intervalId = setInterval(() => {
      fetchQueueTickets();
      fetchHelpdeskCounters();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchCategories, fetchQueueTickets, fetchHelpdeskCounters]);
  
  // Filter offline categories
  useEffect(() => {
    if (categories) {
      setOfflineCategories(categories.filter(cat => cat.is_offline));
    }
  }, [categories]);
  
  // Update display data when queue tickets change
  useEffect(() => {
    // Find my ticket if I'm an applicant
    if (currentUser && currentUser.role === 'applicant') {
      const ticket = queueTickets.find(t => 
        t.user_id === currentUser.id && 
        ['waiting', 'called', 'serving'].includes(t.status)
      );
      setMyTicket(ticket || null);
    }
    
    // Group tickets for display
    const nowServing = queueTickets.filter(t => t.status === 'serving');
    const called = queueTickets.filter(t => t.status === 'called');
    const waiting = queueTickets.filter(t => t.status === 'waiting');
    const completed = queueTickets
      .filter(t => ['completed', 'skipped'].includes(t.status))
      .slice(0, 10); // Show only the last 10 completed tickets
    
    setDisplayData({
      now_serving: nowServing,
      called: called,
      waiting: waiting,
      completed: completed
    });
  }, [queueTickets, currentUser]);
  
  // Register for the queue
  const handleRegister = async () => {
    if (!selectedCategory) {
      toast({
        title: "Pilih Kategori",
        description: "Silakan pilih kategori permasalahan terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    
    setIsRegisterDialogOpen(false);
    setIsConfirmRegisterDialogOpen(true);
  };
  
  // Confirm queue registration
  const handleConfirmRegister = async () => {
    setIsConfirmRegisterDialogOpen(false);
    
    const result = await createQueueTicket(selectedCategory);
    
    if (result.success) {
      toast({
        title: "Pendaftaran Berhasil",
        description: `Anda telah mendapatkan nomor antrean ${result.queueNumber}`,
      });
      await fetchQueueTickets();
    } else {
      toast({
        title: "Pendaftaran Gagal",
        description: result.error || "Tidak dapat mendaftar antrean saat ini",
        variant: "destructive"
      });
    }
  };
  
  // Call the next queue number
  const handleCallNext = async (counterId: string) => {
    // Look for the first waiting ticket
    const nextTicket = displayData.waiting[0];
    
    if (!nextTicket) {
      toast({
        title: "Tidak Ada Antrean",
        description: "Tidak ada antrean yang menunggu",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateQueueTicketStatus(nextTicket.id, 'called');
    
    if (success) {
      toast({
        title: "Antrean Dipanggil",
        description: `Nomor antrean ${nextTicket.queue_number} telah dipanggil`,
      });
      
      // Play announcement if audio is supported
      if (speechSynthesis) {
        playAnnouncementSound(nextTicket.queue_number, counterId);
      }
      
      await fetchQueueTickets();
    } else {
      toast({
        title: "Gagal Memanggil",
        description: "Tidak dapat memanggil nomor antrean",
        variant: "destructive"
      });
    }
  };
  
  // Mark a ticket as being served
  const handleStartServing = async (ticketId: string) => {
    const success = await updateQueueTicketStatus(ticketId, 'serving');
    
    if (success) {
      toast({
        title: "Mulai Pelayanan",
        description: "Pelayanan antrean telah dimulai",
      });
      await fetchQueueTickets();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat memulai pelayanan",
        variant: "destructive"
      });
    }
  };
  
  // Mark a ticket as completed
  const handleCompleteTicket = async (ticketId: string) => {
    const success = await updateQueueTicketStatus(ticketId, 'completed');
    
    if (success) {
      toast({
        title: "Antrean Selesai",
        description: "Pelayanan antrean telah selesai",
      });
      await fetchQueueTickets();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat menyelesaikan antrean",
        variant: "destructive"
      });
    }
  };
  
  // Skip a ticket
  const handleSkipTicket = async (ticketId: string) => {
    const success = await updateQueueTicketStatus(ticketId, 'skipped');
    
    if (success) {
      toast({
        title: "Antrean Dilewati",
        description: "Nomor antrean telah dilewati",
      });
      await fetchQueueTickets();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat melewati antrean",
        variant: "destructive"
      });
    }
  };
  
  // Play announcement sound
  const playAnnouncementSound = (queueNumber: number, counterId: string) => {
    if (!speechSynthesis) return;
    
    setIsPlayingSound(true);
    
    // Find counter name
    const counter = counters.find(c => c.id === counterId);
    const counterName = counter ? counter.name : 'loket';
    
    // Create the announcement text
    const announcementText = `Nomor antrean ${queueNumber}, silakan menuju ke ${counterName}`;
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(announcementText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Add end event
    utterance.onend = () => {
      setIsPlayingSound(false);
    };
    
    // Play the announcement
    speechSynthesis.speak(utterance);
  };
  
  // Get the assigned counter for the current operator
  const getAssignedCounter = (): HelpdeskCounter | undefined => {
    if (!currentUser) return undefined;
    
    return counters.find(counter => counter.operator_id === currentUser.id);
  };
  
  // Render ticket status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Menunggu</Badge>;
      case 'called':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Dipanggil</Badge>;
      case 'serving':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Dilayani</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Selesai</Badge>;
      case 'skipped':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Dilewati</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get the display text for a queue ticket
  const getTicketDisplayText = (ticket: QueueTicket) => {
    if (!ticket.categoryName) return `Nomor ${ticket.queue_number}`;
    return `${ticket.queue_number} - ${ticket.categoryName}`;
  };
  
  // Render applicant view
  const renderApplicantView = () => {
    return (
      <div className="space-y-6">
        {myTicket ? (
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b p-6">
              <CardTitle className="text-xl font-semibold text-primary">
                Nomor Antrean Anda
              </CardTitle>
              <CardDescription>
                Status dan informasi antrean Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-6">
                <div className="text-6xl font-bold text-primary mb-4">{myTicket.queue_number}</div>
                <div className="text-lg mb-2">{myTicket.categoryName}</div>
                <div className="mb-4">
                  {renderStatusBadge(myTicket.status)}
                </div>
                
                {myTicket.counter_id && (
                  <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
                    <p className="text-lg font-bold">Anda telah dipanggil!</p>
                    <p className="mt-2">Silakan menuju ke {myTicket.counterName}</p>
                  </div>
                )}
                
                <div className="mt-6 text-sm text-muted-foreground">
                  <p>Pendaftaran: {new Date(myTicket.created_at).toLocaleString('id-ID')}</p>
                  {myTicket.served_at && (
                    <p>Mulai dilayani: {new Date(myTicket.served_at).toLocaleString('id-ID')}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b p-6">
              <CardTitle className="text-xl font-semibold text-primary">
                Daftar Antrean Helpdesk Luring
              </CardTitle>
              <CardDescription>
                Daftar untuk mendapatkan nomor antrean pelayanan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                    <div className="text-yellow-700">
                      <p className="font-medium">Informasi Pendaftaran Antrean</p>
                      <p className="text-sm mt-1">
                        Silakan daftar untuk mendapatkan nomor antrean. Anda akan dipanggil ke loket saat giliran Anda tiba.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setIsRegisterDialogOpen(true)}
                >
                  Daftar Antrean Sekarang
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-6">
            <CardTitle className="text-xl font-semibold text-primary">
              Status Antrean Saat Ini
            </CardTitle>
            <CardDescription>
              Pantau status antrean secara real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <Volume2 className="h-4 w-4 mr-2 text-blue-500" />
                  Sedang Dipanggil
                </h3>
                <div className="border rounded-md p-4 min-h-32">
                  {displayData.called.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      Tidak ada antrean yang sedang dipanggil
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {displayData.called.map((ticket) => (
                        <li key={ticket.id} className="flex justify-between items-center p-2 bg-blue-50 rounded-md">
                          <span className="font-medium">{getTicketDisplayText(ticket)}</span>
                          <span className="text-sm text-blue-600">{ticket.counterName}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                  Sedang Dilayani
                </h3>
                <div className="border rounded-md p-4 min-h-32">
                  {displayData.now_serving.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      Tidak ada antrean yang sedang dilayani
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {displayData.now_serving.map((ticket) => (
                        <li key={ticket.id} className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                          <span className="font-medium">{getTicketDisplayText(ticket)}</span>
                          <span className="text-sm text-green-600">{ticket.counterName}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-yellow-500" />
                Antrean Menunggu
              </h3>
              <div className="border rounded-md p-4">
                {displayData.waiting.length === 0 ? (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    Tidak ada antrean yang menunggu
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {displayData.waiting.map((ticket) => (
                      <div key={ticket.id} className="p-2 bg-yellow-50 rounded-md text-center">
                        <span className="font-medium">{ticket.queue_number}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render operator view
  const renderOperatorView = () => {
    const assignedCounter = getAssignedCounter();
    
    // Check if operator has a counter assigned
    if (!assignedCounter) {
      return (
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-6">
            <CardTitle className="text-xl font-semibold text-primary">
              Operator Helpdesk Luring
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Anda Belum Ditugaskan ke Loket</h3>
            <p className="text-muted-foreground mb-4">
              Anda perlu ditugaskan ke loket oleh administrator sebelum dapat mengoperasikan antrean.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    // Get tickets for this counter
    const myCalledTickets = displayData.called.filter(t => t.counter_id === assignedCounter.id);
    const myServingTickets = displayData.now_serving.filter(t => t.counter_id === assignedCounter.id);
    
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold text-primary">
                  Operator Helpdesk Luring
                </CardTitle>
                <CardDescription>
                  Loket: {assignedCounter.name}
                </CardDescription>
              </div>
              <Button
                onClick={() => handleCallNext(assignedCounter.id)}
                disabled={displayData.waiting.length === 0 || isPlayingSound}
              >
                <Volume2 className="mr-2 h-4 w-4" />
                Panggil Antrean Berikutnya
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Antrean Dipanggil</h3>
                <div className="border rounded-md p-4 min-h-40">
                  {myCalledTickets.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-12">
                      Tidak ada antrean yang sedang dipanggil
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {myCalledTickets.map((ticket) => (
                        <li key={ticket.id} className="p-3 bg-blue-50 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-lg">Nomor {ticket.queue_number}</span>
                            {renderStatusBadge(ticket.status)}
                          </div>
                          <div className="text-sm mb-2">
                            <p>{ticket.categoryName}</p>
                            <p className="text-muted-foreground">
                              Dipanggil: {new Date().toLocaleTimeString('id-ID')}
                            </p>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleStartServing(ticket.id)}
                            >
                              <Phone className="mr-2 h-4 w-4" />
                              Mulai Pelayanan
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleSkipTicket(ticket.id)}
                            >
                              <SkipForward className="mr-2 h-4 w-4" />
                              Lewati
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Sedang Dilayani</h3>
                <div className="border rounded-md p-4 min-h-40">
                  {myServingTickets.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-12">
                      Tidak ada antrean yang sedang dilayani
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {myServingTickets.map((ticket) => (
                        <li key={ticket.id} className="p-3 bg-green-50 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-lg">Nomor {ticket.queue_number}</span>
                            {renderStatusBadge(ticket.status)}
                          </div>
                          <div className="text-sm mb-2">
                            <p>{ticket.categoryName}</p>
                            <p className="text-muted-foreground">
                              Mulai dilayani: {new Date(ticket.served_at || '').toLocaleTimeString('id-ID')}
                            </p>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button 
                              size="sm" 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleCompleteTicket(ticket.id)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Selesai
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Status Antrean</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-md">
                  <h4 className="text-sm text-blue-600 mb-1">Dipanggil</h4>
                  <p className="text-2xl font-bold text-blue-700">{displayData.called.length}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-md">
                  <h4 className="text-sm text-yellow-600 mb-1">Menunggu</h4>
                  <p className="text-2xl font-bold text-yellow-700">{displayData.waiting.length}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-md">
                  <h4 className="text-sm text-green-600 mb-1">Selesai</h4>
                  <p className="text-2xl font-bold text-green-700">{displayData.completed.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Render display view (for large displays in school)
  const renderDisplayView = () => {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-6">
            <CardTitle className="text-xl font-semibold text-primary text-center">
              SISTEM ANTREAN HELPDESK LURING
            </CardTitle>
            <CardDescription className="text-center">
              SMKN 1 KENDAL - PENERIMAAN MURID BARU 2025
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-center text-blue-600 flex items-center justify-center">
                  <Volume2 className="h-6 w-6 mr-2" />
                  SEDANG DIPANGGIL
                </h3>
                <div className="border-2 border-blue-200 rounded-md p-4 min-h-48 bg-blue-50">
                  {displayData.called.length === 0 ? (
                    <div className="text-center text-muted-foreground py-16 text-lg">
                      Tidak ada antrean yang sedang dipanggil
                    </div>
                  ) : (
                    <ScrollArea className="h-[250px]">
                      <ul className="space-y-3 px-2">
                        {displayData.called.map((ticket) => (
                          <li key={ticket.id} className="p-3 bg-white rounded-md border border-blue-200 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-xl text-blue-700">Nomor {ticket.queue_number}</span>
                                <p className="text-blue-600">{ticket.categoryName}</p>
                              </div>
                              <div className="text-right">
                                <span className="block font-medium text-lg">Loket</span>
                                <span className="block text-xl font-bold text-blue-700">{ticket.counterName}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-center text-green-600 flex items-center justify-center">
                  <Phone className="h-6 w-6 mr-2" />
                  SEDANG DILAYANI
                </h3>
                <div className="border-2 border-green-200 rounded-md p-4 min-h-48 bg-green-50">
                  {displayData.now_serving.length === 0 ? (
                    <div className="text-center text-muted-foreground py-16 text-lg">
                      Tidak ada antrean yang sedang dilayani
                    </div>
                  ) : (
                    <ScrollArea className="h-[250px]">
                      <ul className="space-y-3 px-2">
                        {displayData.now_serving.map((ticket) => (
                          <li key={ticket.id} className="p-3 bg-white rounded-md border border-green-200 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-xl text-green-700">Nomor {ticket.queue_number}</span>
                                <p className="text-green-600">{ticket.categoryName}</p>
                              </div>
                              <div className="text-right">
                                <span className="block font-medium text-lg">Loket</span>
                                <span className="block text-xl font-bold text-green-700">{ticket.counterName}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4 text-center text-yellow-600 flex items-center justify-center">
                <User className="h-6 w-6 mr-2" />
                ANTREAN MENUNGGU
              </h3>
              <div className="border-2 border-yellow-200 rounded-md p-4 bg-yellow-50">
                {displayData.waiting.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 text-lg">
                    Tidak ada antrean yang menunggu
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {displayData.waiting.map((ticket) => (
                      <div key={ticket.id} className="p-3 bg-white rounded-md text-center border border-yellow-200 shadow-sm">
                        <span className="font-bold text-xl text-yellow-700">{ticket.queue_number}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center mt-6">
              <div className="p-4 bg-blue-50 rounded-md border-2 border-blue-200">
                <p className="text-4xl font-bold text-blue-700">{displayData.called.length}</p>
                <h4 className="text-lg text-blue-600 mt-1">Dipanggil</h4>
              </div>
              <div className="p-4 bg-yellow-50 rounded-md border-2 border-yellow-200">
                <p className="text-4xl font-bold text-yellow-700">{displayData.waiting.length}</p>
                <h4 className="text-lg text-yellow-600 mt-1">Menunggu</h4>
              </div>
              <div className="p-4 bg-green-50 rounded-md border-2 border-green-200">
                <p className="text-4xl font-bold text-green-700">{displayData.now_serving.length}</p>
                <h4 className="text-lg text-green-600 mt-1">Dilayani</h4>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Helpdesk Luring</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sistem antrean pelayanan helpdesk tatap muka
            </p>
          </div>
        </div>
        
        <Tabs defaultValue={hasRole("helpdesk_offline") ? "operator" : "applicant"} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="applicant">Calon Murid</TabsTrigger>
            {hasRole("helpdesk_offline") && (
              <TabsTrigger value="operator">Operator</TabsTrigger>
            )}
            <TabsTrigger value="display">Tampilan Layar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applicant">
            {renderApplicantView()}
          </TabsContent>
          
          {hasRole("helpdesk_offline") && (
            <TabsContent value="operator">
              {renderOperatorView()}
            </TabsContent>
          )}
          
          <TabsContent value="display">
            {renderDisplayView()}
          </TabsContent>
        </Tabs>
        
        {/* Register Queue Dialog */}
        <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Daftar Antrean Helpdesk</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium">
                  Kategori Permasalahan
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih kategori permasalahan" />
                  </SelectTrigger>
                  <SelectContent>
                    {offlineCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-700">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                  <p>
                    Nomor antrean akan otomatis dibuat setelah Anda mendaftar. Silakan pantau nomor antrean Anda di halaman ini.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleRegister}>
                Daftar Antrean
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Confirm Registration Dialog */}
        <Dialog open={isConfirmRegisterDialogOpen} onOpenChange={setIsConfirmRegisterDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Pendaftaran</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="p-4 bg-primary/5 rounded-md mb-4">
                <h3 className="font-medium mb-2">Kategori Permasalahan:</h3>
                <p>{offlineCategories.find(c => c.id === selectedCategory)?.name}</p>
              </div>
              
              <p>Apakah Anda yakin ingin mendaftar antrean helpdesk luring?</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmRegisterDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleConfirmRegister}>
                Ya, Daftar Sekarang
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default OfflineHelpdesk;

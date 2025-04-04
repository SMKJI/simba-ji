
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Clock, User, Users } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { HelpdeskCounter, QueueTicket, TicketCategory } from '@/types/supabase';

// Additional type to help with type safety
interface CounterWithOperator extends HelpdeskCounter {
  operators?: any; // Just to ensure compatibility
}

const OfflineHelpdesk = () => {
  const { 
    fetchHelpdeskCounters, 
    fetchQueueTickets, 
    fetchTicketCategories,
    createQueueTicket,
    callNextInQueue,
    skipQueueTicket,
    completeQueueTicket,
    currentUser,
    hasRole
  } = useRegistrations();
  
  const [counters, setCounters] = useState<CounterWithOperator[]>([]);
  const [queueTickets, setQueueTickets] = useState<QueueTicket[]>([]);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [userTicket, setUserTicket] = useState<QueueTicket | null>(null);
  const [activeCounter, setActiveCounter] = useState<HelpdeskCounter | null>(null);
  const [currentTicket, setCurrentTicket] = useState<QueueTicket | null>(null);
  const [waitingCount, setWaitingCount] = useState(0);
  
  // Fetch data on load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Fetch all necessary data
        const fetchedCounters = await fetchHelpdeskCounters();
        const fetchedTickets = await fetchQueueTickets();
        const fetchedCategories = await fetchTicketCategories();
        
        setCounters(fetchedCounters);
        setQueueTickets(fetchedTickets);
        setCategories(fetchedCategories.filter(c => c.is_offline));
        
        // Find user ticket if logged in
        if (currentUser) {
          const ticket = fetchedTickets.find(t => 
            t.user_id === currentUser.id && 
            (t.status === 'waiting' || t.status === 'called' || t.status === 'serving')
          );
          setUserTicket(ticket || null);
        }
        
        // Find operator's active counter if user is an operator
        if (hasRole(['helpdesk_offline', 'admin'])) {
          const counter = fetchedCounters.find(c => 
            c.operator_id === (currentUser?.id || '')
          );
          setActiveCounter(counter || null);
          
          // Find current ticket being served
          if (counter) {
            const ticket = fetchedTickets.find(t => 
              t.counter_id === counter.id && 
              (t.status === 'called' || t.status === 'serving')
            );
            setCurrentTicket(ticket || null);
          }
        }
        
        // Count waiting tickets
        const waiting = fetchedTickets.filter(t => t.status === 'waiting').length;
        setWaitingCount(waiting);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Refresh data every 15 seconds
    const interval = setInterval(() => {
      loadData();
    }, 15000);
    
    return () => clearInterval(interval);
  }, [fetchHelpdeskCounters, fetchQueueTickets, fetchTicketCategories, currentUser, hasRole]);
  
  // Handle queue ticket creation
  const handleCreateTicket = async () => {
    if (!selectedCategory) {
      alert('Silakan pilih kategori layanan terlebih dahulu');
      return;
    }
    
    setLoading(true);
    const result = await createQueueTicket(selectedCategory);
    if (result.success && result.ticket) {
      setUserTicket(result.ticket);
      // Refresh queue data
      const tickets = await fetchQueueTickets();
      setQueueTickets(tickets);
      setWaitingCount(tickets.filter(t => t.status === 'waiting').length);
    } else {
      alert(result.error || 'Gagal membuat tiket antrean');
    }
    setLoading(false);
  };
  
  // Handle calling next person in queue
  const handleCallNext = async () => {
    if (!activeCounter) return;
    
    setLoading(true);
    const result = await callNextInQueue(activeCounter.id);
    if (result.success && result.ticket) {
      setCurrentTicket(result.ticket);
      // Refresh queue data
      const tickets = await fetchQueueTickets();
      setQueueTickets(tickets);
      setWaitingCount(tickets.filter(t => t.status === 'waiting').length);
    } else if (result.error) {
      alert(result.error);
    }
    setLoading(false);
  };
  
  // Handle skipping current ticket
  const handleSkipTicket = async () => {
    if (!currentTicket) return;
    
    if (!window.confirm('Apakah Anda yakin ingin melewati antrean ini?')) {
      return;
    }
    
    setLoading(true);
    const result = await skipQueueTicket(currentTicket.id);
    if (result.success) {
      setCurrentTicket(null);
      // Refresh queue data
      const tickets = await fetchQueueTickets();
      setQueueTickets(tickets);
      setWaitingCount(tickets.filter(t => t.status === 'waiting').length);
    } else {
      alert(result.error || 'Gagal melewati antrean');
    }
    setLoading(false);
  };
  
  // Handle completing current ticket
  const handleCompleteTicket = async () => {
    if (!currentTicket) return;
    
    if (!window.confirm('Apakah Anda yakin ingin menyelesaikan pelayanan ini?')) {
      return;
    }
    
    setLoading(true);
    const result = await completeQueueTicket(currentTicket.id);
    if (result.success) {
      setCurrentTicket(null);
      // Refresh queue data
      const tickets = await fetchQueueTickets();
      setQueueTickets(tickets);
      setWaitingCount(tickets.filter(t => t.status === 'waiting').length);
    } else {
      alert(result.error || 'Gagal menyelesaikan antrean');
    }
    setLoading(false);
  };
  
  // Render different views based on user role
  const renderContent = () => {
    // Loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    // If user is helpdesk_offline or admin
    if (hasRole(['helpdesk_offline', 'admin'])) {
      return renderOperatorView();
    }
    
    // For regular users
    return renderUserView();
  };
  
  // Render view for helpdesk operators
  const renderOperatorView = () => {
    // If operator is not assigned to any counter
    if (!activeCounter) {
      return (
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layanan Helpdesk Tatap Muka</CardTitle>
              <CardDescription>Anda belum ditugaskan ke loket manapun</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Mohon hubungi administrator untuk ditugaskan ke loket pelayanan.</p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {counters.map((counter) => (
              <Card key={counter.id} className={`shadow-sm ${counter.is_active ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50/50'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{counter.name}</CardTitle>
                    {counter.is_active ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">Aktif</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">Tidak Aktif</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="mr-2 h-4 w-4" />
                    <span>
                      {counter.operatorName ? counter.operatorName : 'Tidak ada petugas'}
                    </span>
                  </div>
                  {/* Safely check for operators array */}
                  {counter.operators && counter.operators.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {counter.operators[0].is_offline ? 'Petugas Offline' : 'Petugas Online'}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }
    
    // If operator is assigned to a counter
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-primary">{activeCounter.name}</CardTitle>
                <Badge className="bg-green-100 text-green-800">Aktif</Badge>
              </div>
              <CardDescription>
                Petugas: {currentUser?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-amber-500" />
                  <span>Menunggu</span>
                </div>
                <Badge variant="outline" className="text-amber-600">
                  {waitingCount}
                </Badge>
              </div>
              
              {currentTicket ? (
                <div className="border rounded-lg p-4 bg-green-50/50">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-gray-500">Melayani Nomor</div>
                    <Badge className={
                      currentTicket.status === 'called' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-green-100 text-green-800'
                    }>
                      {currentTicket.status === 'called' ? 'Dipanggil' : 'Dilayani'}
                    </Badge>
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {currentTicket.queue_number}
                  </div>
                  <div className="text-sm mb-3">
                    <span className="font-medium">Kategori:</span> {currentTicket.categoryName}
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1" 
                      onClick={handleCompleteTicket}
                      variant="default"
                    >
                      Selesai
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={handleSkipTicket}
                      variant="outline"
                    >
                      Lewati
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-muted-foreground mb-3">
                    Tidak ada antrian yang sedang dilayani
                  </p>
                  <Button onClick={handleCallNext} disabled={waitingCount === 0}>
                    Panggil Berikutnya
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Antrian Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-auto">
              {queueTickets.filter(t => 
                t.created_at.startsWith(new Date().toISOString().split('T')[0])
              ).length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  Belum ada antrian hari ini
                </p>
              ) : (
                <div className="space-y-2">
                  {queueTickets
                    .filter(t => t.created_at.startsWith(new Date().toISOString().split('T')[0]))
                    .sort((a, b) => a.queue_number - b.queue_number)
                    .map((ticket) => (
                      <div 
                        key={ticket.id} 
                        className={`p-3 border rounded-md flex justify-between items-center ${
                          ticket.status === 'waiting' ? 'bg-gray-50' :
                          ticket.status === 'called' ? 'bg-amber-50 border-amber-200' :
                          ticket.status === 'serving' ? 'bg-green-50 border-green-200' :
                          ticket.status === 'completed' ? 'bg-blue-50 border-blue-200' :
                          'bg-gray-100 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                            {ticket.queue_number}
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {ticket.categoryName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(ticket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          className={
                            ticket.status === 'waiting' ? 'bg-yellow.100 text-yellow-800 border-yellow-300' :
                            ticket.status === 'called' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            ticket.status === 'serving' ? 'bg-green.100 text-green-800 border-green-300' :
                            ticket.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            'bg-gray-100 text-gray-800 border-gray-300'
                          }
                        >
                          {ticket.status === 'waiting' ? 'Menunggu' :
                          ticket.status === 'called' ? 'Dipanggil' :
                          ticket.status === 'serving' ? 'Dilayani' :
                          ticket.status === 'completed' ? 'Selesai' : 'Dilewati'}
                        </Badge>
                      </div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  // Render view for regular users
  const renderUserView = () => {
    // If user already has a ticket
    if (userTicket) {
      return (
        <div className="max-w-lg mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center border-b bg-primary/5">
              <CardTitle className="text-2xl">Nomor Antrean Anda</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="text-8xl font-bold text-primary my-6">
                  {userTicket.queue_number}
                </div>
                
                <div className="w-full flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                    <Clock className="inline mr-1 h-4 w-4" />
                    {new Date(userTicket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <Badge 
                    className={
                      userTicket.status === 'waiting' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      userTicket.status === 'called' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      'bg-green-100 text-green-800 border-green-300'
                    }
                  >
                    {userTicket.status === 'waiting' ? 'Menunggu' :
                     userTicket.status === 'called' ? 'Dipanggil' :
                     'Sedang Dilayani'}
                  </Badge>
                </div>
                
                <div className="w-full space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Kategori:</span>
                    <span className="font-medium">{userTicket.categoryName}</span>
                  </div>
                  
                  {userTicket.counter_id && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Loket:</span>
                      <span className="font-medium">{userTicket.counterName}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Antrian Sebelum Anda:</span>
                    <span className="font-medium">
                      {queueTickets.filter(t => 
                        t.status === 'waiting' && 
                        t.queue_number < userTicket.queue_number
                      ).length}
                    </span>
                  </div>
                </div>
                
                {userTicket.status === 'called' && (
                  <div className="w-full bg-blue-50 text-blue-800 p-4 rounded-lg mb-4 text-center">
                    <p className="font-semibold">Nomor Anda dipanggil!</p>
                    <p className="text-sm mt-1">Silakan menuju ke {userTicket.counterName}</p>
                  </div>
                )}
                
                <div className="text-center text-sm text-muted-foreground">
                  <Clock className="inline-block mr-1 h-4 w-4" />
                  Mohon tetap berada di lokasi dan perhatikan panggilan
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Status Antrian Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Menunggu</span>
                  </div>
                  <span>{queueTickets.filter(t => t.status === 'waiting').length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Dipanggil</span>
                  </div>
                  <span>{queueTickets.filter(t => t.status === 'called').length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Sedang Dilayani</span>
                  </div>
                  <span>{queueTickets.filter(t => t.status === 'serving').length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                    <span>Selesai</span>
                  </div>
                  <span>{queueTickets.filter(t => t.status === 'completed' || t.status === 'skipped').length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    // If user does not have a ticket
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center border-b bg-primary/5">
            <CardTitle className="text-2xl">Pendaftaran Antrean Helpdesk</CardTitle>
            <CardDescription>
              Silakan pilih kategori layanan yang Anda butuhkan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {!currentUser ? (
              <div className="text-center py-6">
                <p className="mb-4">Anda perlu masuk terlebih dahulu untuk mengambil nomor antrean</p>
                <Button 
                  onClick={() => window.location.href = '/login'}
                  className="mx-auto"
                >
                  Masuk <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedCategory === category.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-start mb-2">
                        <div className={`w-5 h-5 rounded-full mr-2 mt-0.5 flex items-center justify-center ${
                          selectedCategory === category.id 
                            ? 'bg-primary text-white' 
                            : 'border border-gray-300'
                        }`}>
                          {selectedCategory === category.id && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <div className="font-medium">{category.name}</div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground ml-7">{category.description}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-6">
                  <Button 
                    size="lg" 
                    onClick={handleCreateTicket}
                    disabled={!selectedCategory || loading}
                    className="px-8"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent rounded-full inline-block"></span>
                        Memproses...
                      </>
                    ) : (
                      'Ambil Nomor Antrean'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col bg-muted/20 px-6 py-4 text-sm text-muted-foreground">
            <div className="flex justify-between w-full mb-2">
              <span>Jumlah antrean saat ini:</span>
              <span className="font-medium">{waitingCount} orang</span>
            </div>
            <div className="flex justify-between w-full">
              <span>Estimasi waktu tunggu:</span>
              <span className="font-medium">± {Math.ceil(waitingCount * 10 / Math.max(counters.filter(c => c.is_active).length, 1))} menit</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Helpdesk Tatap Muka</h1>
          <p className="text-muted-foreground mt-1">
            Layanan tatap muka untuk permasalahan PPDB SMKN 1 Kendal
          </p>
        </div>
        
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default OfflineHelpdesk;

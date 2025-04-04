import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, Users, ArrowRight } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { QueueTicket, HelpdeskOperator } from '@/types/supabase';

export const QueueDisplay = () => {
  const { 
    fetchQueueTickets, 
    queueTickets, 
    currentUser, 
    fetchDailyCapacity,
    dailyCapacities,
    loading 
  } = useRegistrations();
  const navigate = useNavigate();
  
  const [myTicket, setMyTicket] = useState<QueueTicket | null>(null);
  const [todayCapacity, setTodayCapacity] = useState<{ offline: number, online: number } | null>(null);
  const [todayStats, setTodayStats] = useState<{ 
    waiting: number, 
    called: number, 
    serving: number, 
    completed: number 
  }>({
    waiting: 0,
    called: 0,
    serving: 0,
    completed: 0
  });
  
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchQueueTickets(),
        fetchDailyCapacity()
      ]);
    };
    
    loadData();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchQueueTickets();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchQueueTickets, fetchDailyCapacity]);
  
  // Update ticket stats when queue tickets change
  useEffect(() => {
    if (currentUser) {
      // Find user's active ticket
      const userTicket = queueTickets.find(t => 
        t.user_id === currentUser.id && 
        ['waiting', 'called', 'serving'].includes(t.status)
      );
      setMyTicket(userTicket || null);
    }
    
    // Count today's tickets by status
    const today = new Date().toISOString().split('T')[0];
    const todayTickets = queueTickets.filter(t => t.created_at.startsWith(today));
    
    setTodayStats({
      waiting: todayTickets.filter(t => t.status === 'waiting').length,
      called: todayTickets.filter(t => t.status === 'called').length,
      serving: todayTickets.filter(t => t.status === 'serving').length,
      completed: todayTickets.filter(t => 
        t.status === 'completed' || t.status === 'skipped'
      ).length
    });
  }, [queueTickets, currentUser]);
  
  // Get today's capacity when dailyCapacities change
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const capacity = dailyCapacities.find(cap => cap.date.startsWith(today));
    
    if (capacity) {
      setTodayCapacity({
        offline: capacity.offline_capacity,
        online: capacity.online_capacity
      });
    } else {
      setTodayCapacity({
        offline: 30, // Default values
        online: 50
      });
    }
  }, [dailyCapacities]);
  
  // Navigate to offline helpdesk page
  const navigateToOfflineHelpdesk = () => {
    navigate('/offline-helpdesk');
  };
  
  // Get capacity usage percentage
  const getCapacityPercentage = () => {
    if (!todayCapacity) return 0;
    
    const totalTickets = todayStats.waiting + todayStats.called + 
                        todayStats.serving + todayStats.completed;
    return Math.min(Math.round((totalTickets / todayCapacity.offline) * 100), 100);
  };
  
  // Get status class
  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  if (loading) {
    return (
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="text-xl font-semibold text-primary">
            Helpdesk Tatap Muka
          </CardTitle>
          <CardDescription>
            Layanan bantuan tatap muka melalui sistem antrean loket
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Helpdesk Tatap Muka
            </CardTitle>
            <CardDescription>
              Layanan bantuan tatap muka melalui sistem antrean loket
            </CardDescription>
          </div>
          <Button onClick={navigateToOfflineHelpdesk}>
            {myTicket ? 'Lihat Status Antrean' : 'Daftar Antrean'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-6">
              {myTicket ? (
                <div className="border rounded-lg p-4 bg-primary/5">
                  <h3 className="text-lg font-medium mb-2">Nomor Antrean Anda</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-primary">{myTicket.queue_number}</div>
                    <Badge 
                      className={
                        myTicket.status === 'waiting' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                        myTicket.status === 'called' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        'bg-green-100 text-green-800 border-green-300'
                      }
                    >
                      {myTicket.status === 'waiting' ? 'Menunggu' :
                       myTicket.status === 'called' ? 'Dipanggil' :
                       'Sedang Dilayani'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm">Kategori: {myTicket.categoryName}</p>
                  
                  {myTicket.counter_id && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md text-blue-800">
                      <p className="font-medium">Anda telah dipanggil!</p>
                      <p className="text-sm mt-1">Silakan menuju ke {myTicket.counterName}</p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={navigateToOfflineHelpdesk}
                  >
                    Lihat Detail Antrean
                  </Button>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Daftar Antrean Bantuan</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Daftar antrean untuk mendapatkan bantuan tatap muka di loket helpdesk SMKN 1 Kendal.
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={navigateToOfflineHelpdesk}
                  >
                    Daftar Antrean Sekarang
                  </Button>
                </div>
              )}
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Kategori Bantuan Tatap Muka</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary mr-2 mt-0.5">1</span>
                    <span>Kendala Pembuatan Akun PMB (Registrasi Resmi dari Dinas Pendidikan Provinsi Jawa Tengah)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary mr-2 mt-0.5">2</span>
                    <span>Verifikasi dan aktivasi akun</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary mr-2 mt-0.5">3</span>
                    <span>Pencabutan berkas dan daftar ulang</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Status Antrean Hari Ini</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>Menunggu</span>
                  </div>
                  <span className="font-medium">{todayStats.waiting}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <AlertTriangle className="mr-2 h-4 w-4 text-blue-500" />
                    <span>Dipanggil</span>
                  </div>
                  <span className="font-medium">{todayStats.called}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-green-500" />
                    <span>Sedang Dilayani</span>
                  </div>
                  <span className="font-medium">{todayStats.serving}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Selesai</span>
                  </div>
                  <span className="font-medium">{todayStats.completed}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-primary" />
                    <span>Kapasitas Terpakai</span>
                  </div>
                  <span className={`font-medium ${getStatusColor(getCapacityPercentage())}`}>
                    {getCapacityPercentage()}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${
                      getCapacityPercentage() >= 90 ? 'bg-red-500' :
                      getCapacityPercentage() >= 70 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${getCapacityPercentage()}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  {todayCapacity && (
                    `${todayStats.waiting + todayStats.called + todayStats.serving + todayStats.completed} dari ${todayCapacity.offline} kuota hari ini`
                  )}
                </p>
              </div>
              
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={navigateToOfflineHelpdesk}
              >
                Lihat Tampilan Antrean
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

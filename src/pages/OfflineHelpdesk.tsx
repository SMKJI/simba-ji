import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/Shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useCounters } from '@/hooks/useCounters';
import { useQueue } from '@/hooks/useQueue';
import { Counter } from '@/types/counter';

const OfflineHelpdesk = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { counters, loading: countersLoading } = useCounters();
  const { currentTicket, callNextTicket, completeTicket, skipTicket } = useQueue();
  const [selectedCounter, setSelectedCounter] = useState<Counter | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'helpdesk_offline' && user.role !== 'admin') {
      toast({
        title: 'Akses Ditolak',
        description: 'Anda tidak memiliki akses ke halaman ini.',
        variant: 'destructive',
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);

  useEffect(() => {
    if (user && counters) {
      const userCounter = counters.find(counter => 
        counter.operators && counter.operators.some(op => op.id === user.id)
      );
      if (userCounter) {
        setSelectedCounter(userCounter);
      }
    }
  }, [user, counters]);

  const handleCallNext = async () => {
    if (!selectedCounter) {
      toast({
        title: 'Error',
        description: 'Anda belum memilih loket.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await callNextTicket(selectedCounter.id);
      toast({
        title: 'Sukses',
        description: 'Berhasil memanggil antrian berikutnya.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memanggil antrian berikutnya.',
        variant: 'destructive',
      });
    }
  };

  const handleComplete = async () => {
    if (!currentTicket) {
      toast({
        title: 'Error',
        description: 'Tidak ada antrian yang sedang dilayani.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await completeTicket(currentTicket.id);
      toast({
        title: 'Sukses',
        description: 'Berhasil menyelesaikan antrian.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menyelesaikan antrian.',
        variant: 'destructive',
      });
    }
  };

  const handleSkip = async () => {
    if (!currentTicket) {
      toast({
        title: 'Error',
        description: 'Tidak ada antrian yang sedang dilayani.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await skipTicket(currentTicket.id);
      toast({
        title: 'Sukses',
        description: 'Berhasil melewati antrian.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal melewati antrian.',
        variant: 'destructive',
      });
    }
  };

  if (countersLoading) {
    return (
      <Shell>
        <div className="container py-10">
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Helpdesk Offline</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Loket Anda</CardTitle>
                <CardDescription>
                  Informasi loket yang Anda layani
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCounter ? (
                  <div>
                    <h3 className="font-semibold text-lg">{selectedCounter.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{selectedCounter.description}</p>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-1">Operator:</h4>
                      {selectedCounter.operators && selectedCounter.operators.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedCounter.operators.map(op => (
                            <Badge key={op.id} variant="outline" className="bg-green-50">
                              {op.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Tidak ada operator</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-yellow-600">
                    Anda belum ditugaskan ke loket manapun. Hubungi administrator.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Antrian Saat Ini</CardTitle>
                <CardDescription>
                  Kelola antrian yang sedang Anda layani
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentTicket ? (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">Nomor: {currentTicket.number}</h3>
                        <p className="text-sm text-gray-500">
                          {currentTicket.applicant?.name || 'Nama tidak tersedia'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          ID: {currentTicket.id}
                        </p>
                      </div>
                      <Badge 
                        className={
                          currentTicket.status === 'serving' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {currentTicket.status === 'serving' ? 'Sedang Dilayani' : 'Dipanggil'}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium mb-2">Keperluan:</h4>
                      <p className="text-sm">{currentTicket.purpose || 'Tidak ada keterangan'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada antrian yang sedang dilayani</p>
                    <p className="text-sm text-gray-400 mt-1">Klik tombol "Panggil Berikutnya" untuk memanggil antrian</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button 
                  onClick={handleCallNext} 
                  disabled={!selectedCounter}
                  className="w-full sm:w-auto"
                >
                  Panggil Berikutnya
                </Button>
                {currentTicket && (
                  <>
                    <Button 
                      onClick={handleSkip} 
                      variant="outline" 
                      className="w-full sm:w-auto"
                    >
                      Lewati
                    </Button>
                    <Button 
                      onClick={handleComplete} 
                      variant="default" 
                      className="w-full sm:w-auto"
                    >
                      Selesai
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default OfflineHelpdesk;

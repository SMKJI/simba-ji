
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageTitle from '@/components/ui/PageTitle';
import TicketList from '@/components/TicketList';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentHelpdesk = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authenticated, currentUser, loading, hasRole, getUserTickets } = useRegistrations();
  const [activeTab, setActiveTab] = useState('open');
  
  const tickets = getUserTickets();
  const openTickets = tickets.filter(ticket => ticket.status !== 'closed');
  const closedTickets = tickets.filter(ticket => ticket.status === 'closed');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Make sure the session is stable before checking authentication
    if (loading) return;
    
    if (!authenticated) {
      toast({
        title: "Akses Ditolak",
        description: "Anda perlu masuk untuk mengakses halaman ini",
        variant: "destructive"
      });
      navigate('/login', { state: { from: '/helpdesk-siswa' } });
    } else if (!hasRole('applicant')) {
      // Redirect non-students to the regular helpdesk
      navigate('/helpdesk');
    }
  }, [authenticated, navigate, loading, hasRole, toast]);

  // Don't render anything while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] sm:min-h-[50vh]">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Also don't render if not authenticated
  if (!authenticated || !currentUser) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle 
          title="Bantuan Helpdesk" 
          description="Kirim pertanyaan atau kendala Anda kepada tim bantuan kami"
        />
        
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden mt-6">
          <CardHeader className="bg-primary/5 border-b p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-primary flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Bantuan Helpdesk
                </CardTitle>
                <CardDescription>
                  Tim helpdesk kami siap membantu Anda dengan pertanyaan seputar pendaftaran
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs defaultValue="open" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="open" className="text-center">
                  Tiket Aktif ({openTickets.length})
                </TabsTrigger>
                <TabsTrigger value="closed" className="text-center">
                  Tiket Selesai ({closedTickets.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="open" className="mt-0">
                <div className="mt-2">
                  <TicketList />
                </div>
              </TabsContent>
              
              <TabsContent value="closed" className="mt-0">
                {closedTickets.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Berikut adalah tiket yang telah selesai ditangani oleh tim helpdesk:
                    </p>
                    <TicketList />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium text-lg mb-2">Belum ada tiket selesai</h3>
                    <p className="text-muted-foreground mb-4">
                      Anda belum memiliki tiket yang telah diselesaikan.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentHelpdesk;

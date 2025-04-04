
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageTitle from '@/components/ui/PageTitle';
import DashboardHome from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import GroupJoinConfirmation from '@/components/GroupJoinConfirmation';
import TicketList from '@/components/TicketList';
import DashboardInfoPanel from '@/components/dashboard/DashboardInfoPanel';
import DashboardAnnouncements from '@/components/dashboard/DashboardAnnouncements';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueueDisplay } from '@/components/helpdesk/QueueDisplay';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stats, loading, currentUser, authenticated, fetchStats } = useRegistrations();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch fresh stats
    fetchStats();
    
    // Make sure the session is stable before checking authentication
    if (loading) return;
    
    if (!authenticated) {
      toast({
        title: "Akses Ditolak",
        description: "Anda perlu masuk untuk mengakses halaman ini",
        variant: "destructive"
      });
      navigate('/login', { state: { from: '/dashboard' } });
    } else {
      // Welcome message
      toast({
        title: `Selamat Datang, ${currentUser?.name}`,
        description: "Selamat datang di dashboard Anda"
      });
    }
  }, [authenticated, navigate, loading, currentUser, toast, fetchStats]);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-0">
        <PageTitle 
          title={`Selamat Datang, ${currentUser.name}`}
          description="Panel dashboard penjaringan awal calon murid baru SMKN 1 Kendal"
        />

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start flex-wrap">
            <TabsTrigger value="overview">Beranda</TabsTrigger>
            <TabsTrigger value="group">Grup WhatsApp</TabsTrigger>
            <TabsTrigger value="helpdesk">Bantuan Online</TabsTrigger>
            <TabsTrigger value="offline-helpdesk">Bantuan Tatap Muka</TabsTrigger>
            <TabsTrigger value="info">Informasi PPDB</TabsTrigger>
            <TabsTrigger value="announcements">Pengumuman</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <DashboardHome stats={stats} loading={loading} />
          </TabsContent>
          
          <TabsContent value="group" className="mt-0">
            <GroupJoinConfirmation />
          </TabsContent>
          
          <TabsContent value="helpdesk" className="mt-0">
            <TicketList />
          </TabsContent>
          
          <TabsContent value="offline-helpdesk" className="mt-0">
            <QueueDisplay />
          </TabsContent>
          
          <TabsContent value="info" className="mt-0">
            <DashboardInfoPanel />
          </TabsContent>
          
          <TabsContent value="announcements" className="mt-0">
            <DashboardAnnouncements />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

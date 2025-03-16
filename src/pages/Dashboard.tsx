
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageTitle from '@/components/ui/PageTitle';
import Dashboard from '@/components/Dashboard';
import { Loader2 } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import GroupJoinConfirmation from '@/components/GroupJoinConfirmation';
import TicketList from '@/components/TicketList';
import DashboardInfoPanel from '@/components/dashboard/DashboardInfoPanel';
import DashboardAnnouncements from '@/components/dashboard/DashboardAnnouncements';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stats, loading, currentUser, authenticated } = useRegistrations();
  const [activeTab, setActiveTab] = useState('overview');

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
      navigate('/login', { state: { from: '/dashboard' } });
    } else {
      // Welcome message
      toast({
        title: `Selamat Datang, ${currentUser?.name}`,
        description: "Selamat datang di dashboard Anda"
      });
    }
  }, [authenticated, navigate, loading, currentUser, toast]);

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

        {/* Mobile tab selector - visible on small screens */}
        <div className="md:hidden mb-6">
          <select 
            className="w-full p-2 border rounded-md bg-white text-sm"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="overview">Informasi Umum</option>
            <option value="group">Grup WhatsApp</option>
            <option value="info">Informasi PPDB</option>
            <option value="announcements">Pengumuman</option>
            <option value="helpdesk">Bantuan Helpdesk</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Sidebar - hidden on mobile, now using the global sidebar instead */}
          <div className="hidden">
            {/* Old sidebar code removed since we now use the global sidebar */}
          </div>

          <div className="md:col-span-4">
            {activeTab === 'overview' && (
              <Dashboard stats={stats} loading={loading} />
            )}
            
            {activeTab === 'group' && (
              <GroupJoinConfirmation />
            )}
            
            {activeTab === 'helpdesk' && (
              <TicketList />
            )}
            
            {activeTab === 'info' && (
              <DashboardInfoPanel />
            )}
            
            {activeTab === 'announcements' && (
              <DashboardAnnouncements />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

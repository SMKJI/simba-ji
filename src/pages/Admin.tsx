
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCards from '@/components/admin/StatCards';
import ApplicantsTable from '@/components/admin/ApplicantsTable';
import StatsPanel from '@/components/admin/StatsPanel';
import GroupsManager from '@/components/admin/GroupsManager';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Group } from '@/types/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import OperatorManagement from '@/components/helpdesk/OperatorManagement';
import CounterManagement from '@/components/helpdesk/CounterManagement';
import CapacityManagement from '@/components/helpdesk/CapacityManagement';

const Admin = () => {
  const { toast } = useToast();
  const { 
    stats, 
    getApplicants, 
    updateUserRole, 
    fetchStats,
    fetchHelpdeskOperators,
    fetchHelpdeskCounters,
    fetchDailyCapacity,
    loading
  } = useRegistrations();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load all data
    const loadData = async () => {
      await fetchStats();
      await fetchHelpdeskOperators();
      await fetchHelpdeskCounters();
      await fetchDailyCapacity();
      
      // Load applicants separately since it's a heavy operation
      setLoadingApplicants(true);
      const applicantsData = await getApplicants();
      setApplicants(applicantsData);
      setLoadingApplicants(false);
    };
    
    loadData();
    
    // Welcome message for admin
    toast({
      title: "Panel Admin",
      description: "Selamat datang di panel administrasi"
    });
  }, [toast, fetchStats, fetchHelpdeskOperators, fetchHelpdeskCounters, fetchDailyCapacity, getApplicants]);

  // Function to update a user's role to helpdesk
  const handlePromoteToHelpdesk = async (userId: string) => {
    const success = await updateUserRole(userId, 'helpdesk');
    
    if (success) {
      toast({
        title: "Berhasil",
        description: "Pengguna telah dipromosikan menjadi Helpdesk"
      });
      
      // Refresh applicants list
      const applicantsData = await getApplicants();
      setApplicants(applicantsData);
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat mempromosikan pengguna",
        variant: "destructive"
      });
    }
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
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold">Panel Admin</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Kelola pendaftaran, grup WhatsApp, dan data pendaftar
          </p>
        </div>

        <StatCards stats={stats} />

        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            <Tabs defaultValue="applicants" className="w-full">
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="applicants" className="text-xs sm:text-sm">Pendaftar</TabsTrigger>
                <TabsTrigger value="groups" className="text-xs sm:text-sm">Grup WhatsApp</TabsTrigger>
                <TabsTrigger value="helpdesk" className="text-xs sm:text-sm">Manajemen Helpdesk</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs sm:text-sm">Statistik</TabsTrigger>
              </TabsList>
              
              <TabsContent value="applicants">
                <ApplicantsTable 
                  applicants={applicants} 
                  loading={loadingApplicants}
                  onPromoteToHelpdesk={handlePromoteToHelpdesk}
                />
              </TabsContent>
              
              <TabsContent value="groups">
                <GroupsManager groups={stats.groups} />
              </TabsContent>
              
              <TabsContent value="helpdesk">
                <Tabs defaultValue="operators" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="operators">Operator</TabsTrigger>
                    <TabsTrigger value="counters">Loket</TabsTrigger>
                    <TabsTrigger value="capacity">Kapasitas Harian</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="operators">
                    <OperatorManagement />
                  </TabsContent>
                  
                  <TabsContent value="counters">
                    <CounterManagement />
                  </TabsContent>
                  
                  <TabsContent value="capacity">
                    <CapacityManagement />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="stats">
                <StatsPanel />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </DashboardLayout>
  );
};

export default Admin;

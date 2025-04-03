
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCards from '@/components/admin/StatCards';
import ApplicantsTable from '@/components/admin/ApplicantsTable';
import StatsPanel from '@/components/admin/StatsPanel';
import GroupsManager from '@/components/admin/GroupsManager';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Group } from '@/types/supabase';

const Admin = () => {
  const { toast } = useToast();
  const { stats, getApplicants, updateApplicant, deleteApplicant, resetUserPassword, updateUserRole } = useRegistrations();
  const applicants = getApplicants();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Welcome message for admin
    toast({
      title: "Panel Admin",
      description: "Selamat datang di panel administrasi"
    });
  }, [toast]);

  // Create a wrapper function to match the expected signature
  const handlePromoteToHelpdesk = (userId: string) => {
    const success = updateUserRole(userId, 'helpdesk');
    
    if (success) {
      toast({
        title: "Berhasil",
        description: "Pengguna telah dipromosikan menjadi Helpdesk"
      });
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat mempromosikan pengguna",
        variant: "destructive"
      });
    }
  };

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

        <div className="overflow-x-auto">
          <Tabs defaultValue="applicants" className="w-full">
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="applicants" className="text-xs sm:text-sm">Pendaftar</TabsTrigger>
              <TabsTrigger value="groups" className="text-xs sm:text-sm">Grup WhatsApp</TabsTrigger>
              <TabsTrigger value="stats" className="text-xs sm:text-sm">Statistik</TabsTrigger>
            </TabsList>
            
            <TabsContent value="applicants">
              <ApplicantsTable 
                applicants={applicants} 
                onPromoteToHelpdesk={handlePromoteToHelpdesk}
              />
            </TabsContent>
            
            <TabsContent value="groups">
              <GroupsManager groups={stats.groups as unknown as Group[]} />
            </TabsContent>
            
            <TabsContent value="stats">
              <StatsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;

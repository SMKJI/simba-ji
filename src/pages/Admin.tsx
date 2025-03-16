
import { useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCards from '@/components/admin/StatCards';
import ApplicantsTable from '@/components/admin/ApplicantsTable';
import StatsPanel from '@/components/admin/StatsPanel';
import GroupsManager from '@/components/admin/GroupsManager';
import { useRegistrations } from '@/hooks/useRegistrations';

const Admin = () => {
  const { stats, getApplicants, updateApplicant, deleteApplicant, resetUserPassword, updateUserRole } = useRegistrations();
  const applicants = getApplicants();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Create a wrapper function to match the expected signature
  const handlePromoteToHelpdesk = (userId: string) => {
    updateUserRole(userId, 'helpdesk');
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
              <GroupsManager groups={stats.groups} />
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="grid gap-4">
                <StatsPanel />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;

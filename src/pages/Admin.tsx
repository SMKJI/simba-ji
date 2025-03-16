
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Panel Admin</h1>
          <p className="text-muted-foreground">
            Kelola pendaftaran, grup WhatsApp, dan data pendaftar
          </p>
        </div>

        <StatCards stats={stats} />

        <Tabs defaultValue="applicants">
          <TabsList className="mb-4">
            <TabsTrigger value="applicants">Pendaftar</TabsTrigger>
            <TabsTrigger value="groups">Grup WhatsApp</TabsTrigger>
            <TabsTrigger value="stats">Statistik</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applicants">
            <ApplicantsTable 
              applicants={applicants} 
              onPromoteToHelpdesk={updateUserRole}
            />
          </TabsContent>
          
          <TabsContent value="groups">
            <GroupsManager groups={stats.groups} />
          </TabsContent>
          
          <TabsContent value="stats">
            <StatsPanel stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Admin;

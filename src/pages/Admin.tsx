
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRegistrations } from '@/hooks/useRegistrations';
import StatCards from '@/components/admin/StatCards';
import ApplicantsTable from '@/components/admin/ApplicantsTable';
import GroupsManager from '@/components/admin/GroupsManager';
import StatsPanel from '@/components/admin/StatsPanel';

// Mock data for the applicants list
const MOCK_APPLICANTS = Array.from({ length: 25 }).map((_, i) => ({
  id: (i + 1000000).toString(),
  name: `Calon Murid ${i + 1}`,
  email: `calon${i + 1}@example.com`,
  phone: `08123456${i.toString().padStart(4, '0')}`,
  group: `Grup ${Math.floor(i / 10) + 1}`,
  registeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

const Admin = () => {
  const { stats, loading } = useRegistrations();
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
        
        <StatCards stats={stats} />
        
        <Tabs defaultValue="applicants" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="applicants" className="text-base">Daftar Pendaftar</TabsTrigger>
            <TabsTrigger value="groups" className="text-base">Grup WhatsApp</TabsTrigger>
            <TabsTrigger value="stats" className="text-base">Statistik</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applicants" className="animate-fade-in">
            <ApplicantsTable applicants={applicants} />
          </TabsContent>
          
          <TabsContent value="groups" className="animate-fade-in">
            <GroupsManager groups={stats.groups} />
          </TabsContent>
          
          <TabsContent value="stats" className="animate-fade-in">
            <StatsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Admin;


import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { useRegistrations, Group } from '@/hooks/useRegistrations';
import GroupDetailCard from '@/components/groups/GroupDetailCard';
import GroupInfoCard from '@/components/groups/GroupInfoCard';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stats, authenticated } = useRegistrations();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!authenticated) {
      navigate('/login');
    }
    
    if (id && stats.groups.length > 0) {
      const foundGroup = stats.groups.find(g => g.id.toString() === id);
      if (foundGroup) {
        setGroup(foundGroup);
      } else {
        navigate('/dashboard');
      }
    }
  }, [id, stats.groups, authenticated, navigate]);

  if (!group) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto mt-8 animate-pulse px-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Detail Grup {group.name}
          </h1>
        </div>
        
        <GroupDetailCard group={group} />
        <GroupInfoCard />
      </div>
    </MainLayout>
  );
};

export default GroupDetail;

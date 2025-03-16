
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import GroupDetailCard from '@/components/groups/GroupDetailCard';
import GroupInfoCard from '@/components/groups/GroupInfoCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Group } from '@/hooks/useRegistrations.d'; // Import the correct type

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stats } = useRegistrations();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (id && stats.groups) {
      const groupId = parseInt(id);
      const foundGroup = stats.groups.find(g => g.id === groupId);
      setGroup(foundGroup || null);
    }
  }, [id, stats.groups]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detail Grup</h1>
            <p className="text-muted-foreground">
              Informasi dan statistik grup WhatsApp
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {group ? (
              <GroupDetailCard group={group} />
            ) : (
              <div className="p-8 text-center border rounded-lg">
                <p>Grup tidak ditemukan</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/dashboard')}
                >
                  Kembali ke Dashboard
                </Button>
              </div>
            )}
          </div>
          <div>
            {group && <GroupInfoCard group={group} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupDetail;

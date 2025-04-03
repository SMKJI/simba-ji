
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import GroupDetailCard from '@/components/groups/GroupDetailCard';
import GroupInfoCard from '@/components/groups/GroupInfoCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Group } from '@/types/supabase';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stats } = useRegistrations();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (id && stats.groups) {
      // Convert both ids to strings for comparison to handle both number and string types
      const foundGroup = stats.groups.find(g => g.id.toString() === id);
      if (foundGroup) {
        // Create a new Group object that matches the expected type
        const typedGroup: Group = {
          ...foundGroup,
          description: foundGroup.description || null,
          invite_link: foundGroup.invite_link || foundGroup.link || '',
          member_count: foundGroup.member_count || foundGroup.count || 0,
          is_active: foundGroup.is_active !== undefined ? foundGroup.is_active : true
        };
        setGroup(typedGroup);
      } else {
        setGroup(null);
      }
    }
  }, [id, stats.groups]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold">Detail Grup</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Informasi dan statistik grup WhatsApp
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-2 order-2 md:order-1">
            {group ? (
              <GroupDetailCard group={group} />
            ) : (
              <div className="p-6 sm:p-8 text-center border rounded-lg">
                <p className="text-sm sm:text-base">Grup tidak ditemukan</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/dashboard')}
                  size="sm"
                >
                  Kembali ke Dashboard
                </Button>
              </div>
            )}
          </div>
          <div className="order-1 md:order-2">
            {group && (
              <GroupInfoCard />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupDetail;

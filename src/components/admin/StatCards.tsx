
import { Users, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StatsData } from '@/hooks/useRegistrations';

interface StatCardsProps {
  stats: StatsData;
}

const StatCards = ({ stats }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pendaftar</p>
              <h2 className="text-3xl font-bold">{stats.total}</h2>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grup Aktif</p>
              <h2 className="text-3xl font-bold">{stats.groups.length}</h2>
            </div>
            <div className="p-3 bg-secondary/10 rounded-full">
              <Users className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grup Penuh</p>
              <h2 className="text-3xl font-bold">{stats.groups.filter(g => g.isFull).length}</h2>
            </div>
            <div className="p-3 bg-accent/10 rounded-full">
              <UserCheck className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;

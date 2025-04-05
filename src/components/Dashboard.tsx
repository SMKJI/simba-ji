
import { useEffect, useState } from 'react';
import { ArrowRight, Users, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatsData } from '@/hooks/useRegistrations';

interface DashboardProps {
  stats: StatsData;
  loading?: boolean;
}

const Dashboard = ({ stats, loading = false }: DashboardProps) => {
  const [animatedTotal, setAnimatedTotal] = useState(0);
  
  useEffect(() => {
    if (!loading && stats.total > 0) {
      // Animate counter
      const duration = 2000; // 2 seconds duration
      const interval = 20; // update every 20ms
      const steps = duration / interval;
      const increment = stats.total / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= stats.total) {
          clearInterval(timer);
          setAnimatedTotal(stats.total);
        } else {
          setAnimatedTotal(Math.floor(current));
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [loading, stats.total]);

  return (
    <div className="w-full animate-fade-in">
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-xl">
              <div className="mb-2 text-sm font-medium text-primary/70 uppercase tracking-wide">Total Pendaftar</div>
              <div className="text-4xl font-bold text-primary">
                {loading ? (
                  <div className="h-10 animate-pulse bg-primary/20 rounded-md"></div>
                ) : (
                  animatedTotal.toLocaleString()
                )}
              </div>
            </div>
            
            <div className="text-center p-4 bg-secondary/5 rounded-xl">
              <div className="mb-2 text-sm font-medium text-secondary/70 uppercase tracking-wide">Grup WhatsApp</div>
              <div className="text-4xl font-bold text-secondary">
                {loading ? (
                  <div className="h-10 animate-pulse bg-secondary/20 rounded-md"></div>
                ) : (
                  stats.groups.length
                )}
              </div>
            </div>
            
            <div className="text-center p-4 bg-accent/5 rounded-xl">
              <div className="mb-2 text-sm font-medium text-accent-foreground/70 uppercase tracking-wide">Status</div>
              <div className="text-xl md:text-lg lg:text-xl font-bold text-accent-foreground flex justify-center items-center space-x-2">
                {loading ? (
                  <div className="h-10 animate-pulse bg-accent/20 rounded-md w-full"></div>
                ) : (
                  <>
                    <span>Pendaftaran Dibuka</span>
                    <CheckCircle2 className="text-green-500" />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Status Grup WhatsApp</h3>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse bg-gray-100 rounded-md"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {stats.groups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{group.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {group.member_count} / 1000
                        {group.isFull && (
                          <span className="ml-2 text-secondary font-bold">(Penuh)</span>
                        )}
                      </span>
                    </div>
                    <Progress 
                      value={group.member_count / 10} 
                      className={`h-2 ${group.isFull ? 'bg-secondary/20' : 'bg-primary/20'}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/register" 
              className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Daftar Sekarang <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

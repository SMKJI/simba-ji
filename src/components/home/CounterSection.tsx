
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRegistrations } from '@/hooks/useRegistrations';

const CounterSection = () => {
  const { stats } = useRegistrations();
  const [animatedCount, setAnimatedCount] = useState(0);
  
  useEffect(() => {
    // Animate counter
    if (stats.total > 0) {
      let start = 0;
      const end = stats.total;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setAnimatedCount(end);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [stats.total]);

  // Format number with dot as thousands separator
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-4xl font-bold text-primary mb-2">{formatNumber(animatedCount)}</h3>
            <p className="text-gray-600">Total Pendaftar</p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-4xl font-bold text-secondary mb-2">{stats.groups.length}</h3>
            <p className="text-gray-600">Grup WhatsApp</p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
              <Clock className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="text-4xl font-bold text-accent-foreground mb-2">90</h3>
            <p className="text-gray-600">Hari Tersisa</p>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">
            Jangan lewatkan kesempatan untuk mendaftarkan diri Anda!
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/register">
              Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CounterSection;

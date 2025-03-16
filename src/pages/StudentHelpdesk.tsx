
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import PageTitle from '@/components/ui/PageTitle';
import TicketList from '@/components/TicketList';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const StudentHelpdesk = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authenticated, currentUser, loading, hasRole } = useRegistrations();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Make sure the session is stable before checking authentication
    if (loading) return;
    
    if (!authenticated) {
      toast({
        title: "Akses Ditolak",
        description: "Anda perlu masuk untuk mengakses halaman ini",
        variant: "destructive"
      });
      navigate('/login', { state: { from: '/helpdesk-siswa' } });
    } else if (!hasRole('applicant')) {
      // Redirect non-students to the regular helpdesk
      navigate('/helpdesk');
    }
  }, [authenticated, navigate, loading, hasRole, toast]);

  // Don't render anything while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] sm:min-h-[50vh]">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Also don't render if not authenticated
  if (!authenticated || !currentUser) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle 
          title="Bantuan Helpdesk" 
          description="Kirim pertanyaan atau kendala Anda kepada tim bantuan kami"
        />
        
        <div className="mt-6">
          <TicketList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentHelpdesk;

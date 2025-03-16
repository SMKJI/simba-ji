
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layouts/MainLayout';
import LoginForm from '@/components/LoginForm';
import { useRegistrations } from '@/hooks/useRegistrations';
import PageTitle from '@/components/ui/PageTitle';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { authenticated, currentUser, loading } = useRegistrations();
  
  // Get prefilled email from state if available
  const prefilledEmail = location.state?.email || '';
  const redirectPath = location.state?.from || '/dashboard';
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If already authenticated, redirect
    if (authenticated && currentUser) {
      toast({
        title: "Anda sudah masuk",
        description: "Mengarahkan ke dashboard Anda",
      });
      
      // Redirect based on role
      setTimeout(() => {
        switch (currentUser.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'helpdesk':
            navigate('/helpdesk');
            break;
          case 'content':
            navigate('/content');
            break;
          default:
            navigate(redirectPath);
            break;
        }
      }, 1000);
    }
  }, [authenticated, currentUser, navigate, redirectPath, toast]);

  const handleLoginSuccess = (role: string) => {
    toast({
      title: "Login Berhasil",
      description: `Selamat datang kembali! Anda masuk sebagai ${role}`,
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[40vh] sm:min-h-[50vh]">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <PageTitle 
            title="Masuk Akun" 
            description="Silakan masuk untuk melanjutkan ke sistem pendaftaran" 
          />
        </div>
        
        <LoginForm 
          prefilledEmail={prefilledEmail}
          onLoginSuccess={handleLoginSuccess} 
        />
      </div>
    </MainLayout>
  );
};

export default Login;

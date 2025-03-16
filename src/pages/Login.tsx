
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import LoginForm from '@/components/LoginForm';
import { useRegistrations } from '@/hooks/useRegistrations';
import PageTitle from '@/components/ui/PageTitle';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, currentUser, loading } = useRegistrations();
  
  // Get prefilled email from state if available
  const prefilledEmail = location.state?.email || '';
  const redirectPath = location.state?.from || '/dashboard';
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If already authenticated, redirect
    if (authenticated && currentUser) {
      // Redirect based on role
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
    }
  }, [authenticated, currentUser, navigate, redirectPath]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <PageTitle title="Masuk Akun" description="Silakan masuk untuk melanjutkan ke sistem pendaftaran" />
        </div>
        
        <LoginForm prefilledEmail={prefilledEmail} />
      </div>
    </MainLayout>
  );
};

export default Login;

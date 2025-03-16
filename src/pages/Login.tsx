
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import LoginForm from '@/components/LoginForm';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, currentUser, loading } = useRegistrations();
  
  // Get prefilled email from state if available
  const prefilledEmail = location.state?.email || '';
  
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
          navigate('/dashboard');
          break;
      }
    }
  }, [authenticated, currentUser, navigate]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Masuk Akun
          </h1>
          <p className="text-gray-600 mt-2">
            Silakan masuk untuk melanjutkan ke sistem pendaftaran
          </p>
        </div>
        
        <LoginForm prefilledEmail={prefilledEmail} />
      </div>
    </PageLayout>
  );
};

export default Login;

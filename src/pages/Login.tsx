
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import LoginForm from '@/components/LoginForm';
import { useRegistrations } from '@/hooks/useRegistrations';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, currentUser } = useRegistrations();
  
  // Get the intended destination from state or default to dashboard
  const from = location.state?.from || '/dashboard';
  
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
  }, [authenticated, currentUser, navigate, from]);

  return (
    <PageLayout>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Masuk Akun
          </h1>
          <p className="text-gray-600 mt-2">
            Silakan masuk untuk melanjutkan ke sistem pendaftaran
          </p>
        </div>
        
        <LoginForm />
      </div>
    </PageLayout>
  );
};

export default Login;

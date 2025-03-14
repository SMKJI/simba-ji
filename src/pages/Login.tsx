
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import LoginForm from '@/components/LoginForm';
import { useRegistrations } from '@/hooks/useRegistrations';

interface LocationState {
  from?: string;
  prefilledEmail?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, currentUser } = useRegistrations();
  
  const state = location.state as LocationState;
  const from = state?.from || '/';
  const prefilledEmail = state?.prefilledEmail;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (authenticated && currentUser) {
      if (location.state?.from) {
        navigate(from);
      } else {
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
            navigate('/');
        }
      }
    }
  }, [authenticated, currentUser, navigate, from, location.state]);

  return (
    <PageLayout>
      <div className="max-w-md mx-auto">
        <LoginForm prefilledEmail={prefilledEmail} />
      </div>
    </PageLayout>
  );
};

export default Login;

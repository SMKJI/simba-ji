
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import LoginForm from '@/components/LoginForm';
import { useRegistrations } from '@/hooks/useRegistrations';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, currentUser } = useRegistrations();
  
  const from = location.state?.from || '/';

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
        <LoginForm />
      </div>
    </PageLayout>
  );
};

export default Login;

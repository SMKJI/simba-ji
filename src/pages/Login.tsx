import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <LoginForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginForm from '@/components/LoginForm';
import { useRegistrations } from '@/hooks/useRegistrations';

const Login = () => {
  const navigate = useNavigate();
  const { authenticated } = useRegistrations();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If user is already authenticated, redirect to appropriate page
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

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

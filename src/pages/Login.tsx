
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import LoginForm from '@/components/LoginForm';

// This wrapper component uses the hook within the provider context
const LoginContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  // Get redirect path from location state
  const from = location.state?.from || '/dashboard';
  
  // Check if user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      toast({
        title: 'Sudah Masuk',
        description: `Anda sudah masuk sebagai ${user.name}`,
      });
      
      // Redirect based on role
      let redirectPath = from;
      
      switch (user.role) {
        case 'admin':
          redirectPath = '/admin';
          break;
        case 'helpdesk':
          redirectPath = '/helpdesk';
          break;
        case 'content':
          redirectPath = '/content';
          break;
        default:
          redirectPath = '/dashboard';
      }
      
      navigate(redirectPath);
    }
  }, [user, navigate, from, toast, loading]);
  
  const handleLoginSuccess = (role: string) => {
    // Handle redirect based on role if needed
    let redirectPath = from;
    
    switch (role) {
      case 'admin':
        redirectPath = '/admin';
        break;
      case 'helpdesk':
        redirectPath = '/helpdesk';
        break;
      case 'content':
        redirectPath = '/content';
        break;
      default:
        redirectPath = '/dashboard';
    }
    
    navigate(redirectPath);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center relative">
          <div className="absolute left-0 top-4">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <Link to="/">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <img src="/lovable-uploads/f5ba977f-fb10-430c-b426-68c3389cee2c.png" alt="SMKN 1 Kendal" className="mx-auto h-16 w-auto" />
          <h1 className="mt-4 text-3xl font-bold">SMKN 1 Kendal</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sistem PMB
          </p>
        </div>
        
        <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b p-6">
            <CardTitle className="text-xl font-semibold text-primary">
              Masuk
            </CardTitle>
            <CardDescription>Masuk ke akun Anda untuk akses sistem PMB</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} SMKN 1 Kendal
          </p>
        </div>
      </div>
    </div>
  );
};

// The main component
const Login = () => {
  return (
    <LoginContent />
  );
};

export default Login;

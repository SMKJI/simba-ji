
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onLoginSuccess?: (role: string) => void;
  showDemoAccounts?: boolean;
}

const LoginForm = ({ onLoginSuccess, showDemoAccounts = false }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Form tidak lengkap",
        description: "Silakan masukkan email dan password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to sign in with the provided credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login Gagal",
          description: error.message || "Email atau password salah",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (data && data.user) {
        console.log("User authenticated successfully:", data.user);
        
        // Refresh user data in context
        try {
          await refreshUser();
          console.log("User refreshed successfully");
          
          toast({
            title: "Login Berhasil",
            description: `Selamat datang kembali!`,
          });
          
          if (onLoginSuccess && data.session) {
            // Get profile data to determine role
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.user.id)
              .single();
            
            if (profileError) {
              console.error("Error fetching role:", profileError);
              
              // Try to create a profile if it doesn't exist
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: data.user.id,
                  email: data.user.email,
                  name: data.user.email?.split('@')[0] || 'User',
                  role: 'applicant'
                })
                .select('role')
                .single();
              
              if (createError) {
                console.error("Failed to create profile:", createError);
                onLoginSuccess('applicant');
              } else if (newProfile) {
                console.log("Created new profile:", newProfile);
                onLoginSuccess(newProfile.role);
              } else {
                onLoginSuccess('applicant');
              }
            } else if (profileData) {
              onLoginSuccess(profileData.role);
            } else {
              // Default to applicant role if no profile data
              onLoginSuccess('applicant');
            }
          }
        } catch (refreshError) {
          console.error("Error refreshing user:", refreshError);
        }
      }
    } catch (error: any) {
      console.error("Unexpected error during login:", error);
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Masuk...
            </>
          ) : (
            'Masuk'
          )}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

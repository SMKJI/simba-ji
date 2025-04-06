
import { useState, useEffect, createContext, useContext } from 'react';
import { useRegistrations } from './useRegistrations';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading: registrationsLoading } = useRegistrations();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      // Force a refresh of the session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error refreshing auth session:", error);
        return;
      }
      
      console.log("Auth refresh completed, session:", data.session ? "exists" : "none");
    } catch (err) {
      console.error("Error refreshing auth state:", err);
    }
  };

  useEffect(() => {
    if (!registrationsLoading) {
      setLoading(false);
    }
  }, [registrationsLoading]);

  return (
    <AuthContext.Provider value={{ 
      user: currentUser, 
      loading: loading || registrationsLoading, 
      error, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

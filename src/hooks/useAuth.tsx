
import { useState, useEffect, createContext, useContext } from 'react';
import { useRegistrations } from './useRegistrations';
import { supabase } from '@/integrations/supabase/client';
import { User } from './useRegistrations';

interface AuthContextType {
  user: User | null;
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
      
      if (!data.session) {
        console.log("No active session found during refresh");
        return;
      }
      
      // Refresh user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile during refresh:", profileError);
        return;
      }
      
      console.log("Auth refresh completed, user profile updated:", profileData);
    } catch (err) {
      console.error("Error refreshing auth state:", err);
    }
  };

  useEffect(() => {
    if (!registrationsLoading) {
      setLoading(false);
    }
  }, [registrationsLoading]);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in useAuth:", event);
      // We don't need to set user state here as it's handled in useRegistrations
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

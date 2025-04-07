
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/supabase';

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
  const [user, setUser] = useState<User | null>(null);
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
    const fetchUserSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            setUser(null);
            setLoading(false);
            return;
          }
          
          if (profileData) {
            setUser({
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role,
              avatarUrl: profileData.avatar_url,
              assignedGroupId: profileData.assigned_group_id,
              joinConfirmed: profileData.join_confirmed || false
            });
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Gagal memuat data pengguna');
        setLoading(false);
      }
    };

    fetchUserSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in useAuth:", event);
      
      if (event === 'SIGNED_IN' && session) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error:', profileError);
          setUser(null);
          return;
        }
        
        if (profileData) {
          setUser({
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            role: profileData.role,
            avatarUrl: profileData.avatar_url,
            assignedGroupId: profileData.assigned_group_id,
            joinConfirmed: profileData.join_confirmed || false
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
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

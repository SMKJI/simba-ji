
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
        setUser(null);
        return;
      }
      
      // Refresh user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile during refresh:", profileError);
        setError("Error fetching profile data");
        setUser(null);
        return;
      }
      
      if (profileData) {
        setUser({
          id: profileData.id,
          name: profileData.name || data.session.user.email?.split('@')[0] || 'User',
          email: profileData.email || data.session.user.email || '',
          role: profileData.role || 'applicant',
          avatarUrl: profileData.avatar_url,
          assignedGroupId: profileData.assigned_group_id,
          joinConfirmed: profileData.join_confirmed || false
        });
      } else {
        // If no profile exists yet, create a basic one with data from auth
        const userId = data.session.user.id;
        const userEmail = data.session.user.email || '';
        const userName = data.session.user.user_metadata.name || userEmail.split('@')[0];
        
        // Create a fallback user object
        const fallbackUser: User = {
          id: userId,
          name: userName,
          email: userEmail,
          role: 'applicant',
          avatarUrl: null,
          assignedGroupId: null,
          joinConfirmed: false
        };
        
        setUser(fallbackUser);
        
        // Try to create the profile
        try {
          await supabase.from('profiles').upsert({
            id: userId,
            name: userName,
            email: userEmail,
            role: 'applicant'
          });
          console.log("Created profile for user", userId);
        } catch (err) {
          console.error("Failed to create profile:", err);
        }
      }
      
      console.log("Auth refresh completed, user profile updated");
    } catch (err) {
      console.error("Error refreshing auth state:", err);
      setError("Failed to refresh authentication");
    }
  };

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Found existing session for user:", session.user.id);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile fetch error:', profileError);
            setError("Failed to fetch profile data");
            setUser(null);
            setLoading(false);
            return;
          }
          
          if (profileData) {
            console.log("Found existing profile:", profileData);
            setUser({
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role,
              avatarUrl: profileData.avatar_url,
              assignedGroupId: profileData.assigned_group_id,
              joinConfirmed: profileData.join_confirmed || false
            });
          } else {
            console.log("No profile found, creating one");
            // Create a basic profile for the user if none exists
            const userId = session.user.id;
            const userEmail = session.user.email || '';
            const userName = session.user.user_metadata.name || userEmail.split('@')[0];
            
            const fallbackUser: User = {
              id: userId,
              name: userName,
              email: userEmail,
              role: 'applicant',
              avatarUrl: null,
              assignedGroupId: null,
              joinConfirmed: false
            };
            
            setUser(fallbackUser);
            
            try {
              await supabase.from('profiles').upsert({
                id: userId,
                name: userName,
                email: userEmail,
                role: 'applicant'
              });
              console.log("Created profile for user", userId);
            } catch (err) {
              console.error("Failed to create profile:", err);
            }
          }
        } else {
          console.log("No active session found");
          setUser(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Gagal memuat data pengguna');
        setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError && profileError.code !== 'PGRST116') {
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
          } else {
            // Create a basic profile for the user if none exists
            const userId = session.user.id;
            const userEmail = session.user.email || '';
            const userName = session.user.user_metadata.name || userEmail.split('@')[0];
            
            // Set user with basic data
            const fallbackUser: User = {
              id: userId,
              name: userName,
              email: userEmail,
              role: 'applicant',
              avatarUrl: null,
              assignedGroupId: null,
              joinConfirmed: false
            };
            
            setUser(fallbackUser);
            
            // Create profile in database
            try {
              await supabase.from('profiles').upsert({
                id: userId,
                name: userName,
                email: userEmail,
                role: 'applicant'
              });
              console.log("Created profile for user", userId);
            } catch (err) {
              console.error("Failed to create profile:", err);
            }
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    fetchUserSession();

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

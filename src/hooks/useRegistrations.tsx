
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the registration result type
export interface RegistrationResult {
  success: boolean;
  data: {
    registrationId: number;
    assignedGroup: string;
    groupLink: string;
    timestamp: string;
  };
}

// Define group interface
export interface Group {
  id: number;
  name: string;
  count: number;
  capacity: number;
  isFull: boolean;
  link?: string;
}

// This would be replaced with a real API call in a production app
export const MOCK_DATA = {
  total: 1327,
  groups: [
    { id: 1, name: 'Grup 1', count: 1000, capacity: 1000, isFull: true },
    { id: 2, name: 'Grup 2', count: 327, capacity: 1000, isFull: false },
    { id: 3, name: 'Grup 3', count: 0, capacity: 1000, isFull: false },
  ]
};

// Define stats data interface
export interface StatsData {
  total: number;
  groups: Group[];
}

// Define user roles
export type UserRole = 'applicant' | 'helpdesk' | 'admin' | 'content';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

// Mock users for development
export const DEMO_ACCOUNTS: User[] = [
  { id: '1', name: 'Calon Murid', email: 'calon@example.com', role: 'applicant' },
  { id: '2', name: 'Operator Helpdesk', email: 'helpdesk@smkn1kendal.sch.id', role: 'helpdesk' },
  { id: '3', name: 'Administrator', email: 'admin@smkn1kendal.sch.id', role: 'admin' },
  { id: '4', name: 'Content Admin', email: 'content@smkn1kendal.sch.id', role: 'content' },
];

export const useRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>(MOCK_DATA);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Check for Supabase session and user on mount
  useEffect(() => {
    const fetchUserAndSession = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Using maybeSingle() instead of single() to handle null properly
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, role, avatar_url')
            .eq('id', session.user.id)
            .maybeSingle();
            
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profileData?.name || session.user.email?.split('@')[0] || 'User',
            role: (profileData?.role as UserRole) || 'applicant',
            avatarUrl: profileData?.avatar_url || undefined
          };
          
          setCurrentUser(user);
          setAuthenticated(true);
        } else {
          // Fall back to session storage for demo mode
          const savedUser = sessionStorage.getItem('currentUser');
          if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
            setAuthenticated(true);
          }
        }
        
        // For demo, we'll just simulate a loading delay and use mock data for stats
        setTimeout(() => {
          setStats(MOCK_DATA);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserAndSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Using maybeSingle() instead of single() to handle null properly
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, role, avatar_url')
            .eq('id', session.user.id)
            .maybeSingle();
            
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profileData?.name || session.user.email?.split('@')[0] || 'User',
            role: (profileData?.role as UserRole) || 'applicant',
            avatarUrl: profileData?.avatar_url || undefined
          };
          
          setCurrentUser(user);
          setAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setAuthenticated(false);
          sessionStorage.removeItem('currentUser');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to simulate submitting a registration form
  const submitRegistration = async (formData: any): Promise<RegistrationResult> => {
    setLoading(true);
    
    try {
      // In a real app with Supabase, we'd insert the registration data
      // Here we're still using the mock data for demo purposes
      
      // For demo, we'll simulate a successful registration after a delay
      return new Promise((resolve) => {
        setTimeout(() => {
          // Determine the group based on current counts
          let assignedGroup = stats.groups.find(group => !group.isFull);
          
          if (!assignedGroup) {
            assignedGroup = {
              id: stats.groups.length + 1,
              name: `Grup ${stats.groups.length + 1}`,
              count: 0,
              capacity: 1000,
              isFull: false
            };
          }
          
          // Simulate updating the stats
          const updatedStats = {...stats};
          updatedStats.total += 1;
          
          const groupIndex = updatedStats.groups.findIndex(g => g.id === assignedGroup!.id);
          if (groupIndex >= 0) {
            updatedStats.groups[groupIndex].count += 1;
            
            // Check if group is now full
            if (updatedStats.groups[groupIndex].count >= updatedStats.groups[groupIndex].capacity) {
              updatedStats.groups[groupIndex].isFull = true;
            }
          }
          
          setStats(updatedStats);
          setLoading(false);
          
          resolve({
            success: true,
            data: {
              registrationId: Math.floor(1000000 + Math.random() * 9000000),
              assignedGroup: assignedGroup!.name,
              groupLink: "https://chat.whatsapp.com/example",
              timestamp: new Date().toISOString()
            }
          });
        }, 1500);
      });
    } catch (err) {
      setError('Failed to submit registration');
      setLoading(false);
      throw err;
    }
  };

  // Function for Supabase login
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If we get an auth error, try demo login as fallback
        if (error.message.includes('Email not confirmed') || 
            error.message.includes('Invalid login credentials')) {
          // Try demo login
          const demoUser = DEMO_ACCOUNTS.find(u => u.email === email);
          
          if (demoUser && password === 'password123') {
            sessionStorage.setItem('currentUser', JSON.stringify(demoUser));
            setCurrentUser(demoUser);
            setAuthenticated(true);
            setLoading(false);
            return { success: true, user: demoUser };
          }
        }
        
        setLoading(false);
        return { success: false, error: error.message };
      }
      
      // Successfully logged in with Supabase
      if (data.user) {
        // Using maybeSingle() instead of single() to handle null properly
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, role, avatar_url')
          .eq('id', data.user.id)
          .maybeSingle();
          
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: profileData?.name || data.user.email?.split('@')[0] || 'User',
          role: (profileData?.role as UserRole) || 'applicant',
          avatarUrl: profileData?.avatar_url || undefined
        };
        
        setCurrentUser(user);
        setAuthenticated(true);
        setLoading(false);
        return { success: true, user };
      }
      
      setLoading(false);
      return { success: false, error: 'Unknown error occurred' };
    } catch (err) {
      setLoading(false);
      return { success: false, error: 'Login gagal' };
    }
  };

  // Function to logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setCurrentUser(null);
      setAuthenticated(false);
      sessionStorage.removeItem('currentUser');
    }
  };

  // Function to check if user has a specific role
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    
    return currentUser.role === role;
  };

  return { 
    stats, 
    loading, 
    error, 
    submitRegistration, 
    login, 
    logout, 
    currentUser, 
    authenticated,
    hasRole
  };
};

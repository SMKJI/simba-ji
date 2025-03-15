
import { useState, useEffect } from 'react';

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

  // In a real app, this would fetch from an API endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from an API endpoint
        // const response = await fetch('/api/registration-stats');
        // const data = await response.json();
        // setStats(data);
        
        // For demo, we'll just simulate a loading delay and use mock data
        setTimeout(() => {
          setStats(MOCK_DATA);
          setLoading(false);
        }, 1000);
        
        // Check if user is logged in (in real app, this would use proper auth)
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setAuthenticated(true);
        }
      } catch (err) {
        setError('Failed to load registration data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to simulate submitting a registration form
  const submitRegistration = async (formData: any): Promise<RegistrationResult> => {
    setLoading(true);
    
    try {
      // In a real app, you would post to an API endpoint
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      
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

  // Function to simulate user login
  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    setLoading(true);
    
    try {
      // In a real app, you would authenticate against a server
      // For demo, we'll simulate authentication with mock users
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = DEMO_ACCOUNTS.find(u => u.email === email);
          
          if (user && password === 'password123') { // Simple password check for demo
            setCurrentUser(user);
            setAuthenticated(true);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            setLoading(false);
            resolve({ success: true, user });
          } else {
            setLoading(false);
            resolve({ success: false, error: 'Email atau password salah' });
          }
        }, 1000);
      });
    } catch (err) {
      setLoading(false);
      return { success: false, error: 'Login gagal' };
    }
  };

  // Function to logout
  const logout = () => {
    setCurrentUser(null);
    setAuthenticated(false);
    sessionStorage.removeItem('currentUser');
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

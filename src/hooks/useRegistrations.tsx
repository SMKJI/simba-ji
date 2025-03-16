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
    { id: 1, name: 'Grup 1', count: 1000, capacity: 1000, isFull: true, link: "https://chat.whatsapp.com/group1" },
    { id: 2, name: 'Grup 2', count: 327, capacity: 1000, isFull: false, link: "https://chat.whatsapp.com/group2" },
    { id: 3, name: 'Grup 3', count: 0, capacity: 1000, isFull: false, link: "https://chat.whatsapp.com/group3" },
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
  assignedGroupId?: number;
  joinConfirmed?: boolean;
}

// Define helpdesk ticket interface
export interface HelpdeskTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in-progress' | 'closed';
  createdAt: string;
  lastUpdated: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: string;
  senderRole: UserRole;
  message: string;
  timestamp: string;
}

// Mock users for development
export const DEMO_ACCOUNTS: User[] = [
  { 
    id: '1', 
    name: 'Calon Murid', 
    email: 'calon@example.com', 
    role: 'applicant', 
    assignedGroupId: 2,
    joinConfirmed: false
  },
  { id: '2', name: 'Operator Helpdesk', email: 'helpdesk@smkn1kendal.sch.id', role: 'helpdesk' },
  { id: '3', name: 'Administrator', email: 'admin@smkn1kendal.sch.id', role: 'admin' },
  { id: '4', name: 'Content Admin', email: 'content@smkn1kendal.sch.id', role: 'content' },
];

// Mock tickets
const MOCK_TICKETS: HelpdeskTicket[] = [
  {
    id: "ticket-1",
    userId: "1",
    subject: "Kesulitan bergabung grup WhatsApp",
    status: "open",
    createdAt: "2024-07-05T08:30:00Z",
    lastUpdated: "2024-07-05T08:30:00Z",
    messages: [
      {
        id: "msg-1",
        ticketId: "ticket-1",
        sender: "1",
        senderRole: "applicant",
        message: "Saya mencoba bergabung grup WhatsApp tapi link tidak berfungsi",
        timestamp: "2024-07-05T08:30:00Z"
      }
    ]
  }
];

export const useRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>(MOCK_DATA);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(MOCK_TICKETS);

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

  // Function to get assigned group for current user
  const getUserAssignedGroup = (): Group | null => {
    if (!currentUser || !currentUser.assignedGroupId) return null;
    return stats.groups.find(g => g.id === currentUser.assignedGroupId) || null;
  };

  // Function to confirm user has joined the WhatsApp group
  const confirmGroupJoin = async () => {
    if (!currentUser) return { success: false, error: "User not logged in" };
    
    try {
      // In a real app, this would update the database
      const updatedUser = { ...currentUser, joinConfirmed: true };
      setCurrentUser(updatedUser);
      
      // Save to session storage for demo purposes
      if (sessionStorage.getItem('currentUser')) {
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to update join status" };
    }
  };

  // Function to create a new helpdesk ticket
  const createTicket = (subject: string, message: string): HelpdeskTicket | null => {
    if (!currentUser) return null;
    
    const newTicket: HelpdeskTicket = {
      id: `ticket-${Date.now()}`,
      userId: currentUser.id,
      subject,
      status: 'open',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: `ticket-${Date.now()}`,
          sender: currentUser.id,
          senderRole: currentUser.role,
          message,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    setTickets(prevTickets => [...prevTickets, newTicket]);
    return newTicket;
  };

  // Function to add message to existing ticket
  const addTicketMessage = (ticketId: string, message: string) => {
    if (!currentUser) return null;
    
    setTickets(prevTickets => {
      return prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          const newMessage: TicketMessage = {
            id: `msg-${Date.now()}`,
            ticketId,
            sender: currentUser.id,
            senderRole: currentUser.role,
            message,
            timestamp: new Date().toISOString()
          };
          
          return {
            ...ticket,
            messages: [...ticket.messages, newMessage],
            lastUpdated: new Date().toISOString(),
            // If helpdesk replies to a closed ticket, reopen it
            status: currentUser.role === 'helpdesk' && ticket.status === 'closed' 
              ? 'in-progress' 
              : ticket.status
          };
        }
        return ticket;
      });
    });
    
    return true;
  };

  // Function to get user tickets
  const getUserTickets = () => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'helpdesk' || currentUser.role === 'admin') {
      return tickets; // Helpdesk and admin can see all tickets
    }
    
    return tickets.filter(ticket => ticket.userId === currentUser.id);
  };

  // Function to update ticket status
  const updateTicketStatus = (ticketId: string, status: 'open' | 'in-progress' | 'closed') => {
    if (!currentUser || (currentUser.role !== 'helpdesk' && currentUser.role !== 'admin')) {
      return false;
    }
    
    setTickets(prevTickets => {
      return prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status,
            lastUpdated: new Date().toISOString()
          };
        }
        return ticket;
      });
    });
    
    return true;
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
    hasRole,
    getUserAssignedGroup,
    confirmGroupJoin,
    createTicket,
    addTicketMessage,
    getUserTickets,
    updateTicketStatus,
    tickets
  };
};

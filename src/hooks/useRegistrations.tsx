import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

// Define applicant interface
export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  parentName?: string;
  parentPhone?: string;
  previousSchool?: string;
  group: string;
  registeredAt: string;
}

// Define helpdesk ticket interface with priority field
export interface HelpdeskTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in-progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  lastUpdated: string;
  assignedTo?: string | null;
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

// Add new interface for HelpdeskOperator
export interface HelpdeskOperator {
  id: string;
  name: string;
  email: string;
  assignedTickets: number;
  status: 'active' | 'inactive';
  lastActive: string;
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
];

// Mock applicants for development
const MOCK_APPLICANTS: Applicant[] = Array.from({ length: 25 }).map((_, i) => ({
  id: (i + 1000000).toString(),
  name: `Calon Murid ${i + 1}`,
  email: `calon${i + 1}@example.com`,
  phone: `08123456${i.toString().padStart(4, '0')}`,
  parentName: `Orang Tua ${i + 1}`,
  parentPhone: `08765432${i.toString().padStart(4, '0')}`,
  previousSchool: `SMP Negeri ${Math.floor(Math.random() * 10) + 1} ${['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Yogyakarta'][Math.floor(Math.random() * 5)]}`,
  group: `Grup ${Math.floor(i / 10) + 1}`,
  registeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

// Add mock operators
const MOCK_OPERATORS: HelpdeskOperator[] = [
  { 
    id: '2', 
    name: 'Operator Helpdesk', 
    email: 'helpdesk@smkn1kendal.sch.id', 
    assignedTickets: 1,
    status: 'active',
    lastActive: new Date().toISOString()
  },
];

// Mock tickets with priority
const MOCK_TICKETS: HelpdeskTicket[] = [
  {
    id: "ticket-1",
    userId: "1",
    subject: "Kesulitan bergabung grup WhatsApp",
    status: "open",
    priority: "medium",
    createdAt: "2024-07-05T08:30:00Z",
    lastUpdated: "2024-07-05T08:30:00Z",
    assignedTo: "2",
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>(MOCK_DATA);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [tickets, setTickets] = useState<HelpdeskTicket[]>(MOCK_TICKETS);
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const [users, setUsers] = useState<User[]>(DEMO_ACCOUNTS);
  const [operators, setOperators] = useState<HelpdeskOperator[]>(MOCK_OPERATORS);

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
          
          // Create a new applicant record
          const newApplicant: Applicant = {
            id: (1000000 + applicants.length + 1).toString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            parentName: formData.parentName,
            parentPhone: formData.parentPhone,
            previousSchool: formData.previousSchool,
            group: assignedGroup!.name,
            registeredAt: new Date().toISOString()
          };
          
          setApplicants(prev => [...prev, newApplicant]);
          setStats(updatedStats);
          setLoading(false);
          
          resolve({
            success: true,
            data: {
              registrationId: Math.floor(1000000 + Math.random() * 9000000),
              assignedGroup: assignedGroup!.name,
              groupLink: assignedGroup!.link || "https://chat.whatsapp.com/example",
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

  // Function to create a new helpdesk ticket with automatic operator assignment
  const createTicket = (subject: string, message: string): HelpdeskTicket | null => {
    if (!currentUser) return null;
    
    // Find operator with least tickets
    const operatorWithLeastTickets = operators
      .filter(op => op.status === 'active')
      .sort((a, b) => a.assignedTickets - b.assignedTickets)[0];
    
    const newTicketId = `ticket-${Date.now()}`;
    
    const newTicket: HelpdeskTicket = {
      id: newTicketId,
      userId: currentUser.id,
      subject,
      status: 'open',
      priority: 'low', // Default priority is low
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      assignedTo: operatorWithLeastTickets?.id || null,
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: newTicketId,
          sender: currentUser.id,
          senderRole: currentUser.role,
          message,
          timestamp: new Date().toISOString()
        }
      ]
    };
    
    setTickets(prevTickets => [...prevTickets, newTicket]);
    
    // Update operator's assigned tickets count
    if (operatorWithLeastTickets) {
      updateOperatorTicketCount(operatorWithLeastTickets.id, 1);
    }
    
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
          // If ticket is being closed, update operator ticket count
          if (status === 'closed' && ticket.status !== 'closed' && ticket.assignedTo) {
            updateOperatorTicketCount(ticket.assignedTo, -1);
          }
          
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

  // NEW: Function to update ticket priority
  const updateTicketPriority = (ticketId: string, priority: 'low' | 'medium' | 'high') => {
    if (!currentUser || (currentUser.role !== 'helpdesk' && currentUser.role !== 'admin')) {
      return false;
    }
    
    setTickets(prevTickets => {
      return prevTickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            priority,
            lastUpdated: new Date().toISOString()
          };
        }
        return ticket;
      });
    });
    
    return true;
  };

  // Function to get all applicants
  const getApplicants = (): Applicant[] => {
    return applicants;
  };

  // Function to update applicant data
  const updateApplicant = (id: string, data: Partial<Applicant>): boolean => {
    try {
      setApplicants(prev => prev.map(applicant => 
        applicant.id === id ? { ...applicant, ...data } : applicant
      ));
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to delete applicant
  const deleteApplicant = (id: string): boolean => {
    try {
      setApplicants(prev => prev.filter(applicant => applicant.id !== id));
      // Also delete any associated tickets
      setTickets(prev => prev.filter(ticket => 
        !prev.find(applicant => applicant.id === ticket.userId && applicant.id === id)
      ));
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to reset a user's password
  const resetUserPassword = (id: string): boolean => {
    try {
      // In a real app, this would trigger a password reset
      // For demo purposes just show a toast
      toast({
        title: "Password Reset",
        description: "Demo mode: Password would be reset to 'newpassword123' and sent to user's email",
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to create a new WhatsApp group
  const createGroup = (groupData: { name: string; capacity: number; link: string }): boolean => {
    try {
      const newId = Math.max(...stats.groups.map(g => g.id)) + 1;
      const newGroup: Group = {
        id: newId,
        name: groupData.name,
        count: 0,
        capacity: groupData.capacity,
        isFull: false,
        link: groupData.link
      };
      
      setStats(prev => ({
        ...prev,
        groups: [...prev.groups, newGroup]
      }));
      
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to update a WhatsApp group
  const updateGroup = (id: number, groupData: { name?: string; capacity?: number; link?: string }): boolean => {
    try {
      setStats(prev => {
        const groupIndex = prev.groups.findIndex(g => g.id === id);
        if (groupIndex < 0) return prev;
        
        const updatedGroups = [...prev.groups];
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          ...groupData,
          // Check if group is full based on new capacity
          isFull: groupData.capacity 
            ? updatedGroups[groupIndex].count >= groupData.capacity
            : updatedGroups[groupIndex].isFull
        };
        
        return {
          ...prev,
          groups: updatedGroups
        };
      });
      
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to delete a WhatsApp group
  const deleteGroup = (id: number): boolean => {
    try {
      // Check if there are applicants in this group
      const group = stats.groups.find(g => g.id === id);
      if (!group || group.count > 0) {
        return false; // Cannot delete group with members
      }
      
      setStats(prev => ({
        ...prev,
        groups: prev.groups.filter(g => g.id !== id)
      }));
      
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to update a user's role
  const updateUserRole = (userId: string, newRole: UserRole): boolean => {
    try {
      // In a real app with Supabase, this would update the user's role in the profiles table
      // For demo purposes, we'll update the DEMO_ACCOUNTS array
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex >= 0) {
        const updatedUsers = [...users];
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          role: newRole
        };
        setUsers(updatedUsers);
        
        // If the current user's role is being updated, also update currentUser
        if (currentUser && currentUser.id === userId) {
          setCurrentUser({
            ...currentUser,
            role: newRole
          });
        }
        
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Function to get all helpdesk operators
  const getHelpdeskOperators = (): HelpdeskOperator[] => {
    return operators;
  };

  // Function to add a new helpdesk operator
  const addHelpdeskOperator = (userData: Omit<HelpdeskOperator, 'id' | 'assignedTickets' | 'status' | 'lastActive'>): boolean => {
    try {
      const newOperator: HelpdeskOperator = {
        id: `operator-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        assignedTickets: 0,
        status: 'active',
        lastActive: new Date().toISOString()
      };
      
      setOperators(prev => [...prev, newOperator]);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to update operator status
  const updateOperatorStatus = (id: string, status: 'active' | 'inactive'): boolean => {
    try {
      setOperators(prev => prev.map(operator => 
        operator.id === id 
          ? { 
              ...operator, 
              status, 
              lastActive: status === 'active' ? new Date().toISOString() : operator.lastActive 
            } 
          : operator
      ));
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to update operator's assigned ticket count
  const updateOperatorTicketCount = (id: string, change: number): boolean => {
    try {
      setOperators(prev => prev.map(operator => 
        operator.id === id 
          ? { 
              ...operator, 
              assignedTickets: Math.max(0, operator.assignedTickets + change)
            } 
          : operator
      ));
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to remove a helpdesk operator
  const removeHelpdeskOperator = (id: string): boolean => {
    try {
      // Check if operator has assigned tickets
      const operator = operators.find(op => op.id === id);
      if (operator && operator.assignedTickets > 0) {
        // Reassign tickets to other operators
        setTickets(prev => prev.map(ticket => {
          if (ticket.assignedTo === id) {
            const nextOperator = operators
              .filter(op => op.id !== id && op.status === 'active')
              .sort((a, b) => a.assignedTickets - b.assignedTickets)[0];
            
            if (nextOperator) {
              updateOperatorTicketCount(nextOperator.id, 1);
              return { ...ticket, assignedTo: nextOperator.id };
            }
            
            return { ...ticket, assignedTo: null };
          }
          return ticket;
        }));
      }
      
      setOperators(prev => prev.filter(operator => operator.id !== id));
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to reassign tickets among operators
  const balanceTickets = (): boolean => {
    try {
      const activeOperators = operators.filter(op => op.status === 'active');
      if (activeOperators.length === 0) return false;
      
      // Reset all operator ticket counts
      setOperators(prev => prev.map(op => ({ ...op, assignedTickets: 0 })));
      
      // Get all tickets that need assignment
      const ticketsToAssign = tickets.filter(t => t.status !== 'closed');
      
      // Assign tickets evenly
      const updatedTickets = [...tickets];
      let currentOperatorIndex = 0;
      
      for (let i = 0; i < ticketsToAssign.length; i++) {
        const ticketIndex = tickets.findIndex(t => t.id === ticketsToAssign[i].id);
        if (ticketIndex >= 0) {
          const assignedOperator = activeOperators[currentOperatorIndex];
          updatedTickets[ticketIndex] = { 
            ...updatedTickets[ticketIndex], 
            assignedTo: assignedOperator.id 
          };
          
          // Update operator's ticket count
          const operatorIndex = operators.findIndex(op => op.id === assignedOperator.id);
          if (operatorIndex >= 0) {
            setOperators(prev => {
              const newOperators = [...prev];
              newOperators[operatorIndex] = {
                ...newOperators[operatorIndex],
                assignedTickets: newOperators[operatorIndex].assignedTickets + 1
              };
              return newOperators;
            });
          }
          
          // Move to next operator (round-robin)
          currentOperatorIndex = (currentOperatorIndex + 1) % activeOperators.length;
        }
      }
      
      setTickets(updatedTickets);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Function to manually assign a ticket to an operator
  const assignTicket = (ticketId: string, operatorId: string): boolean => {
    try {
      // Get current assignment
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return false;
      
      // Decrement count for previous operator if exists
      if (ticket.assignedTo) {
        updateOperatorTicketCount(ticket.assignedTo, -1);
      }
      
      // Update ticket assignment
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assignedTo: operatorId }
          : ticket
      ));
      
      // Increment count for new operator
      updateOperatorTicketCount(operatorId, 1);
      
      return true;
    } catch (err) {
      return false;
    }
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
    updateTicketPriority,
    tickets,
    getApplicants,
    updateApplicant,
    deleteApplicant,
    resetUserPassword,
    createGroup,
    updateGroup,
    deleteGroup,
    applicants,
    updateUserRole,
    getHelpdeskOperators,
    addHelpdeskOperator,
    updateOperatorStatus,
    removeHelpdeskOperator,
    balanceTickets,
    assignTicket,
    operators
  };
};

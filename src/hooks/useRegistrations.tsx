import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  UserRole,
  Group,
  StatsData,
  LoginResult,
  RegistrationResult,
  HelpdeskOperator,
  HelpdeskTicket,
  TicketMessage,
  TicketCategory,
  QueueTicket,
  HelpdeskCounter,
  DailyCapacity,
  TicketAttachment
} from '@/types/supabase';

export type {
  User,
  UserRole,
  Group,
  StatsData,
  LoginResult,
  RegistrationResult,
  HelpdeskOperator,
  HelpdeskTicket,
  TicketMessage,
  TicketCategory,
  QueueTicket,
  HelpdeskCounter,
  DailyCapacity,
  TicketAttachment
};

// Add DEMO_ACCOUNTS for development
export const DEMO_ACCOUNTS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as UserRole
  },
  {
    id: '2',
    name: 'Helpdesk Operator',
    email: 'helpdesk@example.com',
    role: 'helpdesk' as UserRole
  },
  {
    id: '3',
    name: 'Helpdesk Tatap Muka',
    email: 'offline@example.com',
    role: 'helpdesk_offline' as UserRole
  },
  {
    id: '4',
    name: 'Content Manager',
    email: 'content@example.com',
    role: 'content' as UserRole
  },
  {
    id: '5',
    name: 'Calon Murid',
    email: 'murid@example.com',
    role: 'applicant' as UserRole
  }
];

// Create context
const RegistrationsContext = createContext<any>(null);

// Provider component
export const RegistrationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({ total: 0, groups: [] });
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [operators, setOperators] = useState<HelpdeskOperator[]>([]);
  const [counters, setCounters] = useState<HelpdeskCounter[]>([]);
  const [queueTickets, setQueueTickets] = useState<QueueTicket[]>([]);
  const [dailyCapacities, setDailyCapacities] = useState<DailyCapacity[]>([]);

  // Check for Supabase session and user on mount
  useEffect(() => {
    const fetchUserAndSession = async () => {
      try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            setAuthenticated(false);
            setCurrentUser(null);
            setLoading(false);
            return;
          }
          
          if (profileData) {
            const user: User = {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role as UserRole,
              avatarUrl: profileData.avatar_url,
              assignedGroupId: (profileData as any).assigned_group_id as string || undefined,
              joinConfirmed: (profileData as any).join_confirmed as boolean || false
            };
            
            setCurrentUser(user);
            setAuthenticated(true);
          }
        }
        
        // Fetch stats data for the dashboard
        await fetchStats();
        await fetchCategories();
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load user data:', err);
        setError('Gagal memuat data pengguna');
        setLoading(false);
      }
    };

    fetchUserAndSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile fetch error:', profileError);
            setAuthenticated(false);
            setCurrentUser(null);
            return;
          }
          
          if (profileData) {
            const user: User = {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role as UserRole,
              avatarUrl: profileData.avatar_url,
              assignedGroupId: (profileData as any).assigned_group_id as string || undefined,
              joinConfirmed: (profileData as any).join_confirmed as boolean || false
            };
            
            setCurrentUser(user);
            setAuthenticated(true);
          }
          
          // Refresh stats
          await fetchStats();
          await fetchCategories();
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setAuthenticated(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch stats data for the dashboard
  const fetchStats = async () => {
    try {
      // Get all WhatsApp groups
      const { data: groups, error: groupsError } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .order('name');
      
      if (groupsError) {
        console.error('Error fetching groups:', groupsError);
        return;
      }
      
      // Get total registrations count (users with role 'applicant')
      const { count: totalCount, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'applicant');
      
      if (countError) {
        console.error('Error fetching total count:', countError);
        return;
      }
      
      // Transform groups to match our interface
      const formattedGroups: Group[] = groups.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        invite_link: group.invite_link,
        capacity: group.capacity,
        member_count: group.member_count,
        is_active: group.is_active,
        isFull: group.member_count >= group.capacity
      }));
      
      setStats({
        total: totalCount || 0,
        groups: formattedGroups
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch ticket categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      const formattedCategories: TicketCategory[] = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        is_offline: cat.is_offline
      }));
      
      setCategories(formattedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Function for Supabase login
  const login = async (email: string, password: string): Promise<LoginResult> => {
    setLoading(true);
    
    try {
      // Try to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }
      
      // Successfully logged in with Supabase
      if (data.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          setLoading(false);
          return { success: false, error: 'Profil pengguna tidak ditemukan' };
        }
        
        const user: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          avatarUrl: profile.avatar_url,
          assignedGroupId: (profile as any).assigned_group_id as string || undefined,
          joinConfirmed: (profile as any).join_confirmed as boolean || false
        };
        
        setCurrentUser(user);
        setAuthenticated(true);
        setLoading(false);
        return { success: true, user };
      }
      
      setLoading(false);
      return { success: false, error: 'Terjadi kesalahan yang tidak diketahui' };
    } catch (err: any) {
      console.error('Login error:', err);
      setLoading(false);
      return { success: false, error: err.message || 'Login gagal' };
    }
  };

  // Function to register a new user
  const register = async (email: string, password: string, name: string): Promise<LoginResult> => {
    setLoading(true);
    
    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        // Check if we need to wait for email confirmation
        if (data.session) {
          // User is already confirmed, get their profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            setLoading(false);
            return { success: false, error: 'Profil pengguna tidak ditemukan' };
          }
          
          const user: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            avatarUrl: profile.avatar_url,
            assignedGroupId: (profile as any).assigned_group_id as string || undefined,
            joinConfirmed: (profile as any).join_confirmed as boolean || false
          };
          
          setCurrentUser(user);
          setAuthenticated(true);
          setLoading(false);
          return { success: true, user };
        }
        
        // User needs to confirm email
        setLoading(false);
        return { 
          success: true, 
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: name,
            role: 'applicant' as UserRole
          } as User
        };
      }
      
      setLoading(false);
      return { success: false, error: 'Terjadi kesalahan yang tidak diketahui' };
    } catch (err: any) {
      console.error('Registration error:', err);
      setLoading(false);
      return { success: false, error: err.message || 'Pendaftaran gagal' };
    }
  };

  // Function to logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      setCurrentUser(null);
      setAuthenticated(false);
    } else {
      console.error('Logout error:', error);
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
  const getUserAssignedGroup = async (): Promise<Group | null> => {
    if (!currentUser || !currentUser.assignedGroupId) return null;

    try {
      const { data, error } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .eq('id', currentUser.assignedGroupId)
        .single();
      
      if (error || !data) {
        console.error('Error fetching assigned group:', error);
        return null;
      }
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        invite_link: data.invite_link,
        capacity: data.capacity,
        member_count: data.member_count,
        is_active: data.is_active,
        isFull: data.member_count >= data.capacity
      };
    } catch (err) {
      console.error('Error in getUserAssignedGroup:', err);
      return null;
    }
  };

  // Function to confirm user has joined the WhatsApp group
  const confirmGroupJoin = async () => {
    if (!currentUser) {
      return { success: false, error: "Pengguna belum masuk" };
    }
    
    try {
      // Call the new DB function
      const { data, error } = await supabase
        .rpc('confirm_group_join', { user_id: currentUser.id }) as any;
      
      if (error) {
        console.error('Error confirming group join:', error);
        return { success: false, error: error.message };
      }
      
      if (data) {
        // Update the current user state
        setCurrentUser(prev => {
          if (prev) {
            return { ...prev, joinConfirmed: true };
          }
          return prev;
        });
        
        return { success: true };
      } else {
        return { success: false, error: "Tidak dapat mengkonfirmasi bergabung dengan grup" };
      }
    } catch (err: any) {
      console.error('Error in confirmGroupJoin:', err);
      return { success: false, error: err.message || "Gagal memperbarui status bergabung" };
    }
  };

  // Function to assign a user to a WhatsApp group
  const assignUserToGroup = async (userId: string, groupId: string): Promise<boolean> => {
    try {
      // Use the new function
      const { data, error } = await supabase
        .rpc('assign_user_to_group', { user_id: userId, group_id: groupId }) as any;
      
      if (error) {
        console.error('Error assigning user to group:', error);
        return false;
      }
      
      // If the current user is being assigned, update the local state
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(prev => {
          if (prev) {
            return { ...prev, assignedGroupId: groupId, joinConfirmed: false };
          }
          return prev;
        });
      }
      
      // Fetch fresh stats to update group counts
      await fetchStats();
      
      return !!data;
    } catch (err) {
      console.error('Error in assignUserToGroup:', err);
      return false;
    }
  };

  // Function to update user role
  const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    try {
      // Use the new function
      const { data, error } = await supabase
        .rpc('update_user_role', { user_id: userId, new_role: newRole }) as any;
      
      if (error) {
        console.error('Error updating user role:', error);
        return false;
      }
      
      // If the current user's role is being updated, update local state
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(prev => {
          if (prev) {
            return { ...prev, role: newRole };
          }
          return prev;
        });
      }
      
      return !!data;
    } catch (err) {
      console.error('Error in updateUserRole:', err);
      return false;
    }
  };

  // Fetch all applicants for admin management
  const getApplicants = async () => {
    if (!currentUser || currentUser.role !== 'admin') {
      return [];
    }
    
    try {
      // Use the user_management view
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching applicants:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Error in getApplicants:', err);
      return [];
    }
  };

  // Function to create a new helpdesk ticket
  const createTicket = async (
    subject: string, 
    message: string, 
    categoryId?: string, 
    isOffline: boolean = false
  ): Promise<{ success: boolean; ticketId?: string; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Pengguna belum masuk" };
    }
    
    try {
      // Insert ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: currentUser.id,
          subject,
          status: 'open',
          priority: 'low', // Default priority
          category_id: categoryId,
          is_offline: isOffline
        })
        .select()
        .single();
      
      if (ticketError || !ticketData) {
        console.error('Error creating ticket:', ticketError);
        return { success: false, error: ticketError?.message || "Gagal membuat tiket" };
      }
      
      // Insert initial message
      const { error: messageError } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketData.id,
          sender: currentUser.id,
          sender_role: currentUser.role,
          message
        });
      
      if (messageError) {
        console.error('Error creating ticket message:', messageError);
        // Don't return an error here, as the ticket was created successfully
      }
      
      // Refresh tickets list
      await fetchUserTickets();
      
      return { success: true, ticketId: ticketData.id };
    } catch (err: any) {
      console.error('Error in createTicket:', err);
      return { success: false, error: err.message || "Gagal membuat tiket" };
    }
  };

  // Function to add message to existing ticket
  const addTicketMessage = async (
    ticketId: string, 
    message: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Pengguna belum masuk" };
    }
    
    try {
      // Insert message
      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketId,
          sender: currentUser.id,
          sender_role: currentUser.role,
          message
        });
      
      if (error) {
        console.error('Error adding ticket message:', error);
        return { success: false, error: error.message };
      }
      
      // Update ticket last update time and status
      let newStatus = undefined;
      
      // If helpdesk replies to a closed ticket, reopen it as in-progress
      if (currentUser.role === 'helpdesk' || currentUser.role === 'helpdesk_offline' || currentUser.role === 'admin') {
        const { data: ticket } = await supabase
          .from('tickets')
          .select('status')
          .eq('id', ticketId)
          .single();
        
        if (ticket && ticket.status === 'closed') {
          newStatus = 'in-progress';
        }
      }
      
      const updateData: any = { updated_at: new Date().toISOString() };
      if (newStatus) {
        updateData.status = newStatus;
      }
      
      await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', ticketId);
      
      // Refresh tickets list
      await fetchUserTickets();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error in addTicketMessage:', err);
      return { success: false, error: err.message || "Gagal menambahkan pesan" };
    }
  };

  // Function to add attachment to a ticket
  const addTicketAttachment = async (
    ticketId: string, 
    file: File
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Pengguna belum masuk" };
    }
    
    try {
      // Upload file to storage
      const filePath = `${currentUser.id}/${ticketId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('ticket-attachments')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
          cacheControl: '3600',
          metadata: {
            uploaded_by: currentUser.id,
            ticket_id: ticketId
          }
        });
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return { success: false, error: uploadError.message };
      }
      
      // Get the file URL
      const { data: fileUrl } = supabase.storage
        .from('ticket-attachments')
        .getPublicUrl(filePath);
      
      // Add record to ticket_attachments table
      const { error: attachmentError } = await supabase
        .from('ticket_attachments')
        .insert({
          ticket_id: ticketId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          uploaded_by: currentUser.id
        });
      
      if (attachmentError) {
        console.error('Error recording attachment:', attachmentError);
        return { success: false, error: attachmentError.message };
      }
      
      // Update ticket last update time
      await supabase
        .from('tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId);
      
      return { success: true };
    } catch (err: any) {
      console.error('Error in addTicketAttachment:', err);
      return { success: false, error: err.message || "Gagal menambahkan lampiran" };
    }
  };

  // Function to get attachments for a ticket
  const getTicketAttachments = async (ticketId: string): Promise<TicketAttachment[]> => {
    try {
      const { data, error } = await supabase
        .from('ticket_attachments')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching attachments:', error);
        return [];
      }
      
      return data.map(att => ({
        id: att.id,
        ticket_id: att.ticket_id,
        file_name: att.file_name,
        file_path: att.file_path,
        file_type: att.file_type,
        uploaded_by: att.uploaded_by,
        created_at: att.created_at
      }));
    } catch (err) {
      console.error('Error in getTicketAttachments:', err);
      return [];
    }
  };

  // Function to get a signed URL for a file
  const getFileUrl = (filePath: string): string => {
    const { data } = supabase.storage
      .from('ticket-attachments')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  // Function to fetch tickets for the current user or all tickets for helpdesk/admin
  const fetchUserTickets = async (): Promise<HelpdeskTicket[]> => {
    if (!currentUser) {
      setTickets([]);
      return [];
    }
    
    try {
      let query = supabase
        .from('tickets')
        .select(`
          id,
          user_id,
          subject,
          status,
          priority,
          category_id,
          ticket_categories (name),
          is_offline,
          created_at,
          updated_at,
          assigned_to,
          profiles (name, role)
        `);
      
      // Filter based on role
      if (currentUser.role === 'applicant') {
        // Applicants only see their own tickets
        query = query.eq('user_id', currentUser.id);
      } else if (currentUser.role === 'helpdesk') {
        // Helpdesk operators see only online tickets assigned to them or unassigned
        query = query
          .eq('is_offline', false)
          .or(`assigned_to.is.null,assigned_to.eq.${currentUser.id}`);
      } else if (currentUser.role === 'helpdesk_offline') {
        // Offline helpdesk operators see only offline tickets assigned to them or unassigned
        query = query
          .eq('is_offline', true)
          .or(`assigned_to.is.null,assigned_to.eq.${currentUser.id}`);
      }
      // Admins see all tickets (no filter)
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tickets:', error);
        setTickets([]);
        return [];
      }
      
      // For each ticket, get its messages
      const ticketsWithMessages: HelpdeskTicket[] = [];
      
      for (const ticket of data) {
        const { data: messages, error: messagesError } = await supabase
          .from('ticket_messages')
          .select(`
            id,
            sender,
            sender_role,
            message,
            created_at,
            profiles (name)
          `)
          .eq('ticket_id', ticket.id)
          .order('created_at');
        
        if (messagesError) {
          console.error(`Error fetching messages for ticket ${ticket.id}:`, messagesError);
          continue;
        }
        
        const formattedMessages: TicketMessage[] = messages.map(msg => ({
          id: msg.id,
          ticketId: ticket.id,
          sender: msg.sender,
          senderRole: msg.sender_role as UserRole,
          message: msg.message,
          timestamp: msg.created_at
        }));
        
        ticketsWithMessages.push({
          id: ticket.id,
          userId: ticket.user_id,
          subject: ticket.subject,
          status: ticket.status as 'open' | 'in-progress' | 'closed',
          priority: ticket.priority as 'low' | 'medium' | 'high' | undefined,
          category_id: ticket.category_id,
          categoryName: ticket.ticket_categories?.name,
          is_offline: ticket.is_offline,
          createdAt: ticket.created_at,
          lastUpdated: ticket.updated_at,
          assignedTo: ticket.assigned_to,
          messages: formattedMessages
        });
      }
      
      setTickets(ticketsWithMessages);
      return ticketsWithMessages;
    } catch (err) {
      console.error('Error in fetchUserTickets:', err);
      setTickets([]);
      return [];
    }
  };

  // Function to update ticket status
  const updateTicketStatus = async (
    ticketId: string, 
    status: 'open' | 'in-progress' | 'closed'
  ): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'helpdesk' && 
                          currentUser.role !== 'helpdesk_offline' && 
                          currentUser.role !== 'admin')) {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', ticketId);
      
      if (error) {
        console.error('Error updating ticket status:', error);
        return false;
      }
      
      // Refresh tickets list
      await fetchUserTickets();
      return true;
    } catch (err) {
      console.error('Error in updateTicketStatus:', err);
      return false;
    }
  };

  // Function to update ticket priority
  const updateTicketPriority = async (
    ticketId: string, 
    priority: 'low' | 'medium' | 'high'
  ): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'helpdesk' && 
                          currentUser.role !== 'helpdesk_offline' && 
                          currentUser.role !== 'admin')) {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          priority, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', ticketId);
      
      if (error) {
        console.error('Error updating ticket priority:', error);
        return false;
      }
      
      // Refresh tickets list
      await fetchUserTickets();
      return true;
    } catch (err) {
      console.error('Error in updateTicketPriority:', err);
      return false;
    }
  };

  // Function to assign a ticket to an operator
  const assignTicket = async (
    ticketId: string, 
    operatorId: string
  ): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          assigned_to: operatorId, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', ticketId);
      
      if (error) {
        console.error('Error assigning ticket:', error);
        return false;
      }
      
      // Refresh tickets list
      await fetchUserTickets();
      return true;
    } catch (err) {
      console.error('Error in assignTicket:', err);
      return false;
    }
  };

  // Function to fetch helpdesk operators
  const fetchHelpdeskOperators = async (): Promise<HelpdeskOperator[]> => {
    try {
      const { data, error } = await supabase
        .from('helpdesk_operators')
        .select(`
          id,
          user_id,
          is_active,
          is_offline,
          updated_at,
          profiles:user_id (name, email)
        `);
      
      if (error) {
        console.error('Error fetching operators:', error);
        return [];
      }
      
      // Count assigned tickets for each operator
      const operatorsWithTickets: HelpdeskOperator[] = [];
      
      for (const op of data) {
        const { count, error: countError } = await supabase
          .from('tickets')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', op.user_id)
          .neq('status', 'closed');
        
        if (countError) {
          console.error(`Error counting tickets for operator ${op.id}:`, countError);
        }
        
        // Make sure profiles data exists
        const profileData = op.profiles || { name: 'Unknown', email: 'no-email' };
        
        // Check if profileData is a Supabase error object and handle accordingly
        const name = typeof profileData === 'object' && 'name' in profileData 
          ? profileData.name as string 
          : 'Unknown';
          
        const email = typeof profileData === 'object' && 'email' in profileData 
          ? profileData.email as string 
          : 'no-email';
        
        operatorsWithTickets.push({
          id: op.id,
          user_id: op.user_id,
          name: name,
          email: email,
          assignedTickets: count || 0,
          status: op.is_active ? 'active' : 'inactive',
          is_offline: op.is_offline,
          lastActive: op.updated_at
        });
      }
      
      setOperators(operatorsWithTickets);
      return operatorsWithTickets;
    } catch (err) {
      console.error('Error in fetchHelpdeskOperators:', err);
      return [];
    }
  };

  // Function to add a new helpdesk operator
  const addHelpdeskOperator = async (
    userId: string, 
    isOffline: boolean = false
  ): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      // First, update the user's role
      const { error: roleError } = await supabase
        .rpc('update_user_role', { 
          user_id: userId, 
          new_role: isOffline ? 'helpdesk_offline' : 'helpdesk'
        }) as any;
      
      if (roleError) {
        console.error('Error updating user role:', roleError);
        return false;
      }
      
      // Then, add the user to the helpdesk_operators table
      const { error: operatorError } = await supabase
        .from('helpdesk_operators')
        .insert({
          user_id: userId,
          is_offline: isOffline,
          is_active: true
        });
      
      if (operatorError) {
        console.error('Error adding helpdesk operator:', operatorError);
        return false;
      }
      
      // Refresh operators list
      await fetchHelpdeskOperators();
      return true;
    } catch (err) {
      console.error('Error in addHelpdeskOperator:', err);
      return false;
    }
  };

  // Create provider value object with all functions and state
  const value = {
    currentUser,
    authenticated,
    loading,
    stats,
    tickets,
    categories,
    operators,
    counters,
    queueTickets,
    dailyCapacities,
    error,
    login,
    register,
    logout,
    fetchStats,
    hasRole,
    getUserAssignedGroup,
    confirmGroupJoin,
    assignUserToGroup,
    updateUserRole,
    getApplicants,
    createTicket,
    addTicketMessage,
    addTicketAttachment,
    getTicketAttachments,
    getFileUrl,
    fetchUserTickets: fetchUserTickets,
    getUserTickets: () => tickets,
    updateTicketStatus,
    updateTicketPriority,
    assignTicket,
    fetchHelpdeskOperators,
    addHelpdeskOperator
    // Add more functions as needed
  };

  return (
    <RegistrationsContext.Provider value={value}>
      {children}
    </RegistrationsContext.Provider>
  );
};

// Hook for using the registrations context
export const useRegistrations = () => {
  const context = useContext(RegistrationsContext);
  if (context === null) {
    throw new Error('useRegistrations must be used within a RegistrationsProvider');
  }
  return context;
};

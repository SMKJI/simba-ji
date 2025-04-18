import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, RPCParams } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'helpdesk' | 'helpdesk_offline' | 'content' | 'applicant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  assignedGroupId?: string;
  joinConfirmed?: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  invite_link: string;
  capacity: number;
  member_count: number;
  is_active: boolean;
  isFull: boolean;
  count?: number;
  link?: string;
}

export interface StatsData {
  total: number;
  groups: Group[];
}

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface RegistrationResult {
  success: boolean;
  error?: string;
  user?: User;
  data?: any;
  registrationId?: number;
  assignedGroup?: string;
  groupLink?: string;
  timestamp?: string;
}

export interface HelpdeskOperator {
  id: string;
  user_id: string;
  name: string;
  email: string;
  assignedTickets: number;
  status: 'active' | 'inactive';
  is_offline: boolean;
  lastActive: string;
}

export interface HelpdeskCounter {
  id: string;
  name: string;
  is_active: boolean;
  operator_id: string | null;
  operatorName?: string;
}

export interface HelpdeskTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in-progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  category_id?: string;
  categoryName?: string;
  is_offline: boolean;
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
  senderName?: string;
}

export interface TicketCategory {
  id: string;
  name: string;
  description: string | null;
  is_offline: boolean;
}

export interface QueueTicket {
  id: string;
  user_id: string;
  queue_number: number;
  category_id: string;
  categoryName?: string;
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'skipped';
  counter_id: string | null;
  counterName?: string;
  operator_id: string | null;
  operatorName?: string;
  created_at: string;
  served_at: string | null;
  completed_at: string | null;
  updated_at?: string;
}

export interface DailyCapacity {
  id: string;
  date: string;
  online_capacity: number;
  offline_capacity: number;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  uploaded_by: string;
  created_at: string;
}

const RegistrationsContext = createContext<any>(null);

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

  useEffect(() => {
    const fetchUserAndSession = async () => {
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
              assignedGroupId: profileData.assigned_group_id || undefined,
              joinConfirmed: profileData.join_confirmed || false
            };
            
            setCurrentUser(user);
            setAuthenticated(true);
          }
        }
        
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
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        if (event === 'SIGNED_IN' && session) {
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
              assignedGroupId: profileData.assigned_group_id || undefined,
              joinConfirmed: profileData.join_confirmed || false
            };
            
            setCurrentUser(user);
            setAuthenticated(true);
          }
          
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

  const fetchStats = async () => {
    try {
      const { data: groups, error: groupsError } = await supabase
        .from('whatsapp_groups')
        .select('*')
        .order('name');
      
      if (groupsError) {
        console.error('Error fetching groups:', groupsError);
        return;
      }
      
      const { count: totalCount, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'applicant');
      
      if (countError) {
        console.error('Error fetching total count:', countError);
        return;
      }
      
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

  const login = async (email: string, password: string): Promise<LoginResult> => {
    console.log("Login function called with:", email);
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error);
        setLoading(false);
        return { success: false, error: error.message };
      }
      
      console.log("Supabase login successful, user:", data.user);
      
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError || !profile) {
          console.error("Profile fetch error:", profileError);
          setLoading(false);
          return { success: false, error: 'Profil pengguna tidak ditemukan' };
        }
        
        const user: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          avatarUrl: profile.avatar_url,
          assignedGroupId: profile.assigned_group_id || undefined,
          joinConfirmed: profile.join_confirmed || false
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

  const register = async (email: string, password: string, name: string): Promise<RegistrationResult> => {
    console.log("Register function called with:", email, name);
    setLoading(true);
    
    try {
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
        console.error("Registration error:", error);
        setLoading(false);
        return { success: false, error: error.message };
      }
      
      console.log("Registration successful, user:", data.user);
      
      if (data.user) {
        if (data.session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (profileError) {
            console.error("Profile fetch error:", profileError);
            setLoading(false);
            return { success: false, error: 'Profil pengguna tidak ditemukan' };
          }
          
          const user: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role as UserRole,
            avatarUrl: profile.avatar_url,
            assignedGroupId: profile.assigned_group_id || undefined,
            joinConfirmed: profile.join_confirmed || false
          };
          
          setCurrentUser(user);
          setAuthenticated(true);
          setLoading(false);
          return { success: true, user, data: profile };
        }
        
        setLoading(false);
        return { 
          success: true, 
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: name,
            role: 'applicant' as UserRole
          },
          data: {
            id: data.user.id,
            email: data.user.email || '',
            name: name,
          }
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

  const submitRegistration = async (formData: any): Promise<{success: boolean, error?: string, data?: any}> => {
    try {
      const registrationData = {
        ...formData,
        timestamp: new Date().toISOString()
      };
      
      console.log("Storing registration data:", registrationData);
      
      sessionStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      return {
        success: true,
        data: registrationData
      };
    } catch (err: any) {
      console.error("Error storing registration data:", err);
      return {
        success: false,
        error: err.message || "Failed to store registration data"
      };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      sessionStorage.removeItem('currentUser');
      setCurrentUser(null);
      setAuthenticated(false);
    } catch (err) {
      console.error('Error in logout:', err);
    }
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    
    if (Array.isArray(role)) {
      return role.includes(currentUser.role);
    }
    
    return currentUser.role === role;
  };

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

  const confirmGroupJoin = async () => {
    if (!currentUser) {
      return { success: false, error: "Pengguna belum masuk" };
    }
    
    try {
      const params: RPCParams = { user_id: currentUser.id };
      
      const { data, error } = await supabase
        .rpc('confirm_group_join', params);
      
      if (error) {
        console.error('Error confirming group join:', error);
        return { success: false, error: error.message };
      }
      
      setCurrentUser(prev => {
        if (prev) {
          return { ...prev, joinConfirmed: true };
        }
        return prev;
      });
      
      return { success: true };
    } catch (err: any) {
      console.error('Error in confirmGroupJoin:', err);
      return { success: false, error: err.message || "Gagal memperbarui status bergabung" };
    }
  };

  const assignUserToGroup = async (userId: string, groupId: string): Promise<boolean> => {
    try {
      const params: RPCParams = { user_id: userId, group_id: groupId };
      
      const { data, error } = await supabase
        .rpc('assign_user_to_group', params);
      
      if (error) {
        console.error('Error assigning user to group:', error);
        return false;
      }
      
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(prev => {
          if (prev) {
            return { ...prev, assignedGroupId: groupId, joinConfirmed: false };
          }
          return prev;
        });
      }
      
      await fetchStats();
      
      return !!data;
    } catch (err) {
      console.error('Error in assignUserToGroup:', err);
      return false;
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    try {
      const params: RPCParams = { user_id: userId, new_role: newRole };
      
      const { data, error } = await supabase
        .rpc('update_user_role', params);
      
      if (error) {
        console.error('Error updating user role:', error);
        return false;
      }
      
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

  const getApplicants = async () => {
    if (!currentUser || currentUser.role !== 'admin') {
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'applicant')
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
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: currentUser.id,
          subject,
          status: 'open',
          priority: 'low',
          category_id: categoryId,
          is_offline: isOffline
        })
        .select()
        .single();
      
      if (ticketError || !ticketData) {
        console.error('Error creating ticket:', ticketError);
        return { success: false, error: ticketError?.message || "Gagal membuat tiket" };
      }
      
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
      }
      
      await fetchUserTickets();
      
      return { success: true, ticketId: ticketData.id };
    } catch (err: any) {
      console.error('Error in createTicket:', err);
      return { success: false, error: err.message || "Gagal membuat tiket" };
    }
  };

  const addTicketMessage = async (
    ticketId: string, 
    message: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Pengguna belum masuk" };
    }
    
    try {
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
      
      let newStatus = undefined;
      
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
      
      await fetchUserTickets();
      
      return { success: true };
    } catch (err: any) {
      console.error('Error in addTicketMessage:', err);
      return { success: false, error: err.message || "Gagal menambahkan pesan" };
    }
  };

  const addTicketAttachment = async (
    ticketId: string, 
    file: File
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Pengguna belum masuk" };
    }
    
    try {
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
      
      const { data: fileUrl } = supabase.storage
        .from('ticket-attachments')
        .getPublicUrl(filePath);
      
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
      
      return data.map((att: any) => ({
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

  const getFileUrl = (filePath: string): string => {
    const { data } = supabase.storage
      .from('ticket-attachments')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

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
      
      if (currentUser.role === 'applicant') {
        query = query.eq('user_id', currentUser.id);
      } else if (currentUser.role === 'helpdesk') {
        query = query
          .eq('is_offline', false)
          .or(`assigned_to.is.null,assigned_to.eq.${currentUser.id}`);
      } else if (currentUser.role === 'helpdesk_offline') {
        query = query
          .eq('is_offline', true)
          .or(`assigned_to.is.null,assigned_to.eq.${currentUser.id}`);
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tickets:', error);
        setTickets([]);
        return [];
      }
      
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
        
        const formattedMessages: TicketMessage[] = messages.map((msg: any) => {
          let senderName = 'Unknown';
          
          if (msg.profiles) {
            if (typeof msg.profiles === 'object' && msg.profiles !== null && 'name' in msg.profiles) {
              senderName = msg.profiles.name;
            }
          }
          
          return {
            id: msg.id,
            ticketId: ticket.id,
            sender: msg.sender,
            senderRole: msg.sender_role as UserRole,
            message: msg.message,
            timestamp: msg.created_at,
            senderName: senderName,
          };
        });

        let categoryName: string | undefined = undefined;
        if (ticket.ticket_categories) {
          if (typeof ticket.ticket_categories === 'object' && 
              ticket.ticket_categories !== null && 
              'name' in ticket.ticket_categories) {
            categoryName = ticket.ticket_categories.name as string;
          }
        }
        
        ticketsWithMessages.push({
          id: ticket.id,
          userId: ticket.user_id,
          subject: ticket.subject,
          status: ticket.status as 'open' | 'in-progress' | 'closed',
          priority: ticket.priority as 'low' | 'medium' | 'high' | undefined,
          category_id: ticket.category_id,
          categoryName: categoryName,
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

  const fetchHelpdeskOperators = async () => {
    if (!currentUser) {
      setOperators([]);
      return [];
    }
    
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
        setOperators([]);
        return [];
      }
      
      const formattedOperators: HelpdeskOperator[] = data.map((op: any) => {
        let operatorName = 'Unknown';
        let operatorEmail = '';
        
        if (op.profiles) {
          if (typeof op.profiles === 'object' && op.profiles !== null) {
            operatorName = op.profiles.name || 'Unknown';
            operatorEmail = op.profiles.email || '';
          }
        }
        
        return {
          id: op.id,
          user_id: op.user_id,
          name: operatorName,
          email: operatorEmail,
          assignedTickets: 0,
          status: op.is_active ? 'active' : 'inactive',
          is_offline: op.is_offline,
          lastActive: op.updated_at
        };
      });
      
      const operatorsWithTicketCounts = formattedOperators.map(operator => {
        const assignedTickets = tickets.filter(ticket => ticket.assignedTo === operator.user_id).length;
        return { ...operator, assignedTickets };
      });
      
      setOperators(operatorsWithTicketCounts);
      return operatorsWithTicketCounts;
    } catch (err) {
      console.error('Error in fetchHelpdeskOperators:', err);
      setOperators([]);
      return [];
    }
  };

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
      
      await fetchUserTickets();
      
      return true;
    } catch (err) {
      console.error('Error in updateTicketStatus:', err);
      return false;
    }
  };

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
      
      await fetchUserTickets();
      
      return true;
    } catch (err) {
      console.error('Error in updateTicketPriority:', err);
      return false;
    }
  };

  const assignTicketToOperator = async (
    ticketId: string, 
    operatorId: string | null
  ): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          assigned_to: operatorId, 
          updated_at: new Date().toISOString(),
          status: operatorId ? 'in-progress' : 'open'
        })
        .eq('id', ticketId);
      
      if (error) {
        console.error('Error assigning ticket to operator:', error);
        return false;
      }
      
      await fetchUserTickets();
      
      return true;
    } catch (err) {
      console.error('Error in assignTicketToOperator:', err);
      return false;
    }
  };

  const getHelpdeskOperators = () => {
    return operators;
  };

  const getUserTickets = () => {
    return tickets;
  };

  return (
    <RegistrationsContext.Provider value={{ 
      stats, 
      loading, 
      error, 
      authenticated, 
      currentUser,
      tickets,
      categories,
      operators,
      counters,
      queueTickets,
      dailyCapacities,
      login,
      register,
      logout,
      submitRegistration,
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
      updateTicketStatus,
      updateTicketPriority,
      assignTicketToOperator,
      fetchHelpdeskOperators,
      getHelpdeskOperators,
      fetchUserTickets,
      getUserTickets,
      fetchStats
    }}>
      {children}
    </RegistrationsContext.Provider>
  );
};

export const useRegistrations = () => {
  return useContext(RegistrationsContext);
};

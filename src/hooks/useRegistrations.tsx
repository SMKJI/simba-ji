
import { useState, useEffect } from 'react';
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

export const useRegistrations = () => {
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
            // Get the user's assigned group, if any
            const { data: groupData } = await supabase
              .from('user_whatsapp_groups')
              .select(`
                id,
                group_id,
                whatsapp_groups (
                  id,
                  name,
                  invite_link
                )
              `)
              .eq('user_id', session.user.id)
              .single();
            
            const user: User = {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role as UserRole,
              avatarUrl: profileData.avatar_url,
              assignedGroupId: groupData?.group_id || undefined,
              joinConfirmed: !!groupData // If they have a group assignment, they're confirmed
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
            // Get the user's assigned group, if any
            const { data: groupData } = await supabase
              .from('user_whatsapp_groups')
              .select(`
                id,
                group_id,
                whatsapp_groups (
                  id,
                  name,
                  invite_link
                )
              `)
              .eq('user_id', session.user.id)
              .single();
            
            const user: User = {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role as UserRole,
              avatarUrl: profileData.avatar_url,
              assignedGroupId: groupData?.group_id || undefined,
              joinConfirmed: !!groupData // If they have a group assignment, they're confirmed
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

  // Fetch WhatsApp groups and registration stats
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
        
        // Get user's assigned group if they're an applicant
        let assignedGroupId;
        if (profile.role === 'applicant') {
          const { data: groupData } = await supabase
            .from('user_whatsapp_groups')
            .select('group_id')
            .eq('user_id', data.user.id)
            .single();
          
          assignedGroupId = groupData?.group_id;
        }
        
        const user: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          avatarUrl: profile.avatar_url,
          assignedGroupId,
          joinConfirmed: !!assignedGroupId
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
            role: profile.role,
            avatarUrl: profile.avatar_url
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
            role: 'applicant'
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
    if (!currentUser || !currentUser.assignedGroupId) {
      return { success: false, error: "Pengguna belum masuk atau tidak memiliki grup yang ditugaskan" };
    }
    
    try {
      // In a real app, this would update the database
      // Update the current user state
      setCurrentUser(prev => {
        if (prev) {
          return { ...prev, joinConfirmed: true };
        }
        return prev;
      });
      
      // Also update the joinConfirmed flag in the database if needed
      // We're using the user_whatsapp_groups table to track this
      
      return { success: true };
    } catch (err) {
      console.error('Error in confirmGroupJoin:', err);
      return { success: false, error: "Gagal memperbarui status bergabung" };
    }
  };

  // Function to assign a user to a WhatsApp group
  const assignUserToGroup = async (userId: string, groupId: string): Promise<boolean> => {
    try {
      // Check if user is already in a group
      const { data: existingGroup, error: checkError } = await supabase
        .from('user_whatsapp_groups')
        .select('id')
        .eq('user_id', userId);
      
      if (checkError) {
        console.error('Error checking existing group:', checkError);
        return false;
      }
      
      // If user is already in a group, update the assignment
      if (existingGroup && existingGroup.length > 0) {
        const { error: updateError } = await supabase
          .from('user_whatsapp_groups')
          .update({ group_id: groupId })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error('Error updating group assignment:', updateError);
          return false;
        }
      } else {
        // Create a new assignment
        const { error: insertError } = await supabase
          .from('user_whatsapp_groups')
          .insert({ user_id: userId, group_id: groupId });
        
        if (insertError) {
          console.error('Error inserting group assignment:', insertError);
          return false;
        }
      }
      
      // If the current user is being assigned, update the local state
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(prev => {
          if (prev) {
            return { ...prev, assignedGroupId: groupId };
          }
          return prev;
        });
      }
      
      return true;
    } catch (err) {
      console.error('Error in assignUserToGroup:', err);
      return false;
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
          senderRole: msg.sender_role,
          message: msg.message,
          timestamp: msg.created_at
        }));
        
        ticketsWithMessages.push({
          id: ticket.id,
          userId: ticket.user_id,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
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
          profiles (name, email)
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
        
        operatorsWithTickets.push({
          id: op.id,
          user_id: op.user_id,
          name: op.profiles.name,
          email: op.profiles.email,
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
        .from('profiles')
        .update({ 
          role: isOffline ? 'helpdesk_offline' : 'helpdesk',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (roleError) {
        console.error('Error updating user role:', roleError);
        return false;
      }
      
      // Then, add them as an operator
      const { error } = await supabase
        .from('helpdesk_operators')
        .insert({
          user_id: userId,
          is_active: true,
          is_offline: isOffline
        });
      
      if (error) {
        console.error('Error adding operator:', error);
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

  // Function to update operator status
  const updateOperatorStatus = async (
    operatorId: string, 
    isActive: boolean
  ): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('helpdesk_operators')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', operatorId);
      
      if (error) {
        console.error('Error updating operator status:', error);
        return false;
      }
      
      // Refresh operators list
      await fetchHelpdeskOperators();
      return true;
    } catch (err) {
      console.error('Error in updateOperatorStatus:', err);
      return false;
    }
  };

  // Function to fetch helpdesk counters for offline helpdesk
  const fetchHelpdeskCounters = async (): Promise<HelpdeskCounter[]> => {
    try {
      const { data, error } = await supabase
        .from('helpdesk_counters')
        .select(`
          id,
          name,
          is_active,
          operator_id,
          helpdesk_operators (
            id,
            profiles (name)
          )
        `)
        .order('name');
      
      if (error) {
        console.error('Error fetching counters:', error);
        return [];
      }
      
      const formattedCounters: HelpdeskCounter[] = data.map(counter => ({
        id: counter.id,
        name: counter.name,
        is_active: counter.is_active,
        operator_id: counter.operator_id,
        operatorName: counter.helpdesk_operators?.profiles?.name
      }));
      
      setCounters(formattedCounters);
      return formattedCounters;
    } catch (err) {
      console.error('Error in fetchHelpdeskCounters:', err);
      return [];
    }
  };

  // Function to add a new helpdesk counter
  const addHelpdeskCounter = async (name: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('helpdesk_counters')
        .insert({
          name,
          is_active: true
        });
      
      if (error) {
        console.error('Error adding counter:', error);
        return false;
      }
      
      // Refresh counters list
      await fetchHelpdeskCounters();
      return true;
    } catch (err) {
      console.error('Error in addHelpdeskCounter:', err);
      return false;
    }
  };

  // Function to update counter status
  const updateCounterStatus = async (
    counterId: string, 
    isActive: boolean
  ): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('helpdesk_counters')
        .update({ is_active: isActive })
        .eq('id', counterId);
      
      if (error) {
        console.error('Error updating counter status:', error);
        return false;
      }
      
      // Refresh counters list
      await fetchHelpdeskCounters();
      return true;
    } catch (err) {
      console.error('Error in updateCounterStatus:', err);
      return false;
    }
  };

  // Function to assign operator to counter
  const assignOperatorToCounter = async (
    counterId: string, 
    operatorId: string | null
  ): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('helpdesk_counters')
        .update({ operator_id: operatorId })
        .eq('id', counterId);
      
      if (error) {
        console.error('Error assigning operator to counter:', error);
        return false;
      }
      
      // Refresh counters list
      await fetchHelpdeskCounters();
      return true;
    } catch (err) {
      console.error('Error in assignOperatorToCounter:', err);
      return false;
    }
  };

  // Function to create a queue ticket for offline helpdesk
  const createQueueTicket = async (
    categoryId: string
  ): Promise<{ success: boolean; queueNumber?: number; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: "Pengguna belum masuk" };
    }
    
    try {
      // Check if the user already has an active ticket
      const { data: existingTickets, error: checkError } = await supabase
        .from('queue_tickets')
        .select('*')
        .eq('user_id', currentUser.id)
        .in('status', ['waiting', 'called', 'serving'])
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing tickets:', checkError);
        return { success: false, error: checkError.message };
      }
      
      if (existingTickets) {
        return { 
          success: false, 
          error: "Anda sudah memiliki nomor antrean yang aktif", 
          queueNumber: existingTickets.queue_number 
        };
      }
      
      // Check daily capacity
      const today = new Date().toISOString().split('T')[0];
      const { data: capacity, error: capacityError } = await supabase
        .from('daily_helpdesk_capacity')
        .select('offline_capacity')
        .eq('date', today)
        .single();
      
      if (capacityError) {
        console.error('Error checking capacity:', capacityError);
        // Continue anyway, using default capacity
      }
      
      // Count today's tickets
      const { count: todayCount, error: countError } = await supabase
        .from('queue_tickets')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);
      
      if (countError) {
        console.error('Error counting today\'s tickets:', countError);
        return { success: false, error: countError.message };
      }
      
      // Check if we're at capacity
      const dailyCapacity = capacity?.offline_capacity || 30;
      if (todayCount && todayCount >= dailyCapacity) {
        return { 
          success: false, 
          error: "Kuota harian telah penuh. Silakan coba lagi besok." 
        };
      }
      
      // Create the queue ticket
      const { data: ticket, error: insertError } = await supabase
        .from('queue_tickets')
        .insert({
          user_id: currentUser.id,
          category_id: categoryId,
          status: 'waiting'
        })
        .select()
        .single();
      
      if (insertError || !ticket) {
        console.error('Error creating queue ticket:', insertError);
        return { success: false, error: insertError?.message || "Gagal membuat tiket antrean" };
      }
      
      // Refresh queue tickets list
      await fetchQueueTickets();
      
      return { 
        success: true, 
        queueNumber: ticket.queue_number 
      };
    } catch (err: any) {
      console.error('Error in createQueueTicket:', err);
      return { success: false, error: err.message || "Gagal membuat tiket antrean" };
    }
  };

  // Function to fetch queue tickets
  const fetchQueueTickets = async (): Promise<QueueTicket[]> => {
    if (!currentUser) {
      setQueueTickets([]);
      return [];
    }
    
    try {
      let query = supabase
        .from('queue_tickets')
        .select(`
          id,
          user_id,
          queue_number,
          category_id,
          status,
          counter_id,
          operator_id,
          created_at,
          served_at,
          completed_at,
          ticket_categories (name),
          helpdesk_counters (name),
          profiles (name)
        `);
      
      // Filter based on role and status
      if (currentUser.role === 'applicant') {
        // Applicants only see their own queue tickets
        query = query.eq('user_id', currentUser.id);
      } else if (currentUser.role === 'helpdesk_offline') {
        // Offline helpdesk operators see tickets in their counter or unassigned waiting tickets
        // Get the operator's assigned counter
        const { data: counterData } = await supabase
          .from('helpdesk_counters')
          .select('id')
          .eq('operator_id', currentUser.id)
          .maybeSingle();
        
        if (counterData) {
          query = query.or(`counter_id.is.null,counter_id.eq.${counterData.id}`);
        }
      }
      // Admins see all tickets (no filter)
      
      const { data, error } = await query.order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching queue tickets:', error);
        setQueueTickets([]);
        return [];
      }
      
      const formattedTickets: QueueTicket[] = data.map(ticket => ({
        id: ticket.id,
        user_id: ticket.user_id,
        queue_number: ticket.queue_number,
        category_id: ticket.category_id,
        categoryName: ticket.ticket_categories?.name,
        status: ticket.status,
        counter_id: ticket.counter_id,
        counterName: ticket.helpdesk_counters?.name,
        operator_id: ticket.operator_id,
        operatorName: ticket.profiles?.name,
        created_at: ticket.created_at,
        served_at: ticket.served_at,
        completed_at: ticket.completed_at
      }));
      
      setQueueTickets(formattedTickets);
      return formattedTickets;
    } catch (err) {
      console.error('Error in fetchQueueTickets:', err);
      setQueueTickets([]);
      return [];
    }
  };

  // Function to update queue ticket status
  const updateQueueTicketStatus = async (
    ticketId: string, 
    status: 'waiting' | 'called' | 'serving' | 'completed' | 'skipped'
  ): Promise<boolean> => {
    if (!currentUser || (currentUser.role !== 'helpdesk_offline' && currentUser.role !== 'admin')) {
      return false;
    }
    
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };
      
      // Add additional data based on status
      if (status === 'called' || status === 'serving') {
        // Get the operator's assigned counter
        const { data: counterData } = await supabase
          .from('helpdesk_counters')
          .select('id')
          .eq('operator_id', currentUser.id)
          .maybeSingle();
        
        if (counterData) {
          updateData.counter_id = counterData.id;
          updateData.operator_id = currentUser.id;
        }
        
        if (status === 'serving') {
          updateData.served_at = new Date().toISOString();
        }
      } else if (status === 'completed' || status === 'skipped') {
        updateData.completed_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('queue_tickets')
        .update(updateData)
        .eq('id', ticketId);
      
      if (error) {
        console.error('Error updating queue ticket status:', error);
        return false;
      }
      
      // Refresh queue tickets list
      await fetchQueueTickets();
      return true;
    } catch (err) {
      console.error('Error in updateQueueTicketStatus:', err);
      return false;
    }
  };

  // Function to fetch daily helpdesk capacity
  const fetchDailyCapacity = async (): Promise<DailyCapacity[]> => {
    try {
      const { data, error } = await supabase
        .from('daily_helpdesk_capacity')
        .select('*')
        .order('date');
      
      if (error) {
        console.error('Error fetching daily capacity:', error);
        return [];
      }
      
      const formattedCapacity: DailyCapacity[] = data.map(cap => ({
        id: cap.id,
        date: cap.date,
        online_capacity: cap.online_capacity,
        offline_capacity: cap.offline_capacity
      }));
      
      setDailyCapacities(formattedCapacity);
      return formattedCapacity;
    } catch (err) {
      console.error('Error in fetchDailyCapacity:', err);
      return [];
    }
  };

  // Function to update daily capacity
  const updateDailyCapacity = async (
    date: string, 
    onlineCapacity: number, 
    offlineCapacity: number
  ): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      // Check if date exists
      const { data: existingData, error: checkError } = await supabase
        .from('daily_helpdesk_capacity')
        .select('id')
        .eq('date', date)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking capacity:', checkError);
        return false;
      }
      
      let error;
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('daily_helpdesk_capacity')
          .update({ 
            online_capacity: onlineCapacity,
            offline_capacity: offlineCapacity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
        
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('daily_helpdesk_capacity')
          .insert({
            date,
            online_capacity: onlineCapacity,
            offline_capacity: offlineCapacity
          });
        
        error = insertError;
      }
      
      if (error) {
        console.error('Error updating capacity:', error);
        return false;
      }
      
      // Refresh capacity list
      await fetchDailyCapacity();
      return true;
    } catch (err) {
      console.error('Error in updateDailyCapacity:', err);
      return false;
    }
  };

  // Function to get applicants
  const getApplicants = async () => {
    if (!currentUser || currentUser.role !== 'admin') {
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          created_at,
          user_whatsapp_groups (
            id,
            whatsapp_groups (name)
          )
        `)
        .eq('role', 'applicant')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching applicants:', error);
        return [];
      }
      
      return data.map(applicant => ({
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
        registeredAt: applicant.created_at,
        group: applicant.user_whatsapp_groups[0]?.whatsapp_groups?.name || 'Belum ditugaskan'
      }));
    } catch (err) {
      console.error('Error in getApplicants:', err);
      return [];
    }
  };

  // Function to update user role
  const updateUserRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating user role:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error in updateUserRole:', err);
      return false;
    }
  };

  // Function to create a new WhatsApp group
  const createGroup = async (groupData: { 
    name: string; 
    capacity: number; 
    link: string;
    description?: string;
  }): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('whatsapp_groups')
        .insert({
          name: groupData.name,
          description: groupData.description || null,
          invite_link: groupData.link,
          capacity: groupData.capacity,
          is_active: true
        });
      
      if (error) {
        console.error('Error creating group:', error);
        return false;
      }
      
      // Refresh stats
      await fetchStats();
      return true;
    } catch (err) {
      console.error('Error in createGroup:', err);
      return false;
    }
  };

  // Function to update a WhatsApp group
  const updateGroup = async (id: string, groupData: { 
    name?: string; 
    capacity?: number; 
    link?: string;
    description?: string;
    is_active?: boolean;
  }): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      const updateData: any = {};
      
      if (groupData.name !== undefined) updateData.name = groupData.name;
      if (groupData.capacity !== undefined) updateData.capacity = groupData.capacity;
      if (groupData.link !== undefined) updateData.invite_link = groupData.link;
      if (groupData.description !== undefined) updateData.description = groupData.description;
      if (groupData.is_active !== undefined) updateData.is_active = groupData.is_active;
      
      updateData.updated_at = new Date().toISOString();
      
      const { error } = await supabase
        .from('whatsapp_groups')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating group:', error);
        return false;
      }
      
      // Refresh stats
      await fetchStats();
      return true;
    } catch (err) {
      console.error('Error in updateGroup:', err);
      return false;
    }
  };

  // Function to delete a WhatsApp group
  const deleteGroup = async (id: string): Promise<boolean> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }
    
    try {
      // Check if group has members
      const { data: group, error: groupError } = await supabase
        .from('whatsapp_groups')
        .select('member_count')
        .eq('id', id)
        .single();
      
      if (groupError) {
        console.error('Error fetching group:', groupError);
        return false;
      }
      
      if (group.member_count > 0) {
        toast({
          title: "Gagal",
          description: "Tidak dapat menghapus grup yang memiliki anggota",
          variant: "destructive"
        });
        return false;
      }
      
      const { error } = await supabase
        .from('whatsapp_groups')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting group:', error);
        return false;
      }
      
      // Refresh stats
      await fetchStats();
      return true;
    } catch (err) {
      console.error('Error in deleteGroup:', err);
      return false;
    }
  };

  return { 
    stats, 
    loading, 
    error, 
    login,
    register,
    logout, 
    currentUser, 
    authenticated,
    hasRole,
    getUserAssignedGroup,
    confirmGroupJoin,
    assignUserToGroup,
    createTicket,
    addTicketMessage,
    addTicketAttachment,
    getTicketAttachments,
    getFileUrl,
    fetchUserTickets,
    updateTicketStatus,
    updateTicketPriority,
    assignTicket,
    tickets,
    fetchHelpdeskOperators,
    addHelpdeskOperator,
    updateOperatorStatus,
    operators,
    fetchHelpdeskCounters,
    addHelpdeskCounter,
    updateCounterStatus,
    assignOperatorToCounter,
    counters,
    createQueueTicket,
    fetchQueueTickets,
    updateQueueTicketStatus,
    queueTickets,
    fetchDailyCapacity,
    updateDailyCapacity,
    dailyCapacities,
    getApplicants,
    updateUserRole,
    createGroup,
    updateGroup,
    deleteGroup,
    fetchStats,
    fetchCategories,
    categories
  };
};

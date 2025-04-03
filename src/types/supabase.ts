
// Custom types to interface with Supabase data
// These types will be used throughout the application

export type UserRole = 'admin' | 'helpdesk' | 'helpdesk_offline' | 'content' | 'applicant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  invite_link: string;
  capacity: number;
  member_count: number;
  is_active: boolean;
  isFull: boolean; // Computed property
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
  registrationId: number;
  assignedGroup: string;
  groupLink: string;
  timestamp: string;
}

export interface HelpdeskOperator {
  id: string;
  user_id: string;
  name: string; // Computed from profiles
  email: string; // Computed from profiles
  assignedTickets: number; // Computed
  status: 'active' | 'inactive';
  is_offline: boolean;
  lastActive: string;
}

export interface HelpdeskCounter {
  id: string;
  name: string;
  is_active: boolean;
  operator_id: string | null;
  operatorName?: string; // Computed
}

export interface HelpdeskTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in-progress' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  category_id?: string;
  categoryName?: string; // Computed
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
  categoryName?: string; // Computed
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'skipped';
  counter_id: string | null;
  counterName?: string; // Computed
  operator_id: string | null;
  operatorName?: string; // Computed
  created_at: string;
  served_at: string | null;
  completed_at: string | null;
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


export type UserRole = 'admin' | 'helpdesk' | 'content' | 'applicant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Group {
  id: number;
  name: string;
  count: number;
  capacity: number;
  isFull: boolean;
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
  registrationId: number;
  assignedGroup: string;
  groupLink: string;
  timestamp: string;
}

export interface HelpdeskOperator {
  id: string;
  name: string;
  email: string;
  assignedTickets: number;
  status: 'active' | 'inactive';
  lastActive: string;
}

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

export interface RegistrationsContextType {
  stats: StatsData;
  loading: boolean;
  authenticated: boolean;
  currentUser: User | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  submitRegistration: (data: any) => Promise<{ success: boolean; data?: RegistrationResult; error?: string }>;
  getHelpdeskOperators: () => HelpdeskOperator[];
  resetOperatorPassword: (operatorId: string, newPassword: string) => { success: boolean; password?: string };
  sendOperatorCredentials: (operatorId: string) => boolean;
}


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

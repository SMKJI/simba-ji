
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
} from './useRegistrations';

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
  getUserAssignedGroup: () => Promise<Group | null>;
  confirmGroupJoin: () => Promise<{ success: boolean; error?: string }>;
  createGroup: (groupData: { name: string; capacity: number; link: string }) => boolean;
  updateGroup: (id: string, groupData: { name?: string; capacity?: number; link?: string }) => boolean;
  deleteGroup: (id: string) => boolean;
  getApplicants: () => Promise<any[]>;
  updateApplicant: (id: string, data: any) => boolean;
  deleteApplicant: (id: string) => boolean;
  resetUserPassword: (id: string) => boolean;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<boolean>;
}

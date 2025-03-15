
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

export interface RegistrationsContextType {
  stats: StatsData;
  loading: boolean;
  authenticated: boolean;
  currentUser: User | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  submitRegistration: (data: any) => Promise<{ success: boolean; data?: RegistrationResult; error?: string }>;
}

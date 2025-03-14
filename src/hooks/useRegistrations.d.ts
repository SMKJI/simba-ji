
export type UserRole = 'admin' | 'helpdesk' | 'content' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Group {
  id: string;
  name: string;
  count: number;
  capacity: number;
  isFull: boolean;
  link: string;
}

export interface StatsData {
  total: number;
  groups: Group[];
  loading: boolean;
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
  hasRole: (roles: UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  submitRegistration: (data: any) => Promise<{ success: boolean; data?: RegistrationResult; error?: string }>;
}

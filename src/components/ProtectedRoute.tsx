
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRegistrations, UserRole } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { authenticated, currentUser, hasRole } = useRegistrations();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (authenticated && currentUser && !hasRole(allowedRoles)) {
      toast({
        title: 'Akses Ditolak',
        description: 'Anda tidak memiliki akses ke halaman ini',
        variant: 'destructive',
      });
    }
  }, [authenticated, currentUser, hasRole, allowedRoles, toast]);

  // If not authenticated, redirect to login and save the intended location
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated but doesn't have required role
  if (!hasRole(allowedRoles)) {
    // Redirect to appropriate page based on user role
    if (currentUser) {
      switch (currentUser.role) {
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'helpdesk':
          return <Navigate to="/helpdesk" replace />;
        case 'content':
          return <Navigate to="/content" replace />;
        case 'applicant':
          return <Navigate to="/dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

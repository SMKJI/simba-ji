
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

  if (!authenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(allowedRoles)) {
    // Redirect to home if authenticated but doesn't have required role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

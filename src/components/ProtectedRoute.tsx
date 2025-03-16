
import { Navigate, useLocation } from 'react-router-dom';
import { useRegistrations, UserRole } from '@/hooks/useRegistrations';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { authenticated, currentUser, loading } = useRegistrations();

  // Don't render anything while loading to prevent flashing
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!authenticated || !currentUser) {
    // Redirect to login page with a state parameter containing the current path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has the required role
  if (!allowedRoles.includes(currentUser.role)) {
    // If not authorized, redirect to appropriate page based on role
    switch (currentUser.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'helpdesk':
        return <Navigate to="/helpdesk" replace />;
      case 'content':
        return <Navigate to="/content" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  // If authenticated and authorized, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

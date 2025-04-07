
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '@/types/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, loading } = useAuth();

  console.log("ProtectedRoute - Current user:", user);
  console.log("ProtectedRoute - Loading state:", loading);
  console.log("ProtectedRoute - Allowed roles:", allowedRoles);

  // Don't render anything while loading to prevent flashing
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    // Redirect to login page with a state parameter containing the current path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has the required role
  if (!allowedRoles.includes(user.role)) {
    console.log(`User role ${user.role} not allowed, required: ${allowedRoles.join(', ')}`);
    
    // If not authorized, redirect to appropriate page based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'helpdesk':
      case 'helpdesk_offline':
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

import { NavLink } from 'react-router-dom';
import { useRegistrations } from '@/hooks/useRegistrations';
import { 
  UserCircle, 
  Home, 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  HelpCircle, 
  MessageCircle,
  Ticket
} from 'lucide-react';

const DashboardSidebar = () => {
  const { hasRole } = useRegistrations();
  
  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu</h2>
        <nav className="space-y-1">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            end
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <UserCircle className="h-5 w-5 mr-3" />
            Profil
          </NavLink>
          
          {hasRole('applicant') && (
            <NavLink 
              to="/helpdesk-siswa" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <MessageCircle className="h-5 w-5 mr-3" />
              Bantuan Helpdesk
            </NavLink>
          )}

          
          
          {hasRole('admin') && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Settings className="h-5 w-5 mr-3" />
              Admin
            </NavLink>
          )}
          
          {hasRole(['helpdesk', 'admin']) && (
            <NavLink 
              to="/helpdesk" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Ticket className="h-5 w-5 mr-3" />
              Operator Helpdesk
            </NavLink>
          )}
          
          {hasRole(['content', 'admin']) && (
            <NavLink 
              to="/content" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <FileText className="h-5 w-5 mr-3" />
              Konten
            </NavLink>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

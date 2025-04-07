
import { Link } from 'react-router-dom';
import { LogOut, Settings, User, Users, HelpCircle, MessageCircle, FileText } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/supabase';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const getRoleMenuItems = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return [
        { icon: <Users className="mr-2 h-4 w-4" />, label: 'Dashboard Admin', link: '/admin' },
        { icon: <HelpCircle className="mr-2 h-4 w-4" />, label: 'Helpdesk', link: '/helpdesk' },
        { icon: <FileText className="mr-2 h-4 w-4" />, label: 'Konten', link: '/content' },
      ];
    case 'helpdesk':
      return [
        { icon: <HelpCircle className="mr-2 h-4 w-4" />, label: 'Dashboard Helpdesk', link: '/helpdesk' },
      ];
    case 'content':
      return [
        { icon: <FileText className="mr-2 h-4 w-4" />, label: 'Dashboard Konten', link: '/content' },
      ];
    case 'applicant':
      return [
        { icon: <User className="mr-2 h-4 w-4" />, label: 'Dashboard Siswa', link: '/dashboard' },
        { icon: <MessageCircle className="mr-2 h-4 w-4" />, label: 'Bantuan Helpdesk', link: '/helpdesk-siswa' },
      ];
    default:
      return [];
  }
};

const UserMenu = () => {
  const { logout } = useRegistrations();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Berhasil Keluar",
      description: "Anda telah keluar dari akun Anda",
    });
  };
  
  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/login">
            <User className="mr-2 h-4 w-4" />
            Masuk
          </Link>
        </Button>
      </div>
    );
  }
  
  const roleMenuItems = getRoleMenuItems(user.role);
  const initials = user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">{user.role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {roleMenuItems.length > 0 && (
          <>
            {roleMenuItems.map((item, index) => (
              <DropdownMenuItem key={index} asChild>
                <Link to={item.link} className="flex items-center cursor-pointer">
                  {item.icon}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan Profil
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

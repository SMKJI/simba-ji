
import { useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProfileForm from '@/components/profile/ProfileForm';
import RegistrationStatus from '@/components/profile/RegistrationStatus';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, User, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const { currentUser } = useRegistrations();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Role badge color based on user role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600';
      case 'helpdesk':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'content':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-green-500 hover:bg-green-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow-md">
            <AvatarImage src={currentUser?.avatarUrl || ''} alt={currentUser?.name || 'User'} />
            <AvatarFallback className="text-xl">
              {currentUser?.name ? getInitials(currentUser.name) : 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{currentUser?.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-1" />
                <span>{currentUser?.email}</span>
              </div>
              
              <div className="sm:ml-4 flex items-center gap-2">
                <Badge 
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1"
                >
                  <User className="h-3 w-3" />
                  <span>ID: {currentUser?.id.slice(0, 8)}</span>
                </Badge>
                
                <Badge 
                  className={`flex items-center gap-1 px-2 py-1 ${getRoleBadgeColor(currentUser?.role || 'applicant')}`}
                >
                  <Shield className="h-3 w-3" />
                  <span>{currentUser?.role === 'applicant' ? 'Calon Murid' : currentUser?.role}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="profile" className="flex-1">Profil</TabsTrigger>
            <TabsTrigger value="status" className="flex-1">Status Pendaftaran</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            {currentUser && <ProfileForm currentUser={currentUser} />}
          </TabsContent>
          
          <TabsContent value="status">
            <RegistrationStatus />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

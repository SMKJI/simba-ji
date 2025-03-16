import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserCircle, Bell, Users, Info, HelpCircle, TicketCheck, Home, LogOut, Settings, FileText, MessageCircle } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}
const DashboardLayout = ({
  children,
  className = ''
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    logout,
    hasRole
  } = useRegistrations();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const handleNavigate = (path: string) => {
    navigate(path);
    setActiveTab(path);
  };
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-sidebar/5">
        <Sidebar>
          <SidebarHeader className="py-4">
            <div className="flex items-center gap-2 px-2">
              <img src="/lovable-uploads/3d2a0d2f-58fe-40dd-84d7-7e4ea3f565b8.png" alt="SMKN 1 Kendal" className="h-10 w-auto" />
              <div className="flex flex-col">
                <span className="font-bold text-sm">SPMB</span>
                <span className="text-xs text-sidebar-foreground/70">SMKN 1 Kendal</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            {/* Public Navigation Group */}
            <SidebarGroup>
              <SidebarGroupLabel>Navigasi</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === '/'} onClick={() => handleNavigate('/')} tooltip="Beranda">
                      <Home className="h-5 w-5" />
                      <span>Beranda</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === '/dashboard'} onClick={() => handleNavigate('/dashboard')} tooltip="Dashboard">
                      <UserCircle className="h-5 w-5" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === '/profile'} onClick={() => handleNavigate('/profile')} tooltip="Profil">
                      <Settings className="h-5 w-5" />
                      <span>Profil</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {/* Student Helpdesk - Only for applicants */}
                  {hasRole('applicant') && <SidebarMenuItem>
                      <SidebarMenuButton isActive={activeTab === '/helpdesk-siswa'} onClick={() => handleNavigate('/helpdesk-siswa')} tooltip="Bantuan Helpdesk">
                        <MessageCircle className="h-5 w-5" />
                        <span>Bantuan Helpdesk</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Admin and Helpdesk Only Navigation */}
            {hasRole(['admin', 'helpdesk', 'content']) && <SidebarGroup>
                <SidebarGroupLabel>Pengelolaan</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {hasRole('admin') && <SidebarMenuItem>
                        <SidebarMenuButton isActive={activeTab === '/admin'} onClick={() => handleNavigate('/admin')} tooltip="Admin Panel">
                          <Users className="h-5 w-5" />
                          <span>Admin Panel</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>}
                    
                    {hasRole(['helpdesk', 'admin']) && <SidebarMenuItem>
                        <SidebarMenuButton isActive={activeTab === '/helpdesk'} onClick={() => handleNavigate('/helpdesk')} tooltip="Helpdesk">
                          <TicketCheck className="h-5 w-5" />
                          <span>Helpdesk</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>}
                    
                    {hasRole(['content', 'admin']) && <SidebarMenuItem>
                        <SidebarMenuButton isActive={activeTab === '/content'} onClick={() => handleNavigate('/content')} tooltip="Konten">
                          <FileText className="h-5 w-5" />
                          <span>Konten</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>}

            {/* Information Group */}
            <SidebarGroup>
              <SidebarGroupLabel>Informasi</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === '/programs'} onClick={() => handleNavigate('/programs')} tooltip="Program">
                      <Info className="h-5 w-5" />
                      <span>Program</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === '/faq'} onClick={() => handleNavigate('/faq')} tooltip="FAQ">
                      <HelpCircle className="h-5 w-5" />
                      <span>FAQ</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeTab === '/about'} onClick={() => handleNavigate('/about')} tooltip="Tentang">
                      <Info className="h-5 w-5" />
                      <span>Tentang</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="py-2">
            <div className="px-3">
              {currentUser && <div className="mb-2 px-2 py-2 rounded-md bg-sidebar-accent/50">
                  <p className="text-sm font-medium truncate">{currentUser.name}</p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">{currentUser.email}</p>
                  <p className="text-xs text-sidebar-foreground/70 capitalize">{currentUser.role}</p>
                </div>}
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="mt-0">
          <div className="flex flex-col min-h-screen">
            <div className="flex items-center p-4 border-b bg-background">
              <SidebarTrigger className="mr-2" />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">{currentUser?.name || 'Dashboard'}</h1>
              </div>
            </div>
            
            <div className={`flex-1 p-4 ${className}`}>
              {children}
            </div>
            
            <Footer />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>;
};
export default DashboardLayout;
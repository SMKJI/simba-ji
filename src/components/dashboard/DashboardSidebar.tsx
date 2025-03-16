
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Bell, Users, Info, TicketCheck } from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardSidebar = ({ activeTab, setActiveTab }: DashboardSidebarProps) => {
  return (
    <div className="hidden md:block md:col-span-1">
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden h-full sticky top-4">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="text-xl font-semibold text-primary">
            Menu Aplikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <nav className="flex flex-col">
            <Button 
              variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
              className="justify-start rounded-none h-12 px-6"
              onClick={() => setActiveTab('overview')}
            >
              <UserCircle className="mr-2 h-5 w-5" />
              Informasi Umum
            </Button>
            <Button 
              variant={activeTab === 'group' ? 'secondary' : 'ghost'} 
              className="justify-start rounded-none h-12 px-6"
              onClick={() => setActiveTab('group')}
            >
              <Users className="mr-2 h-5 w-5" />
              Grup WhatsApp
            </Button>
            <Button 
              variant={activeTab === 'helpdesk' ? 'secondary' : 'ghost'} 
              className="justify-start rounded-none h-12 px-6"
              onClick={() => setActiveTab('helpdesk')}
            >
              <TicketCheck className="mr-2 h-5 w-5" />
              Bantuan Helpdesk
            </Button>
            <Button 
              variant={activeTab === 'info' ? 'secondary' : 'ghost'} 
              className="justify-start rounded-none h-12 px-6"
              onClick={() => setActiveTab('info')}
            >
              <Info className="mr-2 h-5 w-5" />
              Informasi PPDB
            </Button>
            <Button 
              variant={activeTab === 'announcements' ? 'secondary' : 'ghost'} 
              className="justify-start rounded-none h-12 px-6"
              onClick={() => setActiveTab('announcements')}
            >
              <Bell className="mr-2 h-5 w-5" />
              Pengumuman
            </Button>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSidebar;


import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import HelpdeskTicketComponent from '@/components/HelpdeskTicket';
import type { HelpdeskTicket } from '@/hooks/useRegistrations';
import OperatorManagement from '@/components/helpdesk/OperatorManagement';
import TicketAllocation from '@/components/helpdesk/TicketAllocation';

const Helpdesk = () => {
  const { getUserTickets, updateTicketStatus, hasRole } = useRegistrations();
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'closed'>('all');

  const isAdmin = hasRole('admin');

  useEffect(() => {
    // Get all tickets
    const allTickets = getUserTickets();
    setTickets(allTickets);
  }, [getUserTickets]);

  // Filter tickets based on search term and status filter
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.messages.some(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || ticket.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusCount = (status: 'open' | 'in-progress' | 'closed') => {
    return tickets.filter(ticket => ticket.status === status).length;
  };

  // Handle closing a ticket modal (empty function for now)
  const handleTicketClose = () => {
    // This would normally close a ticket modal or perform some action
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold">Helpdesk</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Kelola tiket bantuan dari pendaftar
          </p>
        </div>

        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="tickets">Tiket Bantuan</TabsTrigger>
            {isAdmin && <TabsTrigger value="allocation">Alokasi Tiket</TabsTrigger>}
            {isAdmin && <TabsTrigger value="operators">Manajemen Operator</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="tickets">
            <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4 sm:mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari tiket..."
                  className="pl-8 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
                <TabsList className="mb-4 flex flex-wrap">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    Semua
                    <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">{tickets.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="open" className="text-xs sm:text-sm">
                    Terbuka
                    <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">{getStatusCount('open')}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="in-progress" className="text-xs sm:text-sm">
                    Dalam Proses
                    <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">{getStatusCount('in-progress')}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="closed" className="text-xs sm:text-sm">
                    Selesai
                    <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">{getStatusCount('closed')}</Badge>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={filter}>
                  <div className="space-y-4">
                    {filteredTickets.length === 0 ? (
                      <Card className="p-6 sm:p-8 text-center">
                        <p className="text-muted-foreground text-sm sm:text-base">Tidak ada tiket yang ditemukan</p>
                      </Card>
                    ) : (
                      filteredTickets.map(ticket => (
                        <HelpdeskTicketComponent 
                          key={ticket.id} 
                          ticket={ticket}
                          onClose={handleTicketClose}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="allocation">
              <TicketAllocation />
            </TabsContent>
          )}
          
          {isAdmin && (
            <TabsContent value="operators">
              <OperatorManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Helpdesk;

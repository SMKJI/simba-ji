
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRegistrations } from '@/hooks/useRegistrations';
import HelpdeskTicketComponent from '@/components/HelpdeskTicket';
import type { HelpdeskTicket } from '@/hooks/useRegistrations';
import OperatorManagement from '@/components/helpdesk/OperatorManagement';
import TicketAllocation from '@/components/helpdesk/TicketAllocation';
import TicketFilters from '@/components/helpdesk/TicketFilters';

const Helpdesk = () => {
  const { getUserTickets, hasRole } = useRegistrations();
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'closed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const isAdmin = hasRole('admin');

  useEffect(() => {
    // Get all tickets
    const allTickets = getUserTickets();
    setTickets(allTickets);
  }, [getUserTickets]);

  // Filter tickets based on search term, status, priority, and operator filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.messages.some(msg => msg.message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesOperator = operatorFilter === 'all' || ticket.assignedTo === operatorFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesOperator;
  });

  const getStatusCount = (status: 'open' | 'in-progress' | 'closed') => {
    return tickets.filter(ticket => ticket.status === status).length;
  };

  const getPriorityCount = (priority: 'low' | 'medium' | 'high') => {
    return tickets.filter(ticket => ticket.priority === priority).length;
  };

  const handleTicketClose = () => {
    // Refresh tickets after closing a ticket component
    setTickets(getUserTickets());
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setOperatorFilter('all');
    setSearchTerm('');
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
            <TicketFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              operatorFilter={operatorFilter}
              setOperatorFilter={setOperatorFilter}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              resetFilters={resetFilters}
              getPriorityCount={getPriorityCount}
            />

            <div className="overflow-x-auto">
              <Tabs defaultValue="all" onValueChange={(value) => setStatusFilter(value as any)}>
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
                
                <TabsContent value={statusFilter}>
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

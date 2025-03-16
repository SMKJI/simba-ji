
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search } from 'lucide-react';
import { useRegistrations } from '@/hooks/useRegistrations';
import HelpdeskTicketComponent from '@/components/HelpdeskTicket';
import type { HelpdeskTicket } from '@/hooks/useRegistrations';

const Helpdesk = () => {
  const { getUserTickets, updateTicketStatus } = useRegistrations();
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'closed'>('all');

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Helpdesk</h1>
          <p className="text-muted-foreground">
            Kelola tiket bantuan dari pendaftar
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari tiket..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              Semua
              <Badge variant="secondary" className="ml-2">{tickets.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="open">
              Terbuka
              <Badge variant="secondary" className="ml-2">{getStatusCount('open')}</Badge>
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              Dalam Proses
              <Badge variant="secondary" className="ml-2">{getStatusCount('in-progress')}</Badge>
            </TabsTrigger>
            <TabsTrigger value="closed">
              Selesai
              <Badge variant="secondary" className="ml-2">{getStatusCount('closed')}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter}>
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Tidak ada tiket yang ditemukan</p>
                </Card>
              ) : (
                filteredTickets.map(ticket => (
                  <HelpdeskTicketComponent 
                    key={ticket.id} 
                    ticket={ticket}
                    onClose={() => {}} // Add a placeholder function for now
                    updateStatus={updateTicketStatus}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Helpdesk;


import { useState, useEffect } from 'react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NewTicketForm from './NewTicketForm';
import HelpdeskTicket from './HelpdeskTicket';
import TicketCard from './TicketCard';

const TicketList = () => {
  const { getUserTickets } = useRegistrations();
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    setTickets(getUserTickets());
  }, [getUserTickets]);
  
  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filter);
  
  const refreshTickets = () => {
    setTickets(getUserTickets());
    setShowNewTicketForm(false);
  };
  
  if (selectedTicket) {
    return (
      <HelpdeskTicket 
        ticket={selectedTicket} 
        onClose={() => {
          setSelectedTicket(null);
          refreshTickets();
        }} 
      />
    );
  }
  
  if (showNewTicketForm) {
    return (
      <NewTicketForm 
        onClose={() => setShowNewTicketForm(false)} 
        onTicketCreated={refreshTickets} 
      />
    );
  }

  if (!tickets) {
    return (
      <div className="flex justify-center items-center py-8">
        <MessageCircle className="h-6 w-6 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Tiket Bantuan
            </CardTitle>
            <CardDescription>
              Sampaikan pertanyaan atau kendala Anda kepada helpdesk
            </CardDescription>
          </div>
          <Button onClick={() => setShowNewTicketForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tiket Baru
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {filteredTickets.length > 0 ? (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                onClick={setSelectedTicket} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-2">Belum ada tiket</h3>
            <p className="text-muted-foreground mb-4">
              Anda belum memiliki tiket bantuan. Klik tombol di atas untuk membuat tiket baru.
            </p>
            <Button onClick={() => setShowNewTicketForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Buat Tiket Pertama
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketList;


import { useState, useEffect } from 'react';
import { 
  HelpdeskTicket as TicketType, 
  useRegistrations 
} from '@/hooks/useRegistrations';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { MessageCircle, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NewTicketForm from './NewTicketForm';
import HelpdeskTicket from './HelpdeskTicket';

const TicketList = () => {
  const { getUserTickets, hasRole } = useRegistrations();
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'closed'>('all');
  
  useEffect(() => {
    // Update tickets whenever getUserTickets changes
    setTickets(getUserTickets());
  }, [getUserTickets]);
  
  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filter);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'closed':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Terbuka';
      case 'in-progress':
        return 'Diproses';
      case 'closed':
        return 'Selesai';
      default:
        return status;
    }
  };
  
  const refreshTickets = () => {
    // In a real app, this would fetch tickets from the server
    // For now, the state is handled in the useRegistrations hook
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

  // If no tickets are available yet (before useEffect runs)
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
              <div 
                key={ticket.id} 
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start">
                    <MessageCircle className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{ticket.subject}</h3>
                      <p className="text-xs text-muted-foreground">
                        Diperbarui {formatDistanceToNow(new Date(ticket.lastUpdated), { addSuffix: true, locale: id })}
                      </p>
                    </div>
                  </div>
                  <Badge className={`flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    <span>{getStatusText(ticket.status)}</span>
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 pl-7 line-clamp-2">
                  {ticket.messages[ticket.messages.length - 1].message}
                </p>
              </div>
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

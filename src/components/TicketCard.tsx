
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { MessageCircle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HelpdeskTicket } from '@/hooks/useRegistrations';

interface TicketCardProps {
  ticket: HelpdeskTicket;
  onClick: (ticket: HelpdeskTicket) => void;
}

const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case 'medium':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'low':
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      default:
        return null;
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <MessageCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'closed':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
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

  return (
    <div 
      className="p-4 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={() => onClick(ticket)}
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
        <div className="flex space-x-2">
          {ticket.priority && (
            <Badge className={`flex items-center gap-1 ${getPriorityColor(ticket.priority)}`}>
              {getPriorityIcon(ticket.priority)}
              <span>
                {ticket.priority === 'high' ? 'Tinggi' : 
                ticket.priority === 'medium' ? 'Menengah' : 'Rendah'}
              </span>
            </Badge>
          )}
          <Badge className={`flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
            {getStatusIcon(ticket.status)}
            <span>{getStatusText(ticket.status)}</span>
          </Badge>
        </div>
      </div>
      <p className="text-sm text-gray-600 pl-7 line-clamp-2">
        {ticket.messages[ticket.messages.length - 1].message}
      </p>
    </div>
  );
};

export default TicketCard;

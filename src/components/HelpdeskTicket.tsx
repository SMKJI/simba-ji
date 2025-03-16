
import { useState } from 'react';
import { 
  HelpdeskTicket as TicketType, 
  TicketMessage, 
  useRegistrations 
} from '@/hooks/useRegistrations';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { MessageCircle, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface HelpdeskTicketProps {
  ticket: TicketType;
  onClose: () => void;
}

const HelpdeskTicket = ({ ticket, onClose }: HelpdeskTicketProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { currentUser, addTicketMessage, updateTicketStatus } = useRegistrations();
  const { toast } = useToast();
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    const result = addTicketMessage(ticket.id, message.trim());
    setSending(false);
    
    if (result) {
      setMessage('');
      toast({
        title: 'Pesan terkirim',
        description: 'Pesan Anda telah terkirim ke helpdesk',
      });
    } else {
      toast({
        title: 'Gagal mengirim pesan',
        description: 'Terjadi kesalahan saat mengirim pesan',
        variant: 'destructive',
      });
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
  
  const getSenderInitials = (message: TicketMessage) => {
    if (message.senderRole === 'helpdesk') {
      return 'HD';
    } else if (message.senderRole === 'admin') {
      return 'AD';
    } else {
      return 'CM';
    }
  };
  
  const getSenderName = (message: TicketMessage) => {
    if (message.senderRole === 'helpdesk') {
      return 'Helpdesk';
    } else if (message.senderRole === 'admin') {
      return 'Admin';
    } else {
      return 'Anda';
    }
  };
  
  const isSender = (senderId: string) => {
    return currentUser?.id === senderId;
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden h-full flex flex-col">
      <CardHeader className="bg-primary/5 border-b p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg sm:text-xl font-semibold text-primary flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              {ticket.subject}
            </CardTitle>
            <CardDescription className="mt-1">
              Dibuat {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true, locale: id })}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(ticket.status)}>
            {getStatusText(ticket.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 overflow-y-auto flex-grow">
        <div className="space-y-6">
          {ticket.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${isSender(msg.sender) ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex ${isSender(msg.sender) ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[80%]`}>
                <Avatar className={`${isSender(msg.sender) ? 'ml-2' : 'mr-2'} h-8 w-8 bg-primary/20`}>
                  <AvatarFallback className="text-xs">
                    {getSenderInitials(msg)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className={`p-3 rounded-lg mb-1 ${
                    isSender(msg.sender) 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{getSenderName(msg)}</span>
                    <span className="mx-1">•</span>
                    <span>{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true, locale: id })}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="p-4 sm:p-6">
        {ticket.status !== 'closed' ? (
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <Textarea 
              placeholder="Tulis pesan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow resize-none"
              rows={2}
            />
            <div className="flex sm:flex-col gap-2">
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim() || sending}
                className="flex-grow sm:w-auto"
              >
                {sending ? (
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Kirim
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-grow sm:w-auto"
              >
                Tutup
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-between">
            <p className="text-sm text-muted-foreground">Tiket ini telah ditutup.</p>
            <Button variant="outline" onClick={onClose}>Tutup</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default HelpdeskTicket;

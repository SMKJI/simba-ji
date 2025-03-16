
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, User, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRegistrations, HelpdeskTicket } from '@/hooks/useRegistrations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface HelpdeskTicketProps {
  ticket: HelpdeskTicket;
  onClose: () => void;
}

const HelpdeskTicketComponent = ({ ticket, onClose }: HelpdeskTicketProps) => {
  const [newMessage, setNewMessage] = useState('');
  const { addTicketMessage, updateTicketStatus, updateTicketPriority, currentUser, getHelpdeskOperators } = useRegistrations();
  const operators = getHelpdeskOperators();
  
  const handleAddMessage = () => {
    if (newMessage.trim() === '') return;
    
    addTicketMessage(ticket.id, newMessage);
    setNewMessage('');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case 'in-progress': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'closed': return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return "bg-red-100 text-red-800";
      case 'medium': return "bg-yellow-100 text-yellow-800";
      case 'low': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-3 w-3 mr-1" />;
      case 'medium': return <Clock className="h-3 w-3 mr-1" />;
      case 'low': return <CheckCircle2 className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };
  
  const handleStatusChange = (newStatus: 'open' | 'in-progress' | 'closed') => {
    updateTicketStatus(ticket.id, newStatus);
  };

  const handlePriorityChange = (newPriority: 'low' | 'medium' | 'high') => {
    updateTicketPriority(ticket.id, newPriority);
  };
  
  // Get operator name if assigned
  const assignedOperator = ticket.assignedTo 
    ? operators.find(op => op.id === ticket.assignedTo) 
    : null;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{ticket.subject}</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {new Date(ticket.createdAt).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <div className="flex space-x-2">
            {ticket.priority && (
              <Badge 
                variant="outline" 
                className={getPriorityColor(ticket.priority)}
              >
                {getPriorityIcon(ticket.priority)}
                {ticket.priority === 'high' ? 'Prioritas Tinggi' : 
                 ticket.priority === 'medium' ? 'Prioritas Menengah' : 'Prioritas Rendah'}
              </Badge>
            )}
            {assignedOperator && (
              <Badge variant="outline" className="bg-purple-50">
                Ditangani: {assignedOperator.name}
              </Badge>
            )}
            <Badge 
              variant="secondary" 
              className={getStatusColor(ticket.status)}
            >
              {ticket.status === 'open' ? 'Terbuka' : 
               ticket.status === 'in-progress' ? 'Dalam Proses' : 'Selesai'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4 max-h-80 overflow-y-auto px-1">
          {ticket.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-lg ${
                  msg.sender === currentUser?.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center mb-1">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>
                      {msg.senderRole === 'applicant' ? <User className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">
                    {msg.senderRole === 'applicant' ? 'Calon Murid' : 'Helpdesk'}
                  </span>
                  <span className="text-xs ml-2 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Render card footer with input only if ticket is not closed */}
      {ticket.status !== 'closed' && (
        <CardFooter className="flex flex-col space-y-3 pt-0">
          <div className="w-full flex space-x-2">
            <Input
              placeholder="Ketik balasan Anda di sini..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddMessage()}
            />
            <Button onClick={handleAddMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Only show status buttons and priority selector for helpdesk or admin users */}
          {currentUser && currentUser.role !== 'applicant' && (
            <div className="flex w-full justify-between flex-wrap gap-y-2">
              <div className="space-x-2">
                <Button 
                  variant={ticket.status === 'open' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('open')}
                >
                  Terbuka
                </Button>
                <Button 
                  variant={ticket.status === 'in-progress' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('in-progress')}
                >
                  Dalam Proses
                </Button>
                <Button 
                  variant={ticket.status === 'closed' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('closed')}
                >
                  Selesai
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="priority-select" className="text-sm">Prioritas:</Label>
                <Select 
                  value={ticket.priority || 'low'} 
                  onValueChange={(value) => handlePriorityChange(value as 'low' | 'medium' | 'high')}
                >
                  <SelectTrigger id="priority-select" className="w-[140px]">
                    <SelectValue placeholder="Pilih prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Menengah</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default HelpdeskTicketComponent;

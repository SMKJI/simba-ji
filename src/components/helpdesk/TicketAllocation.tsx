
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { useRegistrations, HelpdeskTicket } from '@/hooks/useRegistrations';
import { ArrowRightLeft, RefreshCw, UserCheck } from 'lucide-react';
import HelpdeskTicketComponent from '@/components/HelpdeskTicket';

const TicketAllocation = () => {
  const { toast } = useToast();
  const { 
    getUserTickets, 
    getHelpdeskOperators, 
    assignTicket, 
    balanceTickets 
  } = useRegistrations();
  
  const [isReassignDialogOpen, setIsReassignDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<HelpdeskTicket | null>(null);
  const [selectedOperatorId, setSelectedOperatorId] = useState('');
  
  const tickets = getUserTickets();
  const operators = getHelpdeskOperators().filter(op => op.status === 'active');
  
  // Filter tickets by assigned/unassigned status
  const assignedTickets = tickets.filter(t => t.assignedTo);
  const unassignedTickets = tickets.filter(t => !t.assignedTo);
  
  // Get tickets by operator
  const getTicketsByOperator = (operatorId: string) => {
    return tickets.filter(t => t.assignedTo === operatorId);
  };
  
  const handleManualReassign = () => {
    if (!selectedTicket || !selectedOperatorId) {
      toast({
        title: "Tidak dapat menetapkan tiket",
        description: "Pilih operator terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    
    const success = assignTicket(selectedTicket.id, selectedOperatorId);
    
    if (success) {
      toast({
        title: "Tiket berhasil ditetapkan",
        description: `Tiket telah ditetapkan ke operator yang dipilih`
      });
      setIsReassignDialogOpen(false);
    } else {
      toast({
        title: "Gagal menetapkan tiket",
        description: "Terjadi kesalahan saat mencoba menetapkan tiket",
        variant: "destructive"
      });
    }
  };
  
  const handleBalanceTickets = () => {
    const success = balanceTickets();
    
    if (success) {
      toast({
        title: "Tiket berhasil diseimbangkan",
        description: "Semua tiket telah didistribusikan secara merata ke operator yang aktif"
      });
    } else {
      toast({
        title: "Gagal menyeimbangkan tiket",
        description: "Terjadi kesalahan saat mencoba mendistribusikan tiket",
        variant: "destructive"
      });
    }
  };
  
  const openReassignDialog = (ticket: HelpdeskTicket) => {
    setSelectedTicket(ticket);
    setSelectedOperatorId(ticket.assignedTo || '');
    setIsReassignDialogOpen(true);
  };
  
  // Handle closing a ticket modal (empty function for now)
  const handleTicketClose = () => {
    // This would normally close a ticket modal or perform some action
  };
  
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden mt-6">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Alokasi Tiket Helpdesk
            </CardTitle>
            <CardDescription>
              Kelola dan distribusikan tiket bantuan ke operator
            </CardDescription>
          </div>
          <Button onClick={handleBalanceTickets} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Seimbangkan Semua Tiket
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full bg-muted/50 p-0 border-b rounded-none">
            <TabsTrigger value="overview" className="flex-1 rounded-none py-3">
              Ikhtisar Alokasi
            </TabsTrigger>
            <TabsTrigger value="assigned" className="flex-1 rounded-none py-3">
              Tiket Teralokasi
              <Badge variant="secondary" className="ml-2">{assignedTickets.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unassigned" className="flex-1 rounded-none py-3">
              Tiket Belum Teralokasi
              <Badge variant="secondary" className="ml-2">{unassignedTickets.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {operators.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Belum ada operator helpdesk yang aktif
                </div>
              ) : (
                operators.map((operator) => {
                  const operatorTickets = getTicketsByOperator(operator.id);
                  return (
                    <Card key={operator.id} className="border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">{operator.name}</CardTitle>
                        <CardDescription>{operator.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <div>Tiket yang ditangani</div>
                          <Badge>{operatorTickets.length}</Badge>
                        </div>
                        <div className="space-y-1 mt-4">
                          <div className="text-sm font-medium">Status tiket:</div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-orange-50 text-orange-700">
                              Terbuka: {operatorTickets.filter(t => t.status === 'open').length}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Proses: {operatorTickets.filter(t => t.status === 'in-progress').length}
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              Selesai: {operatorTickets.filter(t => t.status === 'closed').length}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="assigned" className="p-6">
            {assignedTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada tiket yang teralokasi ke operator
              </div>
            ) : (
              <div className="space-y-4">
                {assignedTickets.map((ticket) => (
                  <div key={ticket.id} className="relative">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2 z-10"
                      onClick={() => openReassignDialog(ticket)}
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-1" />
                      Reassign
                    </Button>
                    <HelpdeskTicketComponent 
                      ticket={ticket} 
                      onClose={handleTicketClose} 
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unassigned" className="p-6">
            {unassignedTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada tiket yang belum teralokasi
              </div>
            ) : (
              <div className="space-y-4">
                {unassignedTickets.map((ticket) => (
                  <div key={ticket.id} className="relative">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="absolute top-2 right-2 z-10"
                      onClick={() => openReassignDialog(ticket)}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                    <HelpdeskTicketComponent 
                      ticket={ticket} 
                      onClose={handleTicketClose} 
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Reassign Ticket Dialog */}
      <Dialog open={isReassignDialogOpen} onOpenChange={setIsReassignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tetapkan Tiket ke Operator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedTicket && (
              <div className="p-3 bg-muted rounded-md">
                <p><strong>Subjek:</strong> {selectedTicket.subject}</p>
                <p><strong>Status:</strong> {selectedTicket.status}</p>
                <p><strong>Dibuat:</strong> {new Date(selectedTicket.createdAt).toLocaleString('id-ID')}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="operator-select">Pilih Operator</Label>
              <Select
                value={selectedOperatorId}
                onValueChange={setSelectedOperatorId}
              >
                <SelectTrigger id="operator-select">
                  <SelectValue placeholder="Pilih operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((operator) => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.name} ({operator.assignedTickets} tiket)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReassignDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleManualReassign}>
              Tetapkan Tiket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TicketAllocation;

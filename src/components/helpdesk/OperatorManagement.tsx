
import { useState, useEffect } from 'react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, UserCheck, CheckCircle, XCircle, RotateCw, LucideIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OperatorManagement = () => {
  const { 
    fetchHelpdeskOperators, 
    operators, 
    updateOperatorStatus,
    addHelpdeskOperator,
    getApplicants,
    loading 
  } = useRegistrations();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(true);
  
  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      await fetchHelpdeskOperators();
      
      setLoadingApplicants(true);
      const applicantsData = await getApplicants();
      setApplicants(applicantsData || []);
      setLoadingApplicants(false);
    };
    
    loadData();
  }, [fetchHelpdeskOperators, getApplicants]);
  
  // Handle adding a new operator
  const handleAddOperator = async () => {
    if (!selectedUserId) {
      toast({
        title: "Validasi Gagal",
        description: "Pilih pengguna untuk dijadikan operator",
        variant: "destructive"
      });
      return;
    }
    
    const success = await addHelpdeskOperator(selectedUserId, isOffline);
    
    if (success) {
      toast({
        title: "Berhasil",
        description: `Pengguna telah ditambahkan sebagai operator helpdesk ${isOffline ? 'luring' : 'daring'}`
      });
      setIsAddDialogOpen(false);
      setSelectedUserId('');
      setIsOffline(false);
      
      // Refresh operators list
      await fetchHelpdeskOperators();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat menambahkan operator baru",
        variant: "destructive"
      });
    }
  };
  
  // Handle updating operator status
  const handleToggleStatus = async (operatorId: string, isActive: boolean) => {
    const success = await updateOperatorStatus(operatorId, isActive);
    
    if (success) {
      toast({
        title: "Status Diperbarui",
        description: `Operator berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`
      });
      
      // Refresh operators list
      await fetchHelpdeskOperators();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat memperbarui status operator",
        variant: "destructive"
      });
    }
  };
  
  // Filter operators by type
  const onlineOperators = operators.filter(op => !op.is_offline);
  const offlineOperators = operators.filter(op => op.is_offline);
  
  // Format time from ISO string
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render operator card
  const renderOperatorCard = (operator: any) => {
    return (
      <div key={operator.id} className="p-4 border rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="font-medium">{operator.name}</h3>
            <p className="text-sm text-muted-foreground">{operator.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className={operator.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                {operator.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {operator.assignedTickets} Tiket Aktif
              </Badge>
              <Badge variant="outline" className={operator.is_offline ? 'bg-purple-50 text-purple-700' : 'bg-cyan-50 text-cyan-700'}>
                Helpdesk {operator.is_offline ? 'Luring' : 'Daring'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Terakhir aktif: {formatTime(operator.lastActive)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id={`operator-status-${operator.id}`}
                checked={operator.status === 'active'} 
                onCheckedChange={(checked) => handleToggleStatus(operator.id, checked)}
              />
              <Label htmlFor={`operator-status-${operator.id}`}>
                {operator.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </Label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="text-xl font-semibold text-primary">
            Manajemen Operator Helpdesk
          </CardTitle>
          <CardDescription>
            Kelola operator helpdesk daring dan luring
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Manajemen Operator Helpdesk
            </CardTitle>
            <CardDescription>
              Kelola operator helpdesk daring dan luring
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Operator
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="online" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="online">Helpdesk Daring ({onlineOperators.length})</TabsTrigger>
            <TabsTrigger value="offline">Helpdesk Luring ({offlineOperators.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="online">
            <div className="space-y-4">
              {onlineOperators.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada operator helpdesk daring. Tambahkan operator baru.
                </div>
              ) : (
                onlineOperators.map(renderOperatorCard)
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="offline">
            <div className="space-y-4">
              {offlineOperators.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada operator helpdesk luring. Tambahkan operator baru.
                </div>
              ) : (
                offlineOperators.map(renderOperatorCard)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Add Operator Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Operator Helpdesk</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-select">Pilih Pengguna</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Pilih pengguna" />
                </SelectTrigger>
                <SelectContent>
                  {loadingApplicants ? (
                    <div className="flex justify-center p-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    applicants.map((applicant) => (
                      <SelectItem key={applicant.id} value={applicant.id}>
                        {applicant.name} ({applicant.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="helpdesk-type"
                checked={isOffline} 
                onCheckedChange={setIsOffline}
              />
              <Label htmlFor="helpdesk-type">
                Operator Helpdesk Luring
              </Label>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
              <p className="mb-2">Perhatian:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Operator daring akan menangani tiket bantuan melalui website</li>
                <li>Operator luring akan menangani sistem antrean di loket helpdesk</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddOperator}>
              <UserCheck className="mr-2 h-4 w-4" />
              Tambah Operator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OperatorManagement;

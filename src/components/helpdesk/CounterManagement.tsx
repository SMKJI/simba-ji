
import { useState, useEffect } from 'react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, User, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CounterManagement = () => {
  const { 
    fetchHelpdeskCounters, 
    fetchHelpdeskOperators,
    counters, 
    operators,
    addHelpdeskCounter,
    updateCounterStatus,
    assignOperatorToCounter,
    loading 
  } = useRegistrations();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [newCounterName, setNewCounterName] = useState('');
  const [selectedCounter, setSelectedCounter] = useState<any>(null);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(null);
  
  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchHelpdeskCounters(),
        fetchHelpdeskOperators()
      ]);
    };
    
    loadData();
  }, [fetchHelpdeskCounters, fetchHelpdeskOperators]);
  
  // Handle adding a new counter
  const handleAddCounter = async () => {
    if (!newCounterName) {
      toast({
        title: "Validasi Gagal",
        description: "Nama loket harus diisi",
        variant: "destructive"
      });
      return;
    }
    
    const success = await addHelpdeskCounter(newCounterName);
    
    if (success) {
      toast({
        title: "Berhasil",
        description: `Loket ${newCounterName} berhasil ditambahkan`
      });
      setIsAddDialogOpen(false);
      setNewCounterName('');
      
      // Refresh counters list
      await fetchHelpdeskCounters();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat menambahkan loket baru",
        variant: "destructive"
      });
    }
  };
  
  // Handle updating counter status
  const handleToggleStatus = async (counterId: string, isActive: boolean) => {
    const success = await updateCounterStatus(counterId, isActive);
    
    if (success) {
      toast({
        title: "Status Diperbarui",
        description: `Loket berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`
      });
      
      // Refresh counters list
      await fetchHelpdeskCounters();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat memperbarui status loket",
        variant: "destructive"
      });
    }
  };
  
  // Open assign operator dialog
  const openAssignDialog = (counter: any) => {
    setSelectedCounter(counter);
    setSelectedOperatorId(counter.operator_id);
    setIsAssignDialogOpen(true);
  };
  
  // Handle assigning operator to counter
  const handleAssignOperator = async () => {
    if (!selectedCounter) return;
    
    const success = await assignOperatorToCounter(selectedCounter.id, selectedOperatorId);
    
    if (success) {
      toast({
        title: "Berhasil",
        description: selectedOperatorId 
          ? `Operator berhasil ditugaskan ke ${selectedCounter.name}`
          : `Operator berhasil dihapus dari ${selectedCounter.name}`
      });
      setIsAssignDialogOpen(false);
      
      // Refresh counters list
      await fetchHelpdeskCounters();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat mengatur operator loket",
        variant: "destructive"
      });
    }
  };
  
  // Filter operators to only show offline helpdesk operators
  const offlineOperators = operators.filter(op => op.is_offline && op.status === 'active');
  
  if (loading) {
    return (
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="text-xl font-semibold text-primary">
            Manajemen Loket Helpdesk
          </CardTitle>
          <CardDescription>
            Kelola loket helpdesk luring dan operator yang bertugas
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
              Manajemen Loket Helpdesk
            </CardTitle>
            <CardDescription>
              Kelola loket helpdesk luring dan operator yang bertugas
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Loket
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {counters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada loket helpdesk. Tambahkan loket baru.
          </div>
        ) : (
          <div className="space-y-4">
            {counters.map((counter) => (
              <div key={counter.id} className="p-4 border rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="font-medium">{counter.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className={counter.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
                        {counter.is_active ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                      <Badge variant="outline" className={counter.operator_id ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'}>
                        {counter.operator_id ? `Operator: ${counter.operatorName}` : 'Tidak ada operator'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id={`counter-status-${counter.id}`}
                        checked={counter.is_active} 
                        onCheckedChange={(checked) => handleToggleStatus(counter.id, checked)}
                      />
                      <Label htmlFor={`counter-status-${counter.id}`}>
                        {counter.is_active ? 'Aktif' : 'Nonaktif'}
                      </Label>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openAssignDialog(counter)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {counter.operator_id ? 'Ganti Operator' : 'Tugaskan Operator'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Add Counter Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Loket Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="counter-name">Nama Loket</Label>
              <Input
                id="counter-name"
                value={newCounterName}
                onChange={(e) => setNewCounterName(e.target.value)}
                placeholder="Contoh: Loket 1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddCounter}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Loket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Operator Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCounter ? `Tugaskan Operator ke ${selectedCounter.name}` : 'Tugaskan Operator'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="operator-select">Pilih Operator Helpdesk Luring</Label>
              <Select 
                value={selectedOperatorId || ''} 
                onValueChange={(value) => setSelectedOperatorId(value || null)}
              >
                <SelectTrigger id="operator-select">
                  <SelectValue placeholder="Pilih operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tidak Ada Operator</SelectItem>
                  {offlineOperators.map((operator) => (
                    <SelectItem key={operator.user_id} value={operator.user_id}>
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {offlineOperators.length === 0 && (
              <div className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-700">
                <p>Tidak ada operator helpdesk luring yang aktif. Tambahkan operator terlebih dahulu.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAssignOperator}>
              <UserCheck className="mr-2 h-4 w-4" />
              Tugaskan Operator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CounterManagement;

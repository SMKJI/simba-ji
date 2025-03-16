
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Trash2, MailCheck, UserX, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRegistrations, HelpdeskOperator } from '@/hooks/useRegistrations';

const OperatorManagement = () => {
  const { toast } = useToast();
  const { 
    getHelpdeskOperators, 
    addHelpdeskOperator, 
    updateOperatorStatus, 
    removeHelpdeskOperator, 
    balanceTickets 
  } = useRegistrations();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<HelpdeskOperator | null>(null);
  const [newOperator, setNewOperator] = useState({ name: '', email: '' });
  
  const operators = getHelpdeskOperators();
  
  const handleStatusToggle = (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const success = updateOperatorStatus(id, newStatus);
    
    if (success) {
      toast({
        title: `Status operator ${newStatus === 'active' ? 'diaktifkan' : 'dinonaktifkan'}`,
        description: "Perubahan status operator berhasil disimpan"
      });
    } else {
      toast({
        title: "Gagal mengubah status",
        description: "Terjadi kesalahan saat mencoba mengubah status operator",
        variant: "destructive"
      });
    }
  };
  
  const handleAddOperator = () => {
    if (!newOperator.name || !newOperator.email) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon isi semua bidang yang diperlukan",
        variant: "destructive"
      });
      return;
    }
    
    const success = addHelpdeskOperator(newOperator);
    
    if (success) {
      toast({
        title: "Operator baru ditambahkan",
        description: `${newOperator.name} berhasil ditambahkan sebagai operator helpdesk`
      });
      setNewOperator({ name: '', email: '' });
      setIsAddDialogOpen(false);
    } else {
      toast({
        title: "Gagal menambahkan operator",
        description: "Terjadi kesalahan saat mencoba menambahkan operator baru",
        variant: "destructive"
      });
    }
  };
  
  const openRemoveDialog = (operator: HelpdeskOperator) => {
    setSelectedOperator(operator);
    setIsRemoveDialogOpen(true);
  };
  
  const handleRemoveOperator = () => {
    if (!selectedOperator) return;
    
    const success = removeHelpdeskOperator(selectedOperator.id);
    
    if (success) {
      toast({
        title: "Operator dihapus",
        description: `${selectedOperator.name} berhasil dihapus dari daftar operator helpdesk`
      });
      setIsRemoveDialogOpen(false);
    } else {
      toast({
        title: "Gagal menghapus operator",
        description: "Terjadi kesalahan saat mencoba menghapus operator",
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
  
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Manajemen Operator Helpdesk
            </CardTitle>
            <CardDescription>
              Kelola operator yang menangani tiket bantuan dari calon murid
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => handleBalanceTickets()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Seimbangkan Tiket
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Operator
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tiket Ditangani</TableHead>
                <TableHead>Terakhir Aktif</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Belum ada operator helpdesk yang terdaftar
                  </TableCell>
                </TableRow>
              ) : (
                operators.map((operator) => (
                  <TableRow key={operator.id}>
                    <TableCell className="font-medium">{operator.name}</TableCell>
                    <TableCell>{operator.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={operator.status === 'active'}
                          onCheckedChange={() => handleStatusToggle(operator.id, operator.status)}
                        />
                        <Badge 
                          variant="outline" 
                          className={operator.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}
                        >
                          {operator.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{operator.assignedTickets}</TableCell>
                    <TableCell>{new Date(operator.lastActive).toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" title="Kirim Kredensial">
                          <MailCheck className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openRemoveDialog(operator)}
                          title="Hapus Operator"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {/* Add Operator Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Operator Helpdesk Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="operator-name">Nama Lengkap</Label>
              <Input
                id="operator-name"
                value={newOperator.name}
                onChange={(e) => setNewOperator({...newOperator, name: e.target.value})}
                placeholder="Masukkan nama operator"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operator-email">Email</Label>
              <Input
                id="operator-email"
                type="email"
                value={newOperator.email}
                onChange={(e) => setNewOperator({...newOperator, email: e.target.value})}
                placeholder="Masukkan email operator"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddOperator}>
              Tambah Operator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Remove Operator Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Operator Helpdesk</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus operator ini?</p>
            {selectedOperator && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p><strong>Nama:</strong> {selectedOperator.name}</p>
                <p><strong>Email:</strong> {selectedOperator.email}</p>
                {selectedOperator.assignedTickets > 0 && (
                  <p className="text-amber-600 font-medium mt-2">
                    Operator ini sedang menangani {selectedOperator.assignedTickets} tiket aktif. 
                    Tiket tersebut akan diserahkan ke operator lain yang aktif.
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleRemoveOperator}>
              Hapus Operator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OperatorManagement;

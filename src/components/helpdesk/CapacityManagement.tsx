
import { useState, useEffect } from 'react';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Edit, Save, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DailyCapacity } from '@/types/supabase';

const CapacityManagement = () => {
  const { 
    fetchDailyCapacity, 
    dailyCapacities,
    updateDailyCapacity,
    loading 
  } = useRegistrations();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCapacity, setSelectedCapacity] = useState<DailyCapacity | null>(null);
  const [onlineCapacity, setOnlineCapacity] = useState('50');
  const [offlineCapacity, setOfflineCapacity] = useState('30');
  
  // Load data when component mounts
  useEffect(() => {
    fetchDailyCapacity();
  }, [fetchDailyCapacity]);
  
  // Open edit dialog with capacity data
  const openEditDialog = (capacity: DailyCapacity) => {
    setSelectedCapacity(capacity);
    setOnlineCapacity(capacity.online_capacity.toString());
    setOfflineCapacity(capacity.offline_capacity.toString());
    setSelectedDate(new Date(capacity.date));
    setIsEditDialogOpen(true);
  };
  
  // Open add new capacity dialog
  const openAddDialog = () => {
    setSelectedCapacity(null);
    setOnlineCapacity('50');
    setOfflineCapacity('30');
    setSelectedDate(new Date());
    setIsEditDialogOpen(true);
  };
  
  // Handle saving capacity data
  const handleSaveCapacity = async () => {
    if (!selectedDate) {
      toast({
        title: "Validasi Gagal",
        description: "Pilih tanggal terlebih dahulu",
        variant: "destructive"
      });
      return;
    }
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const parsedOnlineCapacity = parseInt(onlineCapacity);
    const parsedOfflineCapacity = parseInt(offlineCapacity);
    
    if (isNaN(parsedOnlineCapacity) || isNaN(parsedOfflineCapacity) || 
        parsedOnlineCapacity < 0 || parsedOfflineCapacity < 0) {
      toast({
        title: "Validasi Gagal",
        description: "Kapasitas harus berupa angka positif",
        variant: "destructive"
      });
      return;
    }
    
    const success = await updateDailyCapacity(
      formattedDate,
      parsedOnlineCapacity,
      parsedOfflineCapacity
    );
    
    if (success) {
      toast({
        title: "Berhasil",
        description: `Kapasitas untuk tanggal ${formattedDate} berhasil diperbarui`
      });
      setIsEditDialogOpen(false);
      
      // Refresh capacity list
      await fetchDailyCapacity();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat memperbarui kapasitas",
        variant: "destructive"
      });
    }
  };
  
  // Format date from ISO string
  const formatDateString = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Check if date is today or in the past
  const isDatePast = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateString);
    return checkDate < today;
  };
  
  // Get capacity for today
  const getTodayCapacity = () => {
    const today = new Date().toISOString().split('T')[0];
    return dailyCapacities.find(cap => cap.date.startsWith(today));
  };
  
  if (loading) {
    return (
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="text-xl font-semibold text-primary">
            Manajemen Kapasitas Harian
          </CardTitle>
          <CardDescription>
            Atur kapasitas maksimal pendaftaran helpdesk per hari
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
  
  // Get today's capacity
  const todayCapacity = getTodayCapacity();
  
  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Manajemen Kapasitas Harian
            </CardTitle>
            <CardDescription>
              Atur kapasitas maksimal pendaftaran helpdesk per hari
            </CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Kapasitas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 p-4 bg-primary/5 rounded-lg">
          <h3 className="font-medium mb-2">Kapasitas Hari Ini</h3>
          {todayCapacity ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-md border">
                <span className="text-sm text-muted-foreground">Helpdesk Daring</span>
                <p className="text-2xl font-bold text-primary">{todayCapacity.online_capacity}</p>
              </div>
              <div className="p-3 bg-white rounded-md border">
                <span className="text-sm text-muted-foreground">Helpdesk Luring</span>
                <p className="text-2xl font-bold text-primary">{todayCapacity.offline_capacity}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Tidak ada kapasitas yang diatur untuk hari ini
            </p>
          )}
        </div>
        
        {dailyCapacities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada kapasitas yang diatur. Tambahkan kapasitas baru.
          </div>
        ) : (
          <div className="space-y-4">
            {dailyCapacities.map((capacity) => (
              <div key={capacity.id} className="p-4 border rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="font-medium">{formatDateString(capacity.date)}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Daring: {capacity.online_capacity}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        Luring: {capacity.offline_capacity}
                      </Badge>
                      {isDatePast(capacity.date) && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700">
                          Lewat
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(capacity)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* Edit Capacity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCapacity ? 'Edit Kapasitas Harian' : 'Tambah Kapasitas Harian'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="online-capacity">Kapasitas Helpdesk Daring</Label>
              <Input
                id="online-capacity"
                type="number"
                min="0"
                value={onlineCapacity}
                onChange={(e) => setOnlineCapacity(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Jumlah maksimal tiket helpdesk daring yang dapat dibuat per hari
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="offline-capacity">Kapasitas Helpdesk Luring</Label>
              <Input
                id="offline-capacity"
                type="number"
                min="0"
                value={offlineCapacity}
                onChange={(e) => setOfflineCapacity(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Jumlah maksimal antrean helpdesk luring yang dapat didaftarkan per hari
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveCapacity}>
              <Save className="mr-2 h-4 w-4" />
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CapacityManagement;

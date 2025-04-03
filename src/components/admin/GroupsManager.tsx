
import { useState } from 'react';
import { ArrowRight, Edit, Trash, Plus, Check, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Group } from '@/types/supabase'; // Updated import
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface GroupsManagerProps {
  groups: Group[];
}

const GroupsManager = ({ groups }: GroupsManagerProps) => {
  const { createGroup, updateGroup, deleteGroup } = useRegistrations();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCapacity, setNewGroupCapacity] = useState('1000');
  const [newGroupLink, setNewGroupLink] = useState('');
  const { toast } = useToast();

  const handleAddGroup = () => {
    if (!newGroupName || !newGroupCapacity || !newGroupLink) {
      toast({
        title: "Validasi Gagal",
        description: "Semua kolom harus diisi",
        variant: "destructive"
      });
      return;
    }

    const success = createGroup({
      name: newGroupName,
      capacity: parseInt(newGroupCapacity),
      link: newGroupLink
    });

    if (success) {
      toast({
        title: "Grup Ditambahkan",
        description: `Grup ${newGroupName} berhasil ditambahkan`
      });
      setIsAddDialogOpen(false);
      resetForm();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat menambahkan grup baru",
        variant: "destructive"
      });
    }
  };

  const handleEditGroup = () => {
    if (!currentGroup || !newGroupName || !newGroupCapacity || !newGroupLink) {
      toast({
        title: "Validasi Gagal",
        description: "Semua kolom harus diisi",
        variant: "destructive"
      });
      return;
    }

    const success = updateGroup(currentGroup.id, {
      name: newGroupName,
      capacity: parseInt(newGroupCapacity),
      link: newGroupLink
    });

    if (success) {
      toast({
        title: "Grup Diperbarui",
        description: `Grup ${newGroupName} berhasil diperbarui`
      });
      setIsEditDialogOpen(false);
      resetForm();
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat memperbarui grup",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGroup = () => {
    if (!currentGroup) return;

    const success = deleteGroup(currentGroup.id);

    if (success) {
      toast({
        title: "Grup Dihapus",
        description: `Grup ${currentGroup.name} berhasil dihapus`
      });
      setIsDeleteDialogOpen(false);
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat menghapus grup yang memiliki anggota",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (group: Group) => {
    setCurrentGroup(group);
    setNewGroupName(group.name);
    setNewGroupCapacity(group.capacity.toString());
    setNewGroupLink(group.invite_link || group.link || '');
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (group: Group) => {
    setCurrentGroup(group);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setNewGroupName('');
    setNewGroupCapacity('1000');
    setNewGroupLink('');
    setCurrentGroup(null);
  };

  const visitGroupLink = (link: string) => {
    window.open(link, '_blank');
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Manajemen Grup WhatsApp
            </CardTitle>
            <CardDescription>
              Kelola grup WhatsApp untuk calon murid
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Grup
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {group.member_count} pendaftar dari {group.capacity} kapasitas
                  </p>
                </div>
                <div className="flex gap-2">
                  {group.invite_link && (
                    <Button size="sm" variant="outline" onClick={() => window.open(group.invite_link, '_blank')}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Buka Link
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(group)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(group)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                  <Button size="sm" variant={group.isFull ? "secondary" : "outline"}>
                    {group.isFull ? 'Penuh' : 'Tersedia'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Add Group Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Grup Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Nama Grup</Label>
              <Input
                id="groupName"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Grup 4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupCapacity">Kapasitas</Label>
              <Input
                id="groupCapacity"
                type="number"
                value={newGroupCapacity}
                onChange={(e) => setNewGroupCapacity(e.target.value)}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupLink">Link WhatsApp</Label>
              <Input
                id="groupLink"
                value={newGroupLink}
                onChange={(e) => setNewGroupLink(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              resetForm();
            }}>
              Batal
            </Button>
            <Button onClick={handleAddGroup}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Grup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Grup</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editGroupName">Nama Grup</Label>
              <Input
                id="editGroupName"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editGroupCapacity">Kapasitas</Label>
              <Input
                id="editGroupCapacity"
                type="number"
                value={newGroupCapacity}
                onChange={(e) => setNewGroupCapacity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editGroupLink">Link WhatsApp</Label>
              <Input
                id="editGroupLink"
                value={newGroupLink}
                onChange={(e) => setNewGroupLink(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              resetForm();
            }}>
              Batal
            </Button>
            <Button onClick={handleEditGroup}>
              <Check className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Grup</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus grup "{currentGroup?.name}"?</p>
            <p className="text-red-500 text-sm mt-2">Peringatan: Grup dengan anggota tidak dapat dihapus.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              <Trash className="mr-2 h-4 w-4" />
              Hapus Grup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GroupsManager;

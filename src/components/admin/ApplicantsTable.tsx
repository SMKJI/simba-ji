
import { useState } from 'react';
import { Download, Edit, Trash, KeyRound, Search, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRegistrations } from '@/hooks/useRegistrations';
import * as XLSX from 'xlsx';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  parentName?: string;
  parentPhone?: string;
  previousSchool?: string;
  group: string;
  registeredAt: string;
}

interface ApplicantsTableProps {
  applicants: Applicant[];
  onPromoteToHelpdesk?: (userId: string) => void;
}

const ApplicantsTable = ({ applicants, onPromoteToHelpdesk }: ApplicantsTableProps) => {
  const { toast } = useToast();
  const { updateApplicant, deleteApplicant, resetUserPassword } = useRegistrations();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    previousSchool: '',
    group: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplicants = applicants.filter(applicant => 
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.phone.includes(searchTerm) ||
    applicant.id.includes(searchTerm) ||
    (applicant.previousSchool && applicant.previousSchool.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (applicant.parentName && applicant.parentName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportToExcel = () => {
    // Prepare data for export
    const dataToExport = applicants.map(applicant => ({
      ID: applicant.id,
      'Nama Lengkap': applicant.name,
      'Email': applicant.email,
      'No. Telepon': applicant.phone,
      'Asal Sekolah': applicant.previousSchool || 'Tidak diisi',
      'Nama Orang Tua': applicant.parentName || 'Tidak diisi',
      'No. WhatsApp Orang Tua': applicant.parentPhone || 'Tidak diisi',
      'Grup WhatsApp': applicant.group,
      'Tanggal Pendaftaran': new Date(applicant.registeredAt).toLocaleDateString('id-ID')
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pendaftar SPMB');

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `Data_Pendaftar_SPMB_${new Date().toISOString().slice(0, 10)}.xlsx`);

    toast({
      title: "Ekspor Berhasil",
      description: "Data pendaftar berhasil diekspor ke Excel"
    });
  };

  const openEditDialog = (applicant: Applicant) => {
    setCurrentApplicant(applicant);
    setEditFormData({
      name: applicant.name,
      email: applicant.email,
      phone: applicant.phone,
      parentName: applicant.parentName || '',
      parentPhone: applicant.parentPhone || '',
      previousSchool: applicant.previousSchool || '',
      group: applicant.group
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (applicant: Applicant) => {
    setCurrentApplicant(applicant);
    setIsDeleteDialogOpen(true);
  };

  const openResetPasswordDialog = (applicant: Applicant) => {
    setCurrentApplicant(applicant);
    setIsResetPasswordDialogOpen(true);
  };

  const openPromoteDialog = (applicant: Applicant) => {
    setCurrentApplicant(applicant);
    setIsPromoteDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (!currentApplicant) return;

    const success = updateApplicant(currentApplicant.id, editFormData);

    if (success) {
      toast({
        title: "Data Berhasil Diperbarui",
        description: `Data pendaftar ${editFormData.name} berhasil diperbarui`
      });
      setIsEditDialogOpen(false);
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat memperbarui data pendaftar",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubmit = () => {
    if (!currentApplicant) return;

    const success = deleteApplicant(currentApplicant.id);

    if (success) {
      toast({
        title: "Data Berhasil Dihapus",
        description: `Data pendaftar ${currentApplicant.name} berhasil dihapus`
      });
      setIsDeleteDialogOpen(false);
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat menghapus data pendaftar",
        variant: "destructive"
      });
    }
  };

  const handleResetPasswordSubmit = () => {
    if (!currentApplicant) return;

    const success = resetUserPassword(currentApplicant.id);

    if (success) {
      toast({
        title: "Password Direset",
        description: `Password untuk akun ${currentApplicant.email} berhasil direset`
      });
      setIsResetPasswordDialogOpen(false);
    } else {
      toast({
        title: "Gagal",
        description: "Tidak dapat mereset password",
        variant: "destructive"
      });
    }
  };

  const handlePromoteSubmit = () => {
    if (!currentApplicant || !onPromoteToHelpdesk) return;
    
    onPromoteToHelpdesk(currentApplicant.id);
    setIsPromoteDialogOpen(false);
  };

  return (
    <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">
              Daftar Calon Murid
            </CardTitle>
            <CardDescription>
              Menampilkan semua calon murid yang telah mendaftar
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleExportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
        <div className="mt-4 relative">
          <Input
            placeholder="Cari berdasarkan nama, email, nomor telepon, asal sekolah, atau nama orang tua..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>No. Telepon</TableHead>
                <TableHead>Asal Sekolah</TableHead>
                <TableHead>Orang Tua</TableHead>
                <TableHead>Grup</TableHead>
                <TableHead>Tanggal Daftar</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'Tidak ada hasil yang cocok dengan pencarian Anda' : 'Belum ada pendaftar'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="font-medium">{applicant.id}</TableCell>
                    <TableCell>{applicant.name}</TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>{applicant.phone}</TableCell>
                    <TableCell>{applicant.previousSchool || '-'}</TableCell>
                    <TableCell>
                      {applicant.parentName ? (
                        <div>
                          <div>{applicant.parentName}</div>
                          <div className="text-xs text-muted-foreground">{applicant.parentPhone}</div>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{applicant.group}</TableCell>
                    <TableCell>{new Date(applicant.registeredAt).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(applicant)} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(applicant)} title="Hapus">
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openResetPasswordDialog(applicant)} title="Reset Password">
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        {onPromoteToHelpdesk && (
                          <Button variant="ghost" size="icon" onClick={() => openPromoteDialog(applicant)} title="Angkat sebagai Helpdesk">
                            <UserCog className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Applicant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Pendaftar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Lengkap</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">No. Telepon</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-school">Asal Sekolah</Label>
              <Input
                id="edit-school"
                value={editFormData.previousSchool}
                onChange={(e) => setEditFormData({...editFormData, previousSchool: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-parent-name">Nama Orang Tua</Label>
              <Input
                id="edit-parent-name"
                value={editFormData.parentName}
                onChange={(e) => setEditFormData({...editFormData, parentName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-parent-phone">No. WhatsApp Orang Tua</Label>
              <Input
                id="edit-parent-phone"
                value={editFormData.parentPhone}
                onChange={(e) => setEditFormData({...editFormData, parentPhone: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleEditSubmit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Applicant Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data Pendaftar</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus data pendaftar ini?</p>
            {currentApplicant && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p><strong>Nama:</strong> {currentApplicant.name}</p>
                <p><strong>Email:</strong> {currentApplicant.email}</p>
                <p><strong>ID:</strong> {currentApplicant.id}</p>
              </div>
            )}
            <p className="text-red-500 text-sm mt-4">
              Peringatan: Tindakan ini tidak dapat dibatalkan. Semua data pendaftar termasuk tiket helpdesk akan ikut terhapus.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit}>
              Hapus Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Apakah Anda yakin ingin mereset password untuk akun ini?</p>
            {currentApplicant && (
              <div className="mt-2 p-3 bg-muted rounded-md">
                <p><strong>Nama:</strong> {currentApplicant.name}</p>
                <p><strong>Email:</strong> {currentApplicant.email}</p>
              </div>
            )}
            <p className="text-blue-500 text-sm mt-4">
              Password baru akan dikirim ke email pengguna dan juga akan ditampilkan sekali setelah reset.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleResetPasswordSubmit}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promote to Helpdesk Dialog */}
      {onPromoteToHelpdesk && (
        <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Angkat sebagai Helpdesk</DialogTitle>
              <DialogDescription>
                Pengguna ini akan mendapatkan akses ke fitur helpdesk dan dapat membantu calon murid yang mengalami masalah.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Apakah Anda yakin ingin mengangkat pengguna ini sebagai operator helpdesk?</p>
              {currentApplicant && (
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p><strong>Nama:</strong> {currentApplicant.name}</p>
                  <p><strong>Email:</strong> {currentApplicant.email}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handlePromoteSubmit}>
                Angkat sebagai Helpdesk
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default ApplicantsTable;

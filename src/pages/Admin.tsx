
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle, Loader2, UserPlus } from 'lucide-react';

// Extract the ApplicantsTable to a separate component
const ApplicantsTable = ({ applicants, loading = false, onPromoteToHelpdesk }: {
  applicants: any[];
  loading?: boolean;
  onPromoteToHelpdesk: (userId: string) => Promise<void>;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Pendaftar</CardTitle>
        <CardDescription>
          Kelola akun pendaftar dan promosikan ke peran helpdesk
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableCaption>Daftar semua akun pendaftar.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </TableCell>
              </TableRow>
            ) : applicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Tidak ada pendaftar
                </TableCell>
              </TableRow>
            ) : (
              applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">{applicant.id}</TableCell>
                  <TableCell>{applicant.name}</TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>{applicant.role}</TableCell>
                  <TableCell className="text-right">
                    {applicant.role !== 'helpdesk' && applicant.role !== 'helpdesk_offline' && (
                      <Button variant="ghost" onClick={() => onPromoteToHelpdesk(applicant.id)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Promosikan ke Helpdesk
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const Admin = () => {
  const { getApplicants, updateUserRole } = useRegistrations();
  const { toast } = useToast();
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    const data = await getApplicants();
    setApplicants(data);
    setLoading(false);
  };

  const handlePromoteToHelpdesk = async (userId: string) => {
    setPromoting(true);
    try {
      const success = await updateUserRole(userId, 'helpdesk');
      if (success) {
        toast({
          title: "Sukses",
          description: "Pengguna berhasil dipromosikan ke Helpdesk",
        });
        fetchApplicants(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Gagal mempromosikan pengguna ke Helpdesk",
          variant: "destructive",
        });
      }
    } finally {
      setPromoting(false);
    }
  };

  const filteredApplicants = applicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Kelola Pengguna dan Konfigurasi Sistem
          </p>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Cari nama atau email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ApplicantsTable
          applicants={filteredApplicants}
          loading={loading}
          onPromoteToHelpdesk={handlePromoteToHelpdesk}
        />
      </div>
    </DashboardLayout>
  );
};

export default Admin;

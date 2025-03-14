
import { useEffect, useState } from 'react';
import { ArrowRight, Download, RefreshCw, UserCheck, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRegistrations } from '@/hooks/useRegistrations';

// Mock data for the applicants list
const MOCK_APPLICANTS = Array.from({ length: 25 }).map((_, i) => ({
  id: (i + 1000000).toString(),
  name: `Calon Murid ${i + 1}`,
  email: `calon${i + 1}@example.com`,
  phone: `08123456${i.toString().padStart(4, '0')}`,
  group: `Grup ${Math.floor(i / 10) + 1}`,
  registeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

const Admin = () => {
  const { stats, loading } = useRegistrations();
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Pendaftar</p>
                      <h2 className="text-3xl font-bold">{stats.total}</h2>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Grup Aktif</p>
                      <h2 className="text-3xl font-bold">{stats.groups.length}</h2>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-full">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Grup Penuh</p>
                      <h2 className="text-3xl font-bold">{stats.groups.filter(g => g.isFull).length}</h2>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-full">
                      <UserCheck className="h-6 w-6 text-accent-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="applicants" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="applicants" className="text-base">Daftar Pendaftar</TabsTrigger>
                <TabsTrigger value="groups" className="text-base">Grup WhatsApp</TabsTrigger>
                <TabsTrigger value="stats" className="text-base">Statistik</TabsTrigger>
              </TabsList>
              
              <TabsContent value="applicants" className="animate-fade-in">
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
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
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
                            <TableHead>Grup</TableHead>
                            <TableHead>Tanggal Daftar</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applicants.map((applicant) => (
                            <TableRow key={applicant.id}>
                              <TableCell className="font-medium">{applicant.id}</TableCell>
                              <TableCell>{applicant.name}</TableCell>
                              <TableCell>{applicant.email}</TableCell>
                              <TableCell>{applicant.phone}</TableCell>
                              <TableCell>{applicant.group}</TableCell>
                              <TableCell>{new Date(applicant.registeredAt).toLocaleDateString('id-ID')}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="groups" className="animate-fade-in">
                <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b p-6">
                    <CardTitle className="text-xl font-semibold text-primary">
                      Manajemen Grup WhatsApp
                    </CardTitle>
                    <CardDescription>
                      Kelola grup WhatsApp untuk calon murid
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {stats.groups.map((group) => (
                        <div key={group.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-lg font-semibold">{group.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {group.count} pendaftar dari 1000 kapasitas
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Lihat Link
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
                </Card>
              </TabsContent>
              
              <TabsContent value="stats" className="animate-fade-in">
                <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b p-6">
                    <CardTitle className="text-xl font-semibold text-primary">
                      Statistik Pendaftaran
                    </CardTitle>
                    <CardDescription>
                      Data statistik pendaftaran calon murid
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="border rounded-lg p-4">
                        <p className="text-center text-lg">
                          Visualisasi statistik pendaftaran akan ditampilkan di sini.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;

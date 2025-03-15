
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import Dashboard from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, FileText, Bell, Users } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { stats, loading, currentUser, authenticated } = useRegistrations();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!authenticated) {
      navigate('/login');
    }
  }, [authenticated, navigate]);

  if (!authenticated || !currentUser) {
    return null;
  }

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Selamat Datang, {currentUser.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Panel dashboard penerimaan murid baru SMKN 1 Kendal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-1">
            <Card className="border-0 shadow-lg rounded-xl overflow-hidden h-full">
              <CardHeader className="bg-primary/5 border-b p-6">
                <CardTitle className="text-xl font-semibold text-primary">
                  Menu Aplikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Button 
                    variant={activeTab === 'overview' ? 'secondary' : 'ghost'} 
                    className="justify-start rounded-none h-12 px-6"
                    onClick={() => setActiveTab('overview')}
                  >
                    <UserCircle className="mr-2 h-5 w-5" />
                    Informasi Umum
                  </Button>
                  <Button 
                    variant={activeTab === 'documents' ? 'secondary' : 'ghost'} 
                    className="justify-start rounded-none h-12 px-6"
                    onClick={() => setActiveTab('documents')}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Dokumen
                  </Button>
                  <Button 
                    variant={activeTab === 'announcements' ? 'secondary' : 'ghost'} 
                    className="justify-start rounded-none h-12 px-6"
                    onClick={() => setActiveTab('announcements')}
                  >
                    <Bell className="mr-2 h-5 w-5" />
                    Pengumuman
                  </Button>
                  <Button 
                    variant={activeTab === 'groups' ? 'secondary' : 'ghost'} 
                    className="justify-start rounded-none h-12 px-6"
                    onClick={() => setActiveTab('groups')}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Grup WhatsApp
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {activeTab === 'overview' && (
              <Dashboard stats={stats} loading={loading} />
            )}
            
            {activeTab === 'documents' && (
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b p-6">
                  <CardTitle className="text-xl font-semibold text-primary">
                    Dokumen Pendaftaran
                  </CardTitle>
                  <CardDescription>
                    Dokumen yang perlu disiapkan untuk pendaftaran
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Formulir Pendaftaran</h3>
                        <p className="text-sm text-muted-foreground">Format PDF (Max 2MB)</p>
                      </div>
                      <Button variant="outline" size="sm">Unggah</Button>
                    </li>
                    <li className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Ijazah SMP/MTs</h3>
                        <p className="text-sm text-muted-foreground">Format PDF/JPG (Max 2MB)</p>
                      </div>
                      <Button variant="outline" size="sm">Unggah</Button>
                    </li>
                    <li className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Kartu Keluarga</h3>
                        <p className="text-sm text-muted-foreground">Format PDF/JPG (Max 2MB)</p>
                      </div>
                      <Button variant="outline" size="sm">Unggah</Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'announcements' && (
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b p-6">
                  <CardTitle className="text-xl font-semibold text-primary">
                    Pengumuman Terbaru
                  </CardTitle>
                  <CardDescription>
                    Informasi terbaru tentang proses penerimaan murid baru
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Jadwal Tes Seleksi</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Baru</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Tes seleksi akan dilaksanakan pada tanggal 15 Juli 2023 di SMKN 1 Kendal. Harap membawa kartu peserta dan alat tulis.
                      </p>
                      <p className="text-xs text-gray-500">Diposting: 1 Juli 2023</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Pengumuman Hasil Seleksi</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Hasil seleksi akan diumumkan pada tanggal 20 Juli 2023 melalui website dan grup WhatsApp.
                      </p>
                      <p className="text-xs text-gray-500">Diposting: 25 Juni 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'groups' && (
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b p-6">
                  <CardTitle className="text-xl font-semibold text-primary">
                    Grup WhatsApp
                  </CardTitle>
                  <CardDescription>
                    Grup WhatsApp untuk informasi penerimaan murid baru
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
                          <div>
                            <Button 
                              onClick={() => navigate(`/group-detail/${group.id}`)}
                              size="sm"
                            >
                              Lihat Detail
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;

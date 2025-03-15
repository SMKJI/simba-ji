
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import Dashboard from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { useRegistrations } from '@/hooks/useRegistrations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, Bell, Users, Info } from 'lucide-react';

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
            Panel dashboard penjaringan awal calon murid baru SMKN 1 Kendal
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
                    variant={activeTab === 'info' ? 'secondary' : 'ghost'} 
                    className="justify-start rounded-none h-12 px-6"
                    onClick={() => setActiveTab('info')}
                  >
                    <Info className="mr-2 h-5 w-5" />
                    Informasi PPDB
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
            
            {activeTab === 'info' && (
              <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
                <CardHeader className="bg-primary/5 border-b p-6">
                  <CardTitle className="text-xl font-semibold text-primary">
                    Informasi PPDB
                  </CardTitle>
                  <CardDescription>
                    Penerimaan Peserta Didik Baru SMKN 1 Kendal
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Tahapan Penjaringan Awal</h3>
                      <p className="text-sm text-gray-600">
                        Penjaringan awal ini bertujuan untuk mengumpulkan data calon peserta didik yang berminat mendaftar di SMKN 1 Kendal. Data ini akan digunakan untuk persiapan PPDB resmi yang akan dilaksanakan melalui sistem terpisah.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Jadwal Penting</h3>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex justify-between">
                          <span>Pembukaan Penjaringan Awal</span>
                          <span className="font-medium">1 Januari 2024</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Penutupan Penjaringan Awal</span>
                          <span className="font-medium">31 Maret 2024</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Pembukaan PPDB Resmi</span>
                          <span className="font-medium">1 Juni 2024</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Informasi Kontak</h3>
                      <p className="text-sm text-gray-600">
                        Untuk informasi lebih lanjut, silakan hubungi panitia PPDB SMKN 1 Kendal melalui:
                      </p>
                      <ul className="text-sm text-gray-600 mt-2">
                        <li>Email: ppdb@smkn1kendal.sch.id</li>
                        <li>WhatsApp: 081234567890</li>
                      </ul>
                    </div>
                  </div>
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
                    Informasi terbaru tentang proses penjaringan awal calon murid baru
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Pembukaan Penjaringan Awal PPDB</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Baru</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        SMKN 1 Kendal telah membuka penjaringan awal calon peserta didik baru untuk tahun ajaran 2024/2025. Penjaringan ini bertujuan untuk mempersiapkan data calon siswa sebelum PPDB resmi dibuka.
                      </p>
                      <p className="text-xs text-gray-500">Diposting: 1 Januari 2024</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">Informasi Program Keahlian</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        SMKN 1 Kendal menawarkan berbagai program keahlian yang dapat dipilih oleh calon peserta didik baru. Silakan lihat detail program keahlian pada halaman Informasi PPDB.
                      </p>
                      <p className="text-xs text-gray-500">Diposting: 5 Januari 2024</p>
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
                    Grup WhatsApp untuk informasi penjaringan awal calon murid baru
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
                              {group.count} pendaftar dari {group.capacity || 1000} kapasitas
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

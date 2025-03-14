
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRegistrations } from '@/hooks/useRegistrations';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const { stats, loading } = useRegistrations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="w-full md:w-1/2 mt-10 md:mt-0 text-center md:text-left">
              <div className="inline-block px-3 py-1 mb-6 bg-primary/10 text-primary text-sm font-medium rounded-full animate-fade-in">
                Pendaftaran Awal Tahun Ajaran 2024/2025
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
                Sistem Penjaringan Awal <span className="text-primary">Calon Murid Baru</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 animate-fade-in stagger-1">
                Selamat datang di sistem penjaringan awal calon murid baru SMKN 1 Kendal. Daftar sekarang untuk mendapatkan akses ke grup WhatsApp dan informasi terkini seputar penerimaan murid baru.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in stagger-2">
                <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Link to="/register">
                    Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/helpdesk">
                    Pusat Bantuan <HelpCircle className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-20"></div>
                <div className="relative h-full w-full overflow-hidden rounded-xl border p-2 bg-white shadow-lg">
                  <img
                    src="/lovable-uploads/3d2a0d2f-58fe-40dd-84d7-7e4ea3f565b8.png"
                    alt="SMKN 1 Kendal Logo"
                    className="h-full w-full object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Status Pendaftaran
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pantau jumlah pendaftar dan ketersediaan grup WhatsApp secara real-time
            </p>
          </div>
          
          <Dashboard stats={stats} loading={loading} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Alur Pendaftaran
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Proses pendaftaran yang mudah dan efisien untuk calon murid baru
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover animate-fade-in">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">1. Daftar Online</h3>
              <p className="text-gray-600 text-center">
                Isi formulir pendaftaran dengan data lengkap dan valid melalui website ini.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover animate-fade-in stagger-1">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">2. Gabung Grup WhatsApp</h3>
              <p className="text-gray-600 text-center">
                Setelah mendaftar, dapatkan link grup WhatsApp untuk informasi lebih lanjut.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 card-hover animate-fade-in stagger-2">
              <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <HelpCircle className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">3. Dapatkan Bantuan</h3>
              <p className="text-gray-600 text-center">
                Gunakan fitur helpdesk jika mengalami kendala selama proses pendaftaran.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/register">
                Mulai Pendaftaran <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

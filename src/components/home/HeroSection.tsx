import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
const HeroSection = () => {
  return <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center">
          <div className="w-full md:w-1/2 mt-10 md:mt-0 text-center md:text-left">
            <div className="inline-block px-3 py-1 mb-6 bg-primary/10 text-primary text-sm font-medium rounded-full animate-fade-in">Pendaftaran Awal Tahun Ajaran 2025/2026</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Sistem Penjaringan <span className="text-primary">Murid Baru</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 animate-fade-in stagger-1 font-normal text-justify">Selamat datang di sistem penjaringan murid baru SMKN 1 Kendal (Hanya Penjaringan Awal, Bukan Pendaftaran Resmi). Daftar sekarang untuk mendapatkan akses ke grup WhatsApp dan informasi terkini seputar penerimaan murid baru.</p>
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
                <img alt="SMKN 1 Kendal Logo" src="/lovable-uploads/a6c5cdf7-de60-4835-b170-c3f5fb173dd9.png" className="h-full w-full rounded-xl object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;

import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeatureSection = () => {
  return (
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
  );
};

export default FeatureSection;


import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tentang SMKN 1 Kendal
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Sekolah Menengah Kejuruan unggulan yang menghasilkan lulusan berkualitas dan siap kerja
          </p>
        </div>
        
        <div className="mb-16">
          <div className="bg-primary/5 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Profil Sekolah</h2>
            <p className="text-gray-600 mb-6">
              SMKN 1 Kendal didirikan pada tahun 1969 dan menjadi salah satu sekolah kejuruan tertua dan terkemuka di Kabupaten Kendal.
              Dengan komitmen untuk memberikan pendidikan berkualitas, SMKN 1 Kendal telah menghasilkan ribuan lulusan yang bekerja di berbagai sektor industri atau melanjutkan pendidikan ke jenjang yang lebih tinggi.
            </p>
            <p className="text-gray-600">
              Sekolah kami menerapkan kurikulum yang sesuai dengan kebutuhan industri dan dilengkapi dengan fasilitas modern untuk mendukung proses pembelajaran. Para pengajar kami juga merupakan profesional berpengalaman di bidangnya masing-masing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Visi</h2>
              <Card className="border-0 shadow-md h-full">
                <CardContent className="p-6">
                  <p className="text-gray-600 italic">
                    "Menjadi lembaga pendidikan kejuruan yang unggul dalam menghasilkan lulusan berkompeten, berkarakter, dan berdaya saing di era global."
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Misi</h2>
              <Card className="border-0 shadow-md h-full">
                <CardContent className="p-6">
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Menyelenggarakan pendidikan kejuruan yang berkualitas sesuai dengan kebutuhan dunia kerja</li>
                    <li>Membekali siswa dengan keterampilan, pengetahuan, dan sikap professional</li>
                    <li>Mengembangkan karakter dan kepribadian siswa yang berdasarkan nilai-nilai luhur</li>
                    <li>Menjalin kerjasama dengan dunia usaha dan industri</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fasilitas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Laboratorium Komputer</h3>
                  <p className="text-gray-600">
                    Dilengkapi dengan komputer modern dan software terbaru untuk mendukung pembelajaran praktis siswa.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Perpustakaan</h3>
                  <p className="text-gray-600">
                    Menyediakan ribuan koleksi buku, jurnal, dan sumber belajar digital untuk referensi siswa.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Workshop Praktek</h3>
                  <p className="text-gray-600">
                    Ruang praktek yang representatif untuk setiap program keahlian dengan peralatan standar industri.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="bg-accent/10 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-accent-foreground mb-6">Kontak & Lokasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Informasi Kontak</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <span className="text-gray-600">
                      Jl. Soekarno - Hatta No.48, Pegulon, Kec. Kendal, Kabupaten Kendal, Jawa Tengah 51314
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-primary" />
                    <span className="text-gray-600">(0294) 381137</span>
                  </li>
                  <li className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-primary" />
                    <span className="text-gray-600">info@smkn1kendal.sch.id</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Jam Operasional</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Senin - Kamis:</span>
                    <span>07.00 - 15.30 WIB</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Jumat:</span>
                    <span>07.00 - 11.30 WIB</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sabtu - Minggu:</span>
                    <span>Tutup</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tertarik untuk Bergabung?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Daftarkan diri Anda sekarang dan menjadi bagian dari SMKN 1 Kendal.
              Ikuti penjaringan awal untuk mendapatkan informasi terbaru seputar PPDB.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/register">
                Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default About;

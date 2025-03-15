
import { Phone, MapPin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ContactSection = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Hubungi Kami</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Jika Anda memiliki pertanyaan lebih lanjut tentang proses pendaftaran awal, silakan hubungi kami melalui informasi di bawah ini.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Telepon</h3>
                <p className="text-muted-foreground">+62 291 123456</p>
                <p className="text-muted-foreground">Senin - Jumat: 08.00 - 15.00 WIB</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Email</h3>
                <p className="text-muted-foreground">info@smkn1kendal.sch.id</p>
                <p className="text-muted-foreground">ppdb@smkn1kendal.sch.id</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Alamat</h3>
                <p className="text-muted-foreground">Jl. Soekarno-Hatta No. 25</p>
                <p className="text-muted-foreground">Kendal, Jawa Tengah 51314</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-4">Kirim Pesan</h3>
            <form className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Subjek" 
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <Textarea 
                  placeholder="Pesan Anda" 
                  className="w-full min-h-[120px] resize-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <Button className="w-full">Kirim Pesan</Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

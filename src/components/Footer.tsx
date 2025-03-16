
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative h-10 w-10 overflow-hidden bg-white rounded-md p-1">
                <img
                  src="/lovable-uploads/3d2a0d2f-58fe-40dd-84d7-7e4ea3f565b8.png"
                  alt="SMKN 1 Kendal"
                  className="object-contain h-full w-full"
                />
              </div>
              <h3 className="text-xl font-bold">SMKN 1 Kendal</h3>
            </div>
            <p className="text-sm text-white/80">
              Sistem Informasi Penjaringan Awal Calon Murid Baru SMKN 1 Kendal
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/SMKN1KendalJateng/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/smkn1kendaljateng/?hl=en" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="mailto:info@smkn1kendal.sch.id" 
                className="hover:text-accent transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Link Penting</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/80 hover:text-white transition-colors">
                  Pendaftaran
                </Link>
              </li>
              <li>
                <Link to="/helpdesk" className="text-white/80 hover:text-white transition-colors">
                  Helpdesk
                </Link>
              </li>
              <li>
                <a 
                  href="https://smkn1kendal.sch.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Website Resmi
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span className="text-white/80">
                  Jl. Soekarno - Hatta, Kendal, Jawa Tengah, Indonesia
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="flex-shrink-0" />
                <span className="text-white/80">(0294) 381137</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="flex-shrink-0" />
                <span className="text-white/80">info@smkn1kendal.sch.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm text-white/60">
          <p>© {currentYear} SMKN 1 Kendal. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from './UserMenu';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, currentUser } = useRegistrations();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo-smkn1.png" 
              alt="Logo SMKN 1 Kendal" 
              className="h-12 w-auto" 
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary leading-tight">SMKN 1 Kendal</span>
              <span className="text-xs text-gray-600 leading-tight">Pendaftaran Awal Calon Siswa</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/"
                className={`text-gray-700 hover:text-primary transition-colors ${
                  location.pathname === '/' ? 'font-medium text-primary' : ''
                }`}
              >
                Beranda
              </Link>
              <Link 
                to="/about"
                className={`text-gray-700 hover:text-primary transition-colors ${
                  location.pathname === '/about' ? 'font-medium text-primary' : ''
                }`}
              >
                Tentang
              </Link>
              <Link 
                to="/programs"
                className={`text-gray-700 hover:text-primary transition-colors ${
                  location.pathname === '/programs' ? 'font-medium text-primary' : ''
                }`}
              >
                Program
              </Link>
              <Link 
                to="/faq"
                className={`text-gray-700 hover:text-primary transition-colors ${
                  location.pathname === '/faq' ? 'font-medium text-primary' : ''
                }`}
              >
                FAQ
              </Link>
              {authenticated && currentUser && (
                <Link 
                  to="/dashboard"
                  className={`text-gray-700 hover:text-primary transition-colors ${
                    location.pathname === '/dashboard' ? 'font-medium text-primary' : ''
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          )}

          {/* Authentication Buttons */}
          <div className="flex items-center">
            {authenticated && currentUser ? (
              <UserMenu />
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Button 
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  Masuk
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Daftar
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 animate-fade-in shadow-md">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/"
                className={`py-2 px-4 rounded ${
                  location.pathname === '/' ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                Beranda
              </Link>
              <Link 
                to="/about"
                className={`py-2 px-4 rounded ${
                  location.pathname === '/about' ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                Tentang
              </Link>
              <Link 
                to="/programs"
                className={`py-2 px-4 rounded ${
                  location.pathname === '/programs' ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                Program
              </Link>
              <Link 
                to="/faq"
                className={`py-2 px-4 rounded ${
                  location.pathname === '/faq' ? 'bg-primary/10 text-primary font-medium' : ''
                }`}
              >
                FAQ
              </Link>
              {authenticated && currentUser && (
                <Link 
                  to="/dashboard"
                  className={`py-2 px-4 rounded ${
                    location.pathname === '/dashboard' ? 'bg-primary/10 text-primary font-medium' : ''
                  }`}
                >
                  Dashboard
                </Link>
              )}
              
              {!authenticated && (
                <div className="pt-2 flex flex-col space-y-2">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Masuk
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="w-full"
                  >
                    Daftar
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

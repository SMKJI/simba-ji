import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from './UserMenu';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    authenticated,
    currentUser
  } = useRegistrations();
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
  const navigation = [{
    name: 'Beranda',
    path: '/'
  }, {
    name: 'Tentang',
    path: '/about'
  }, {
    name: 'Program',
    path: '/programs'
  }, {
    name: 'FAQ',
    path: '/faq'
  }];
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 shadow-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center space-x-2 z-10">
            <img src="/lovable-uploads/f5ba977f-fb10-430c-b426-68c3389cee2c.png" alt="Logo SMKN 1 Kendal" className="h-14 w-auto" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary leading-tight">SMKN 1 Kendal</span>
              <span className="text-xs text-gray-600 leading-tight">Pendaftaran Awal Calon Murid</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigation.map(item => <NavigationMenuItem key={item.name}>
                    <Link to={item.path}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle() + ` ${location.pathname === item.path ? 'bg-primary/10 text-primary font-medium' : ''}`}>
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>)}
                {authenticated && currentUser && <NavigationMenuItem>
                    <Link to="/dashboard">
                      <NavigationMenuLink className={navigationMenuTriggerStyle() + ` ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary font-medium' : ''}`}>
                        Dashboard
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>}
              </NavigationMenuList>
            </NavigationMenu>}

          {/* Authentication Buttons */}
          <div className="flex items-center space-x-2">
            {authenticated && currentUser ? <UserMenu /> : <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/login')} size="sm">
                  Masuk
                </Button>
                <Button onClick={() => navigate('/register')} size="sm">
                  Daftar
                </Button>
              </div>}

            {/* Mobile Menu Button */}
            {isMobile && <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle menu</span>
              </Button>}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && <div className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            
            <div className="px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {navigation.map(item => <Link key={item.name} to={item.path} className={`py-2 px-4 rounded-md transition-colors ${location.pathname === item.path ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'}`} onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </Link>)}
                {authenticated && currentUser && <Link to="/dashboard" className={`py-2 px-4 rounded-md transition-colors ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100'}`} onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>}
              </nav>
              
              {!authenticated && <div className="mt-6 flex flex-col space-y-3">
                  <Button variant="outline" onClick={() => {
              navigate('/login');
              setIsMenuOpen(false);
            }} className="w-full">
                    Masuk
                  </Button>
                  <Button onClick={() => {
              navigate('/register');
              setIsMenuOpen(false);
            }} className="w-full">
                    Daftar
                  </Button>
                </div>}
            </div>
          </div>}
      </div>
    </header>;
};
export default Header;
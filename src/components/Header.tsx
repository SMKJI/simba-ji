
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRegistrations } from '@/hooks/useRegistrations';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from './UserMenu';
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authenticated, currentUser, hasRole } = useRegistrations();
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

  const navigation = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/about' },
    { name: 'Program', path: '/programs' },
    { name: 'FAQ', path: '/faq' }
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 
        ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 shadow-sm'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Name */}
          <Link to="/" className="flex items-center space-x-3 z-10">
            <img 
              src="/lovable-uploads/f5ba977f-fb10-430c-b426-68c3389cee2c.png" 
              alt="Logo SMKN 1 Kendal" 
              className="h-12 w-auto" 
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary leading-tight">SMKN 1 Kendal</span>
              <span className="text-xs text-gray-600 leading-tight">Penjaringan Awal Calon Murid Baru</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-1">
                {navigation.map(item => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink 
                      asChild 
                      className={`${navigationMenuTriggerStyle()} ${
                        location.pathname === item.path 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : ''
                      }`}
                    >
                      <Link to={item.path}>{item.name}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                
                {authenticated && currentUser && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuLink 
                        asChild 
                        className={`${navigationMenuTriggerStyle()} ${
                          location.pathname === '/dashboard' 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : ''
                        }`}
                      >
                        <Link to="/dashboard">Dashboard</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    
                    {hasRole('applicant') && (
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          asChild 
                          className={`${navigationMenuTriggerStyle()} ${
                            location.pathname === '/helpdesk-siswa' 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : ''
                          }`}
                        >
                          <Link to="/helpdesk-siswa">Helpdesk</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                    
                    {hasRole(['admin', 'helpdesk']) && (
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          asChild 
                          className={`${navigationMenuTriggerStyle()} ${
                            location.pathname === '/helpdesk' 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : ''
                          }`}
                        >
                          <Link to="/helpdesk">Helpdesk</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                    
                    {hasRole('admin') && (
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          asChild 
                          className={`${navigationMenuTriggerStyle()} ${
                            location.pathname === '/admin' 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : ''
                          }`}
                        >
                          <Link to="/admin">Admin</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                    
                    {hasRole(['content', 'admin']) && (
                      <NavigationMenuItem>
                        <NavigationMenuLink 
                          asChild 
                          className={`${navigationMenuTriggerStyle()} ${
                            location.pathname === '/content' 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : ''
                          }`}
                        >
                          <Link to="/content">Konten</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Authentication Buttons */}
          <div className="flex items-center space-x-2">
            {authenticated && currentUser ? (
              <UserMenu />
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => handleNavigation('/login')} 
                  size="sm" 
                  className="font-medium"
                >
                  Masuk
                </Button>
                <Button 
                  onClick={() => handleNavigation('/register')} 
                  size="sm" 
                  className="font-medium"
                >
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
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobile && (
          <div 
            className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/lovable-uploads/f5ba977f-fb10-430c-b426-68c3389cee2c.png" 
                    alt="Logo SMKN 1 Kendal" 
                    className="h-10 w-auto" 
                  />
                  <span className="font-semibold text-primary">SMKN 1 Kendal</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-grow overflow-y-auto">
                <nav className="flex flex-col p-4">
                  {navigation.map(item => (
                    <Link 
                      key={item.name} 
                      to={item.path} 
                      className={`py-3 px-4 rounded-md transition-colors ${
                        location.pathname === item.path 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-gray-100'
                      }`} 
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {authenticated && currentUser && (
                    <>
                      <Link 
                        to="/dashboard" 
                        className={`py-3 px-4 rounded-md transition-colors ${
                          location.pathname === '/dashboard' 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'hover:bg-gray-100'
                        }`} 
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      
                      {hasRole(['admin', 'helpdesk']) && (
                        <Link 
                          to="/helpdesk" 
                          className={`py-3 px-4 rounded-md transition-colors ${
                            location.pathname === '/helpdesk' 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'hover:bg-gray-100'
                          }`} 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Helpdesk
                        </Link>
                      )}
                      
                      {hasRole('admin') && (
                        <Link 
                          to="/admin" 
                          className={`py-3 px-4 rounded-md transition-colors ${
                            location.pathname === '/admin' 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'hover:bg-gray-100'
                          }`} 
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                    </>
                  )}
                </nav>
              </div>
              
              {!authenticated && (
                <div className="p-4 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        handleNavigation('/login');
                        setIsMenuOpen(false);
                      }} 
                      className="w-full"
                    >
                      Masuk
                    </Button>
                    <Button 
                      onClick={() => {
                        handleNavigation('/register');
                        setIsMenuOpen(false);
                      }} 
                      className="w-full"
                    >
                      Daftar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  User,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
  Store
} from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
    await logout();
    toast({
      title: 'Logout berhasil',
      description: 'Anda telah keluar dari akun',
    });
    navigate('/login');
  };

  const navigation = [
    { name: 'Beranda', href: '/', icon: Home, current: location.pathname === '/' },
    { name: 'Profil', href: '/profile', icon: User, current: location.pathname === '/profile' },
    { name: 'Toko', href: '/shop', icon: Store, current: location.pathname === '/shop' },
    ...(user?.role === 'admin' ? [
      { name: 'Anggota', href: '/users', icon: Users, current: location.pathname === '/users' }
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex flex-1 items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center space-x-2 pr-2">
                  <div className="w-15 h-15 rounded-lg flex items-center justify-center overflow-hidden">
                    <img src="/IMG_4716.PNG" alt="Logo Koperasi" className="w-12 h-12 object-contain" />
                  </div>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 truncate">Koperasi Primkoppolresta</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                        item.current
                          ? 'border-green-500 text-green-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full p-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.nama}</p>
                    <p className="text-xs text-muted-foreground">{user?.nrp}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="sm:hidden flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      item.current
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.nama}</div>
                  <div className="text-sm text-gray-500">{user?.nrp}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Button
                  variant="ghost"
                  className="block w-full text-left px-4 py-2"
                  onClick={() => setLogoutDialogOpen(true)}
                >
                  <LogOut className="w-4 h-4 mr-2 inline" />
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      {/* Modal Konfirmasi Logout */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Ingin logout dari akun? Anda harus login kembali untuk mengakses sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tidak</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Ya</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;

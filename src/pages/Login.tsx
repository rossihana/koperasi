
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, ShoppingBag, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [nrp, setNrp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [corsError, setCorsError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCorsError(false);

    try {
      const success = await login(nrp, password);
      if (success) {
        toast({
          title: "Login berhasil!",
          description: "Selamat datang di Koperasi",
        });
        navigate('/');
      } else {
        toast({
          title: "Login gagal",
          description: "NRP atau password salah",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if it's a CORS error
      if (error.message && error.message.includes('CORS Error')) {
        setCorsError(true);
        toast({
          title: "Error Koneksi",
          description: "Tidak dapat terhubung ke server. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Terjadi kesalahan",
          description: "Silakan coba lagi",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-0">
      <div className="w-full max-w-5xl min-h-[80vh] flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Kiri: Logo besar & form login */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12">
          <div className="flex flex-col items-center w-full max-w-md">
            <img src="/IMG_4716.PNG" alt="Logo Koperasi" className="w-32 h-32 md:w-40 md:h-40 object-contain mb-6" />
            <Card className="w-full max-w-md shadow-none border-none">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl md:text-3xl font-bold text-green-800">Selamat Datang</CardTitle>
                <CardDescription className="text-gray-600">
                  Masuk ke akun Koperasi Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* CORS Error Alert */}
                {corsError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800 font-medium">Error Koneksi</span>
                    </div>
                    <p className="text-xs text-red-700 mt-1">
                      Tidak dapat terhubung ke server backend. Ini mungkin karena masalah CORS atau server sedang down.
                    </p>
                    <div className="mt-2 text-xs text-red-600">
                      <p>• Pastikan backend server running</p>
                      <p>• Cek koneksi internet</p>
                      <p>• Hubungi administrator untuk konfigurasi CORS</p>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="nrp">NRP</Label>
                    <Input
                      id="nrp"
                      type="text"
                      placeholder="Masukkan NRP"
                      value={nrp}
                      onChange={(e) => setNrp(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Memproses...' : 'Masuk'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Kanan: Foto koperasi dan kop toko */}
        <div className="hidden md:flex w-1/2 h-full flex-col items-stretch">
          <img
            src="/foto koperasi.jpeg"
            alt="Foto Koperasi"
            className="w-full h-1/2 object-cover object-center border-b border-white"
          />
          <img
            src="/kop toko.jpeg"
            alt="Kop Toko"
            className="w-full h-1/2 object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

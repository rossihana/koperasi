
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, ShoppingBag, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    nrp: '',
    nama: '',
    jabatan: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nrp: formData.nrp,
          nama: formData.nama,
          jabatan: formData.jabatan,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: 'Registrasi berhasil!',
          description: 'Akun anggota telah dibuat',
        });
        navigate('/users'); // redirect ke halaman anggota
      } else {
        toast({
          title: 'Registrasi gagal',
          description: data.message || 'Silakan coba lagi',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Terjadi kesalahan',
        description: 'Silakan coba lagi',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        {/* Tombol Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium mb-2 ml-4 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 flex items-center justify-center overflow-hidden">
              <img src="/IMG_4716.PNG" alt="Logo Koperasi" className="w-32 h-32 object-contain" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">Daftar Anggota</CardTitle>
          <CardDescription className="text-gray-600">
            Bergabung dengan Koperasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nrp">NRP</Label>
              <Input
                id="nrp"
                name="nrp"
                type="text"
                placeholder="Nomor Registrasi Pegawai"
                value={formData.nrp}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                name="nama"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jabatan">Jabatan</Label>
              <Input
                id="jabatan"
                name="jabatan"
                type="text"
                placeholder="Masukkan jabatan"
                value={formData.jabatan}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleChange}
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
              {isLoading ? 'Memproses...' : 'Daftar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;

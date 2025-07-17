
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Users as UsersIcon,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  UserPlus,
  Download
} from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Mock users data
  const users = [
    {
      id: '1',
      nrp: '2021001',
      name: 'Ahmad Wijaya',
      email: 'ahmad@koperasi.com',
      position: 'Anggota',
      status: 'active',
      savings: 2500000,
      debt: 500000,
      joinDate: '2021-01-15',
      lastTransaction: '2024-01-15'
    },
    {
      id: '2',
      nrp: '2021002',
      name: 'Siti Nurhaliza',
      email: 'siti@koperasi.com',
      position: 'Anggota',
      status: 'active',
      savings: 1800000,
      debt: 300000,
      joinDate: '2021-02-20',
      lastTransaction: '2024-01-10'
    },
    {
      id: '3',
      nrp: '2020001',
      name: 'Budi Santoso',
      email: 'budi@koperasi.com',
      position: 'Pengurus',
      status: 'active',
      savings: 5000000,
      debt: 0,
      joinDate: '2020-06-10',
      lastTransaction: '2024-01-12'
    },
    {
      id: '4',
      nrp: '2022001',
      name: 'Maria Kristina',
      email: 'maria@koperasi.com',
      position: 'Anggota',
      status: 'inactive',
      savings: 750000,
      debt: 150000,
      joinDate: '2022-03-08',
      lastTransaction: '2023-11-20'
    },
    {
      id: '5',
      nrp: '2021003',
      name: 'Rahmat Hidayat',
      email: 'rahmat@koperasi.com',
      position: 'Anggota',
      status: 'active',
      savings: 3200000,
      debt: 800000,
      joinDate: '2021-05-15',
      lastTransaction: '2024-01-08'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nrp.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalSavings = users.reduce((sum, u) => sum + u.savings, 0);
  const totalDebt = users.reduce((sum, u) => sum + u.debt, 0);

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Aktif</Badge>
    ) : (
      <Badge variant="secondary">Tidak Aktif</Badge>
    );
  };

  const getPositionBadge = (position: string) => {
    return position === 'Pengurus' ? (
      <Badge className="bg-blue-100 text-blue-800">Pengurus</Badge>
    ) : (
      <Badge variant="outline">Anggota</Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Anggota</h1>
          <p className="text-gray-600">Kelola data anggota koperasi</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Anggota
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100 mr-4">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Anggota</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 mr-4">
                <UsersIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Anggota Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100 mr-4">
                <UsersIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Simpanan</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalSavings)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100 mr-4">
                <UsersIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Piutang</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari berdasarkan nama, NRP, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Anggota ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NRP</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Simpanan</TableHead>
                <TableHead className="text-right">Piutang</TableHead>
                <TableHead>Bergabung</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nrp}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">
                        Transaksi terakhir: {new Date(user.lastTransaction).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>{getPositionBadge(user.position)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {formatCurrency(user.savings)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    {formatCurrency(user.debt)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(user.joinDate).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/user/${user.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Detail
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/edit-financial/${user.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Keuangan
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Anggota tidak ditemukan</h3>
              <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;

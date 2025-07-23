import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMember } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import {
  ArrowLeft,
  User,
  Wallet,
  CreditCard,
  History,
  Calendar,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  ArrowDownRight,
  Edit
} from 'lucide-react';

const UserDetail = () => {
  const { id } = useParams();
  const { data: memberResponse, isLoading, error } = useMember(id || '');

  // Extract member data from response
  const member = memberResponse?.data || memberResponse;

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat data anggota...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !member) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Gagal memuat data anggota</p>
            <Button onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Aktif</Badge>
    ) : (
      <Badge variant="secondary">Tidak Aktif</Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
    ) : (
      <Badge variant="outline">Anggota</Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/users"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Anggota
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Detail Anggota</h1>
          <Link to={`/edit-financial/${id}`}>
            <Button className="bg-green-600 hover:bg-green-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Keuangan
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{member.nama}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {getRoleBadge(member.role)}
                <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                <Badge variant="outline">
                  NRP: {member.nrp}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Bergabung: {formatDate(member.createdAt)}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Jabatan: {member.jabatan}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Wallet className="w-5 h-5 mr-2" />
              Total Simpanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(member.simpanan?.totalSimpanan || 0)}
            </p>
            <p className="text-sm text-gray-500">
              {member.summary?.simpananTransactions?.totalTransactions || 0} transaksi tahun ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <CreditCard className="w-5 h-5 mr-2" />
              Total Piutang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 mb-2">
              {formatCurrency(member.summary?.totalActivePiutangAmount || 0)}
            </p>
            <p className="text-sm text-gray-500">
              {member.summary?.activePiutang || 0} pinjaman aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History and Summary */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Riwayat Transaksi</TabsTrigger>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="space-y-6">
          {/* Savings History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Wallet className="w-5 h-5 mr-2" />
                Riwayat Simpanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {member.simpanan?.transactions?.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${transaction.type === 'penarikan' ? 'bg-red-50' : 'bg-green-50'}`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-lg ${transaction.type === 'penarikan' ? 'bg-red-100' : 'bg-green-100'} mr-4`}
                      >
                        {transaction.type === 'penarikan' ? (
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${transaction.type === 'penarikan' ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {transaction.type === 'penarikan' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Saldo: {formatCurrency(transaction.balanceAfter)}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">Tidak ada transaksi simpanan</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Debt History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <CreditCard className="w-5 h-5 mr-2" />
                Riwayat Piutang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {member.piutang?.map((piutang) => (
                  <div key={piutang.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{piutang.jenis}</h4>
                        <p className="text-sm text-gray-500">{piutang.description}</p>
                      </div>
                      <Badge className={piutang.status === 'active' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}>
                        {piutang.status === 'active' ? 'Aktif' : 'Lunas'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Pinjaman:</span>
                        <span className="font-medium ml-2">{formatCurrency(piutang.besarPinjaman)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sisa:</span>
                        <span className="font-medium ml-2">{formatCurrency(piutang.sisaPiutang)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Angsuran:</span>
                        <span className="font-medium ml-2">{piutang.sisaAngsuran}/{piutang.totalAngsuran}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Per Angsuran:</span>
                        <span className="font-medium ml-2">{formatCurrency(piutang.biayaAngsuran)}</span>
                      </div>
                    </div>
                    {piutang.transactions && piutang.transactions.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <h5 className="font-medium text-sm mb-2">Riwayat Transaksi:</h5>
                        <div className="space-y-2">
                          {piutang.transactions.slice(0, 3).map((transaction) => (
                            <div key={transaction.id} className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">{transaction.description}</span>
                              <span className={parseFloat(transaction.amount) < 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">Tidak ada data piutang</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          {/* Savings Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Wallet className="w-5 h-5 mr-2" />
                Ringkasan Simpanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total simpanan</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(member.summary?.totalSimpanan || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Simpanan Pokok</span>
                  <span className="font-medium">{formatCurrency(member.summary?.simpananBreakdown?.simpananPokok || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Simpanan Wajib</span>
                  <span className="font-medium">{formatCurrency(member.summary?.simpananBreakdown?.simpananWajib || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Simpanan Sukarela</span>
                  <span className="font-medium">{formatCurrency(member.summary?.simpananBreakdown?.simpananSukarela || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tabungan Hari Raya</span>
                  <span className="font-medium">{formatCurrency(member.summary?.simpananBreakdown?.tabunganHariRaya || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah transaksi</span>
                  <span className="font-medium">{member.summary?.simpananTransactions?.totalTransactions || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debt Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <CreditCard className="w-5 h-5 mr-2" />
                Ringkasan Piutang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total piutang aktif</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(member.summary?.totalActivePiutangAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Piutang aktif</span>
                  <span className="font-medium">{member.summary?.activePiutang || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Piutang lunas</span>
                  <span className="font-medium">{member.summary?.completedPiutang || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total piutang lunas</span>
                  <span className="font-medium">{formatCurrency(member.summary?.totalCompletedPiutangAmount || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetail;

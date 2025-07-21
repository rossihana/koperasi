
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  CreditCard,
  Users,
  Store,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useMembersPublic, useUserProducts } from '@/hooks/useApi';

const Index = () => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Ambil data anggota dan produk
  const { data: membersResponse } = useMembersPublic(1);
  const { data: productsResponse } = useUserProducts(1);

  // Hitung total anggota dan produk
  const totalAnggota = membersResponse?.data?.pagination?.totalItems || membersResponse?.data?.total || membersResponse?.total || 0;
  const totalProduk = productsResponse?.total || productsResponse?.data?.total || productsResponse?.data?.pagination?.totalItems || 0;

  const quickStats = [
    {
      title: 'Total Simpanan',
      value: formatCurrency(user?.simpanan || 0),
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Piutang',
      value: formatCurrency(user?.piutang || 0),
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      type: 'Simpanan',
      amount: 500000,
      date: '2024-01-15',
      description: 'Setoran bulanan',
      isCredit: true
    },
    {
      id: 2,
      type: 'Piutang',
      amount: 200000,
      date: '2024-01-10',
      description: 'Pinjaman konsumtif',
      isCredit: false
    },
    {
      id: 3,
      type: 'Simpanan',
      amount: 100000,
      date: '2024-01-05',
      description: 'Simpanan sukarela',
      isCredit: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Selamat Datang, {user?.nama}!
              </h1>
              <p className="text-green-100 mb-4">
                {user?.jabatan} • NRP: {user?.nrp}
              </p>
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Calendar className="w-4 h-4 mr-1" />
                  Bergabung: {new Date(user?.joinDate || '').toLocaleDateString('id-ID')}
                </Badge>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor} mr-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {user?.role === 'admin' && (
          <>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Anggota</p>
                    <p className="text-2xl font-bold text-gray-900">{totalAnggota}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-100 mr-4">
                    <Store className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produk Toko</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProduk}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Transaksi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-4 ${
                    transaction.isCredit ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.isCredit ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.type} • {new Date(transaction.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.isCredit ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;

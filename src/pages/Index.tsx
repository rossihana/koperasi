
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
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
import { useMembersPublic, useUserProducts, useMember, useMemberProfile, useMemberTransactionsCombined, useMyTransactionsCombined } from '@/hooks/useApi';

const Index = () => {
  const { user } = useAuth();
  const { data: profileResponse, isLoading: isProfileLoading, error: profileError } = useMemberProfile();
  const profile = profileResponse?.data || profileResponse;

  console.log("Profile data on Index page:", profile);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Ambil data anggota dan produk
  const { data: membersResponse } = useMembersPublic(1, user?.role === 'admin');
  const { data: productsResponse } = useUserProducts(1);

  // Hitung total anggota dan produk
  const totalAnggota = membersResponse?.data?.pagination?.totalItems || membersResponse?.data?.total || membersResponse?.total || 0;
  const totalProduk = productsResponse?.total || productsResponse?.data?.total || productsResponse?.data?.pagination?.totalItems || 0;

  const quickStats = [
    {
      title: 'Total Simpanan',
      value: formatCurrency(profile?.simpanan?.totalSimpanan ?? 0),
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Piutang',
      value: formatCurrency(profile?.summary?.totalActivePiutangAmount ?? 0),
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  // Fetch member transactions
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;
  const { data: transactionsResponse } = useMyTransactionsCombined(currentPage, transactionsPerPage);

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
                  Bergabung: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('id-ID') : '-'}
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
            {!transactionsResponse ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full"></div>
                <span className="ml-2 text-gray-600">Memuat transaksi...</span>
              </div>
            ) : !transactionsResponse.data?.transactions || transactionsResponse.data.transactions.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                Belum ada transaksi
              </div>
            ) : (
              <>
                {transactionsResponse.data.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-4 ${
                          transaction.type === 'setoran' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'setoran' ? (
                            <ArrowUpRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {transaction.category ? 'Simpanan ' + transaction.category : 'Piutang'} • {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'setoran' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                {/* Pagination */}
                {transactionsResponse.data.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 pt-4">
                    <button
                      onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                      disabled={transactionsResponse.data.pagination.currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        transactionsResponse.data.pagination.currentPage === 1 
                          ? 'bg-gray-100 text-gray-400' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      Sebelumnya
                    </button>
                    <span className="text-sm text-gray-600">
                      Halaman {transactionsResponse.data.pagination.currentPage} dari{' '}
                      {transactionsResponse.data.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(page => Math.min(
                        transactionsResponse.data.pagination.totalPages,
                        page + 1
                      ))}
                      disabled={transactionsResponse.data.pagination.currentPage === transactionsResponse.data.pagination.totalPages}
                      className={`px-3 py-1 rounded-md ${
                        transactionsResponse.data.pagination.currentPage === transactionsResponse.data.pagination.totalPages
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      Selanjutnya
                    </button>
                  </div>
                )}
          
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;

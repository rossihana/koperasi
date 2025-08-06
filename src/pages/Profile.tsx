
import React from 'react';
import { useMemberProfile, useMemberSimpananTransactions, useMemberPiutangTransactions } from '@/hooks/useApi';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileSummaryContent } from '@/components/ProfileSummaryContent';
import {
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
  ArrowRight,
  Loader2,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChangePasswordForm } from '@/components/ChangePasswordForm';

interface Transaction {
  id: string;
  amount: number | string;
  description: string;
  category?: string;
  type: string;
  createdAt: string;
  balanceBefore?: number;
  balanceAfter?: number;
}

const Profile = () => {
  const { data: profileResponse, isLoading, error } = useMemberProfile();
  const { data: simpananData, isLoading: isLoadingSimpanan } = useMemberSimpananTransactions(100);
  const { data: piutangData, isLoading: isLoadingPiutang } = useMemberPiutangTransactions();

  // Pagination state for simpanan
  const [currentSimpananPage, setCurrentSimpananPage] = useState(1);
  const transactionsPerPage = 5;
  
  // Pagination state for piutang
  const [currentPiutangPage, setCurrentPiutangPage] = useState(1);
  const profile = profileResponse?.data || profileResponse;

  console.log("Simpanan Transactions Summary from Backend:", profile?.summary?.simpananTransactions);

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
          <span className="ml-2">Memuat data profil...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Gagal memuat data profil</p>
            <Button onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Card className="mb-8">
        <CardContent className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center self-center md:self-start">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center md:text-left">{profile.nama}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {profile.jabatan}
                </Badge>
                <Badge variant="outline">
                  NRP: {profile.nrp}
                </Badge>
                <Badge variant="outline">
                  {profile.role === 'admin' ? 'Admin' : 'Anggota'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Bergabung: {new Date(profile.createdAt).toLocaleDateString('id-ID')}
                </div>
              </div>
              <div className="mt-4 flex justify-center md:justify-start">
                <ChangePasswordForm />
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
              {formatCurrency(profile.simpanan?.totalSimpanan || 0)}
            </p>
            <p className="text-sm text-gray-500">
              {profile.summary?.simpananTransactions?.totalTransactions || 0} transaksi
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
              {formatCurrency(profile.summary?.totalActivePiutangAmount || 0)}
            </p>
            <p className="text-sm text-gray-500">
              {profile.summary?.activePiutang || 0} pinjaman aktif
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History and Summary */}
      <Tabs defaultValue="summary" className="w-full">
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
                {isLoadingSimpanan ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Memuat data...</span>
                  </div>
                ) : !simpananData?.data?.transactions || simpananData.data.transactions.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    Belum ada transaksi simpanan
                  </div>
                ) : (
                  <>
                    {simpananData.data.transactions
                      .slice(
                        (currentSimpananPage - 1) * transactionsPerPage,
                        currentSimpananPage * transactionsPerPage
                      )
                      .map((transaction: Transaction) => (
                        <div
                          key={transaction.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            transaction.type === 'penarikan'
                              ? 'bg-red-50'
                              : transaction.type === 'koreksi'
                              ? 'bg-gray-100'
                              : 'bg-green-50'
                          }`}>
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-lg ${
                                transaction.type === 'penarikan'
                                  ? 'bg-red-100'
                                  : transaction.type === 'koreksi'
                                  ? 'bg-gray-200'
                                  : 'bg-green-100'
                              } mr-4`}
                            >
                              {transaction.type === 'penarikan' ? (
                                <ArrowDownRight className="w-5 h-5 text-red-600" />
                              ) : transaction.type === 'koreksi' ? (
                                <ArrowRight className="w-5 h-5 text-gray-500" />
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
                              className={`font-bold ${
                                transaction.type === 'penarikan'
                                  ? 'text-red-600'
                                  : transaction.type === 'koreksi'
                                  ? 'text-gray-900'
                                  : 'text-green-600'
                              }`}
                            >
                              {transaction.type === 'penarikan'
                                ? '- '
                                : transaction.type === 'koreksi'
                                ? ''
                                : '+ '}{formatCurrency(Math.abs(typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount))}
                            </p>
                            <p className="text-sm text-gray-500">
                              Sblm: {formatCurrency(transaction.balanceBefore || 0)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Stlh: {formatCurrency(transaction.balanceAfter || 0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    {simpananData.data.transactions.length > transactionsPerPage && (
                      <div className="flex justify-center items-center space-x-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setCurrentSimpananPage(page => Math.max(1, page - 1))}
                          disabled={currentSimpananPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            currentSimpananPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          Sebelumnya
                        </button>
                        <span className="text-sm text-gray-600">
                          Halaman {currentSimpananPage} dari{' '}
                          {Math.ceil(simpananData.data.transactions.length / transactionsPerPage)}
                        </span>
                        <button
                          onClick={() => setCurrentSimpananPage(page => 
                            Math.min(Math.ceil(simpananData.data.transactions.length / transactionsPerPage), page + 1)
                          )}
                          disabled={currentSimpananPage === Math.ceil(simpananData.data.transactions.length / transactionsPerPage)}
                          className={`px-3 py-1 rounded-md ${
                            currentSimpananPage === Math.ceil(simpananData.data.transactions.length / transactionsPerPage)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
                {isLoadingPiutang ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Memuat data...</span>
                  </div>
                ) : !piutangData?.data?.transactions || piutangData.data.transactions.length === 0 ? (
                  <div className="text-center p-4 text-gray-500">
                    Belum ada transaksi piutang
                  </div>
                ) : (
                  <>
                    {piutangData.data.transactions
                      .slice(
                        (currentPiutangPage - 1) * transactionsPerPage,
                        currentPiutangPage * transactionsPerPage
                      )
                      .map((transaction: Transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-red-100 mr-4">
                              <ArrowDownRight className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-500">
                                Piutang • {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">
                              {formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    
                    {/* Pagination Controls */}
                    {piutangData.data.transactions.length > transactionsPerPage && (
                      <div className="flex justify-center items-center space-x-2 pt-4">
                        <button
                          onClick={() => setCurrentPiutangPage(page => Math.max(1, page - 1))}
                          disabled={currentPiutangPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            currentPiutangPage === 1
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          Sebelumnya
                        </button>
                        <span className="text-sm text-gray-600">
                          Halaman {currentPiutangPage} dari{' '}
                          {Math.ceil(piutangData.data.transactions.length / transactionsPerPage)}
                        </span>
                        <button
                          onClick={() => setCurrentPiutangPage(page => 
                            Math.min(Math.ceil(piutangData.data.transactions.length / transactionsPerPage), page + 1)
                          )}
                          disabled={currentPiutangPage === Math.ceil(piutangData.data.transactions.length / transactionsPerPage)}
                          className={`px-3 py-1 rounded-md ${
                            currentPiutangPage === Math.ceil(piutangData.data.transactions.length / transactionsPerPage)
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
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
        </TabsContent>

        <TabsContent value="summary">
          <div className="space-y-6">
            {/* Ringkasan Simpanan Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <Wallet className="w-5 h-5 mr-2" />
                  Ringkasan Simpanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total simpanan</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(profile.simpanan?.totalSimpanan || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Simpanan Pokok</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(profile.simpanan?.simpananPokok || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Simpanan Wajib</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(profile.simpanan?.simpananWajib || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Simpanan Sukarela</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(profile.simpanan?.simpananSukarela || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tabungan Hari Raya</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(profile.simpanan?.tabunganHariRaya || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Jumlah transaksi</span>
                    <span className="font-bold text-gray-900">
                      {simpananData?.data?.transactions?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaksi Setoran</span>
                    <span className="font-bold text-gray-900">
                      {simpananData?.data?.transactions?.filter(t => t.type === 'setoran').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaksi Penarikan</span>
                    <span className="font-bold text-gray-900">
                      {simpananData?.data?.transactions?.filter(t => t.type === 'penarikan').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaksi Koreksi</span>
                    <span className="font-bold text-gray-900">
                      {simpananData?.data?.transactions?.filter(t => t.type === 'koreksi').length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ringkasan Piutang Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Ringkasan Piutang
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total piutang aktif</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(profile.summary?.totalActivePiutangAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Piutang aktif</span>
                    <span className="font-bold text-gray-900">
                      {profile.summary?.activePiutang || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Piutang lunas</span>
                    <span className="font-bold text-gray-900">
                      {profile.summary?.completedPiutang || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total piutang lunas</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(profile.summary?.totalCompletedPiutangAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Total semua piutang</span>
                    <span className="font-bold text-gray-900">
                      {profile.summary?.totalPiutang || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

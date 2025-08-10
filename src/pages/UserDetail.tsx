import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMember, useMemberTransactionsSimpanan, useMemberTransactionsPiutang } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import {
  ArrowLeft,
  User,
  Wallet,
  CreditCard,
  History,
  Calendar,
  Shield,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Edit,
  Key
} from 'lucide-react';
import { ChangePasswordForm } from '@/components/ChangePasswordForm';
import { DeleteMemberConfirmation } from '@/components/DeleteMemberConfirmation';
import { EditMemberForm } from '@/components/EditMemberForm';
import { ProfileSummaryContent } from '@/components/ProfileSummaryContent';

import React, { useState } from 'react';

const UserDetail = () => {
  const { id } = useParams();

  // Pagination state for simpanan transactions
  const [currentSimpananPage, setCurrentSimpananPage] = useState(1);
  const transactionsPerPage = 5;
  const [currentPiutangPage, setCurrentPiutangPage] = useState(1);

  const { data: memberResponse, isLoading, error } = useMember(id || '');
  const { data: simpananData, isLoading: isLoadingSimpanan } = useMemberTransactionsSimpanan(id || '', currentSimpananPage, transactionsPerPage);

  // Extract member data from response
  const member = memberResponse?.data || memberResponse;

  const { data: piutangData, isLoading: isLoadingPiutang } = useMemberTransactionsPiutang(id || '', currentPiutangPage, transactionsPerPage);

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
    return status === 'aktif' ? (
      <Badge className="bg-green-100 text-green-800">Aktif</Badge>
    ) : status === 'suspend' ? (
      <Badge className="bg-red-100 text-red-800">Suspend</Badge>
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Detail Anggota</h1>
          <div className="flex gap-2 flex-wrap">
            <Link to={`/edit-financial/${id}`}>
              <Button className="bg-green-600 hover:bg-green-700">
                <Edit className="w-4 h-4 mr-2" />
                Edit Keuangan
              </Button>
            </Link>
            {member && (
              <EditMemberForm
                memberId={id || ''}
                initialData={{
                  nrp: member.nrp,
                  nama: member.nama,
                  jabatan: member.jabatan,
                  status: member.status || 'aktif'
                }}
              />
            )}
            <ChangePasswordForm memberId={id} isAdmin={true} />
            <DeleteMemberConfirmation memberId={id || ''} memberName={member.nama} />
          </div>
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
                {getStatusBadge(member.status)}
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
                  <Shield className="w-4 h-4 mr-2" />
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
                    {simpananData.data.transactions.map((transaction) => (
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
                                <ArrowRight className="w-5 h-5 text-gray-600" />
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
                              Sebelum: {formatCurrency(transaction.balanceBefore)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Setelah: {formatCurrency(transaction.balanceAfter)}
                            </p>
                          </div>
                        </div>
                      ))}
                    {simpananData.data.pagination && simpananData.data.pagination.totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => setCurrentSimpananPage(page => Math.max(1, page - 1))}
                          disabled={simpananData.data.pagination.currentPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            simpananData.data.pagination.currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          Sebelumnya
                        </button>
                        <span className="text-sm text-gray-600">
                          Halaman {simpananData.data.pagination.currentPage} dari{' '}
                          {simpananData.data.pagination.totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentSimpananPage(page => 
                            Math.min(simpananData.data.pagination.totalPages, page + 1)
                          )}
                          disabled={simpananData.data.pagination.currentPage === simpananData.data.pagination.totalPages}
                          className={`px-3 py-1 rounded-md ${
                            simpananData.data.pagination.currentPage === simpananData.data.pagination.totalPages
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
                    {piutangData.data.transactions.map((transaction) => (
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
                    {piutangData.data.pagination && piutangData.data.pagination.totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-2 pt-4">
                        <button
                          onClick={() => setCurrentPiutangPage(page => Math.max(1, page - 1))}
                          disabled={piutangData.data.pagination.currentPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            piutangData.data.pagination.currentPage === 1
                              ? 'bg-gray-100 text-gray-400'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          Sebelumnya
                        </button>
                        <span className="text-sm text-gray-600">
                          Halaman {piutangData.data.pagination.currentPage} dari{' '}
                          {piutangData.data.pagination.totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPiutangPage(page => 
                            Math.min(piutangData.data.pagination.totalPages, page + 1)
                          )}
                          disabled={piutangData.data.pagination.currentPage === piutangData.data.pagination.totalPages}
                          className={`px-3 py-1 rounded-md ${
                            piutangData.data.pagination.currentPage === piutangData.data.pagination.totalPages
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
          <ProfileSummaryContent 
            profile={member} 
            statistics={simpananData?.data?.statistics} 
            formatCurrency={formatCurrency} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDetail;

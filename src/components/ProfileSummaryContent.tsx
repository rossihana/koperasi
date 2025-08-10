import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Wallet, CreditCard, BadgeCheck, BadgeX } from 'lucide-react';
import { Member, Piutang } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

interface ProfileSummaryContentProps {
  profile: Member;
  statistics: any; // Ganti dengan tipe yang lebih spesifik jika ada
  formatCurrency: (amount: number | string) => string;
}

export const ProfileSummaryContent = ({ profile, statistics, formatCurrency }: ProfileSummaryContentProps) => {
  const getCount = (type: 'setoran' | 'penarikan' | 'koreksi') => {
    if (!statistics?.byType) {
      return 0;
    }
    const transactionType = statistics.byType.find((t: any) => t.type === type);
    return transactionType?.count || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const totalTransactions = statistics?.total?.transactions || 0;

  const simpananData = typeof profile.simpanan === 'object' ? profile.simpanan : null;
  const activePiutangList = Array.isArray(profile.piutang) 
    ? profile.piutang.filter(p => p.status === 'active') 
    : [];
  const completedPiutangList = Array.isArray(profile.piutang) 
    ? profile.piutang.filter(p => p.status === 'completed') 
    : [];


  return (
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
                  {formatCurrency(simpananData?.totalSimpanan || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Simpanan Pokok</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(simpananData?.simpananPokok || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Simpanan Wajib</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(simpananData?.simpananWajib || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Simpanan Sukarela</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(simpananData?.simpananSukarela || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tabungan Hari Raya</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(simpananData?.tabunganHariRaya || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-600">Jumlah transaksi</span>
                <span className="font-bold text-gray-900">
                  {totalTransactions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaksi Setoran</span>
                <span className="font-bold text-gray-900">
                  {getCount('setoran')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaksi Penarikan</span>
                <span className="font-bold text-gray-900">
                  {getCount('penarikan')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaksi Koreksi</span>
                <span className="font-bold text-gray-900">
                  {getCount('koreksi')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaksi terakhir</span>
                <span className="font-bold text-gray-900">
                  {profile.summary?.simpananTransactions?.lastTransactionDate
                    ? new Date(profile.summary.simpananTransactions.lastTransactionDate).toLocaleDateString('id-ID')
                    : '-'}
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

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-md mb-2">Rincian Piutang Aktif</h4>
              {activePiutangList.length > 0 ? (
                activePiutangList.map((piutang, index) => (
                  <div key={piutang.id} className="space-y-2 border p-4 rounded-lg mt-2">
                    <h5 className="font-semibold text-md">Pinjaman #{index + 1} - {piutang.jenis}</h5>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status</span>
                      <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Besar Pinjaman</span>
                      <span className="font-bold text-gray-900">{formatCurrency(piutang.besarPinjaman)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Piutang (dengan bunga)</span>
                      <span className="font-bold text-gray-900">{formatCurrency(piutang.totalPiutang)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Angsuran per Bulan</span>
                      <span className="font-bold text-gray-900">{formatCurrency(piutang.biayaAngsuran)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sisa Piutang</span>
                      <span className="font-bold text-red-600">{formatCurrency(piutang.sisaPiutang || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sisa Angsuran</span>
                      <span className="font-bold text-gray-900">{piutang.sisaAngsuran} / {piutang.totalAngsuran} bulan</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tanggal Pinjaman</span>
                      <span className="font-bold text-gray-900">{formatDate(piutang.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pembaruan Terakhir</span>
                      <span className="font-bold text-gray-900">{formatDate(piutang.updatedAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  Tidak ada piutang aktif saat ini.
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold text-md mb-2">Rincian Piutang Lunas</h4>
              {completedPiutangList.length > 0 ? (
                completedPiutangList.map((piutang, index) => (
                  <div key={piutang.id} className="space-y-2 border p-4 rounded-lg mt-2 bg-gray-50 text-gray-500">
                    <h5 className="font-semibold text-md text-gray-700">Pinjaman Lunas #{index + 1} - {piutang.jenis}</h5>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Status</span>
                      <Badge className="bg-blue-100 text-blue-800">Lunas</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Besar Pinjaman</span>
                      <span className="font-medium text-gray-700">{formatCurrency(piutang.besarPinjaman)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Tanggal Pinjaman</span>
                      <span className="font-medium text-gray-700">{formatDate(piutang.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Tanggal Pelunasan</span>
                      <span className="font-medium text-gray-700">{piutang.completedAt ? formatDate(piutang.completedAt) : '-'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  Tidak ada piutang yang sudah lunas.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  ); 
};
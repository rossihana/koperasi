import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Wallet, CreditCard } from 'lucide-react';
import { Member } from '@/lib/api';

interface ProfileSummaryContentProps {
  profile: Member;
  statistics: SimpananTransactionsSummary | undefined;
  formatCurrency: (amount: number) => string;
}

export const ProfileSummaryContent = ({ profile, statistics, formatCurrency }: ProfileSummaryContentProps) => {
  const getCount = (type: 'setoran' | 'penarikan' | 'koreksi') => {
    if (!statistics?.byType) {
      return 0;
    }
    const transactionType = statistics.byType.find((t) => t.type === type);
    return transactionType?.count || 0;
  };

  const totalTransactions = statistics?.total?.transactions || 0;

  const simpananData = typeof profile.simpanan === 'object' ? profile.simpanan : null;

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
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
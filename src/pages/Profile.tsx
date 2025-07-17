
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ArrowDownRight
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const savingsHistory = [
    { id: 1, date: '2024-01-15', amount: 500000, description: 'Setoran bulanan', balance: 2500000 },
    { id: 2, date: '2024-01-05', amount: 100000, description: 'Simpanan sukarela', balance: 2000000 },
    { id: 3, date: '2023-12-15', amount: 500000, description: 'Setoran bulanan', balance: 1900000 },
    { id: 4, date: '2023-12-01', amount: 50000, description: 'Simpanan tambahan', balance: 1400000 },
  ];

  const debtHistory = [
    { id: 1, date: '2024-01-10', amount: 200000, description: 'Pinjaman konsumtif', balance: 500000 },
    { id: 2, date: '2023-11-15', amount: 300000, description: 'Pinjaman pendidikan', balance: 300000 },
  ];

  const transactionSummary = {
    totalSavingsThisYear: 1200000,
    totalDebtThisYear: 500000,
    savingsTransactions: 8,
    debtTransactions: 2
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {user?.position}
                </Badge>
                <Badge variant="outline">
                  NRP: {user?.nrp}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {user?.email}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Bergabung: {new Date(user?.joinDate || '').toLocaleDateString('id-ID')}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +62 812 3456 7890
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Jakarta, Indonesia
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
              {formatCurrency(user?.savings || 0)}
            </p>
            <p className="text-sm text-gray-500">
              +{formatCurrency(transactionSummary.totalSavingsThisYear)} tahun ini
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
              {formatCurrency(user?.debt || 0)}
            </p>
            <p className="text-sm text-gray-500">
              +{formatCurrency(transactionSummary.totalDebtThisYear)} tahun ini
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
                {savingsHistory.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-green-100 mr-4">
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        +{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Saldo: {formatCurrency(transaction.balance)}
                      </p>
                    </div>
                  </div>
                ))}
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
                {debtHistory.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-red-100 mr-4">
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        +{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: {formatCurrency(transaction.balance)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                Ringkasan Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-700 text-lg">Simpanan</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total tahun ini</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(transactionSummary.totalSavingsThisYear)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jumlah transaksi</span>
                      <span className="font-medium">{transactionSummary.savingsTransactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rata-rata per transaksi</span>
                      <span className="font-medium">
                        {formatCurrency(transactionSummary.totalSavingsThisYear / transactionSummary.savingsTransactions)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-700 text-lg">Piutang</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total tahun ini</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(transactionSummary.totalDebtThisYear)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jumlah transaksi</span>
                      <span className="font-medium">{transactionSummary.debtTransactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rata-rata per transaksi</span>
                      <span className="font-medium">
                        {formatCurrency(transactionSummary.totalDebtThisYear / transactionSummary.debtTransactions)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;

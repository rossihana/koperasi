
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  User,
  Wallet,
  CreditCard,
  Save,
  Plus,
  Minus,
  Calculator
} from 'lucide-react';

const EditFinancial = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock user data
  const user = {
    id: id,
    nrp: '2021001',
    name: 'Ahmad Wijaya',
    email: 'ahmad@koperasi.com',
    position: 'Anggota',
    savings: 2500000,
    debt: 500000
  };

  const [savingsForm, setSavingsForm] = useState({
    type: 'add',
    amount: '',
    description: ''
  });

  const [debtForm, setDebtForm] = useState({
    type: 'add',
    amount: '',
    description: '',
    interestRate: '2.5',
    duration: '12'
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const handleSavingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!savingsForm.amount || !savingsForm.description) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(savingsForm.amount);
    const newSavings = savingsForm.type === 'add' 
      ? user.savings + amount 
      : user.savings - amount;

    if (newSavings < 0) {
      toast({
        title: "Saldo tidak mencukupi",
        description: "Jumlah penarikan melebihi saldo simpanan",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    toast({
      title: "Simpanan berhasil diupdate",
      description: `${savingsForm.type === 'add' ? 'Menambah' : 'Mengurangi'} simpanan sebesar ${formatCurrency(amount)}`,
    });

    // Reset form
    setSavingsForm({
      type: 'add',
      amount: '',
      description: ''
    });
  };

  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!debtForm.amount || !debtForm.description) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(debtForm.amount);
    const newDebt = debtForm.type === 'add' 
      ? user.debt + amount 
      : user.debt - amount;

    if (newDebt < 0) {
      toast({
        title: "Pembayaran melebihi hutang",
        description: "Jumlah pembayaran melebihi total piutang",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    toast({
      title: "Piutang berhasil diupdate",
      description: `${debtForm.type === 'add' ? 'Menambah' : 'Mengurangi'} piutang sebesar ${formatCurrency(amount)}`,
    });

    // Reset form
    setDebtForm({
      type: 'add',
      amount: '',
      description: '',
      interestRate: '2.5',
      duration: '12'
    });
  };

  const calculateLoanInterest = () => {
    if (debtForm.amount && debtForm.interestRate && debtForm.duration) {
      const principal = parseFloat(debtForm.amount);
      const rate = parseFloat(debtForm.interestRate) / 100 / 12;
      const months = parseInt(debtForm.duration);
      
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      const totalPayment = monthlyPayment * months;
      const totalInterest = totalPayment - principal;
      
      return {
        monthlyPayment,
        totalPayment,
        totalInterest
      };
    }
    return null;
  };

  const loanCalculation = calculateLoanInterest();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/user/${id}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Detail Anggota
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Data Keuangan</h1>
        <p className="text-gray-600">Kelola simpanan dan piutang anggota</p>
      </div>

      {/* User Info */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <div className="flex space-x-2 mt-1">
                <Badge variant="outline">NRP: {user.nrp}</Badge>
                <Badge variant="secondary">{user.position}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Wallet className="w-5 h-5 mr-2" />
              Saldo Simpanan Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(user.savings)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <CreditCard className="w-5 h-5 mr-2" />
              Total Piutang Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(user.debt)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Forms */}
      <Tabs defaultValue="savings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="savings">Edit Simpanan</TabsTrigger>
          <TabsTrigger value="debt">Edit Piutang</TabsTrigger>
        </TabsList>
        
        <TabsContent value="savings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Transaksi Simpanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavingsSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="savings-type">Jenis Transaksi</Label>
                  <Select 
                    value={savingsForm.type} 
                    onValueChange={(value) => setSavingsForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis transaksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">
                        <div className="flex items-center">
                          <Plus className="w-4 h-4 mr-2 text-green-600" />
                          Tambah Simpanan
                        </div>
                      </SelectItem>
                      <SelectItem value="subtract">
                        <div className="flex items-center">
                          <Minus className="w-4 h-4 mr-2 text-red-600" />
                          Kurangi Simpanan
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savings-amount">Jumlah (Rp)</Label>
                  <Input
                    id="savings-amount"
                    type="number"
                    placeholder="Masukkan jumlah"
                    value={savingsForm.amount}
                    onChange={(e) => setSavingsForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savings-description">Keterangan</Label>
                  <Textarea
                    id="savings-description"
                    placeholder="Masukkan keterangan transaksi"
                    value={savingsForm.description}
                    onChange={(e) => setSavingsForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                {savingsForm.amount && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Preview Transaksi:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Saldo saat ini:</span>
                        <span className="font-medium">{formatCurrency(user.savings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {savingsForm.type === 'add' ? 'Tambah:' : 'Kurangi:'}
                        </span>
                        <span className={`font-medium ${savingsForm.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                          {savingsForm.type === 'add' ? '+' : '-'}{formatCurrency(parseFloat(savingsForm.amount) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="font-medium">Saldo baru:</span>
                        <span className="font-bold">
                          {formatCurrency(
                            savingsForm.type === 'add' 
                              ? user.savings + (parseFloat(savingsForm.amount) || 0)
                              : user.savings - (parseFloat(savingsForm.amount) || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Transaksi Simpanan
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debt">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Transaksi Piutang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDebtSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="debt-type">Jenis Transaksi</Label>
                  <Select 
                    value={debtForm.type} 
                    onValueChange={(value) => setDebtForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis transaksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">
                        <div className="flex items-center">
                          <Plus className="w-4 h-4 mr-2 text-red-600" />
                          Tambah Pinjaman
                        </div>
                      </SelectItem>
                      <SelectItem value="subtract">
                        <div className="flex items-center">
                          <Minus className="w-4 h-4 mr-2 text-green-600" />
                          Bayar Pinjaman
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="debt-amount">Jumlah (Rp)</Label>
                  <Input
                    id="debt-amount"
                    type="number"
                    placeholder="Masukkan jumlah"
                    value={debtForm.amount}
                    onChange={(e) => setDebtForm(prev => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>

                {debtForm.type === 'add' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="interest-rate">Bunga per Tahun (%)</Label>
                        <Input
                          id="interest-rate"
                          type="number"
                          step="0.1"
                          placeholder="2.5"
                          value={debtForm.interestRate}
                          onChange={(e) => setDebtForm(prev => ({ ...prev, interestRate: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Jangka Waktu (Bulan)</Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="12"
                          value={debtForm.duration}
                          onChange={(e) => setDebtForm(prev => ({ ...prev, duration: e.target.value }))}
                        />
                      </div>
                    </div>

                    {loanCalculation && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Calculator className="w-4 h-4 mr-2" />
                          Kalkulasi Pinjaman:
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Cicilan per bulan:</span>
                            <span className="font-medium">{formatCurrency(loanCalculation.monthlyPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total pembayaran:</span>
                            <span className="font-medium">{formatCurrency(loanCalculation.totalPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total bunga:</span>
                            <span className="font-medium text-red-600">{formatCurrency(loanCalculation.totalInterest)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="debt-description">Keterangan</Label>
                  <Textarea
                    id="debt-description"
                    placeholder="Masukkan keterangan transaksi"
                    value={debtForm.description}
                    onChange={(e) => setDebtForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                {debtForm.amount && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Preview Transaksi:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Piutang saat ini:</span>
                        <span className="font-medium">{formatCurrency(user.debt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          {debtForm.type === 'add' ? 'Tambah pinjaman:' : 'Bayar pinjaman:'}
                        </span>
                        <span className={`font-medium ${debtForm.type === 'add' ? 'text-red-600' : 'text-green-600'}`}>
                          {debtForm.type === 'add' ? '+' : '-'}{formatCurrency(parseFloat(debtForm.amount) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="font-medium">Total piutang baru:</span>
                        <span className="font-bold">
                          {formatCurrency(
                            debtForm.type === 'add' 
                              ? user.debt + (parseFloat(debtForm.amount) || 0)
                              : user.debt - (parseFloat(debtForm.amount) || 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Transaksi Piutang
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditFinancial;

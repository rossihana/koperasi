
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
import { useMember } from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';

const EditFinancial = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch member data from API
  const { data: memberResponse, isLoading, error } = useMember(id || '');
  const member = memberResponse?.data || memberResponse;

  const [savingsForm, setSavingsForm] = useState({
    type: 'add',
    category: '',
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

  const savingsCategories = [
    { value: 'pokok', label: 'Simpanan Pokok' },
    { value: 'wajib', label: 'Simpanan Wajib' },
    { value: 'sukarela', label: 'Simpanan Sukarela' },
    { value: 'hari-raya', label: 'Simpanan Hari Raya' }
  ];

  // Ganti formatCurrency agar support string/number
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(numAmount);
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

  const handleSavingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!savingsForm.amount || !savingsForm.description || !savingsForm.category) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap isi semua field yang diperlukan termasuk kategori simpanan",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(savingsForm.amount);
    let newSavings = member.simpanan?.totalSimpanan || 0;
    if (savingsForm.type === 'add') {
      newSavings = (member.simpanan?.totalSimpanan || 0) + amount;
    } else if (savingsForm.type === 'subtract') {
      newSavings = (member.simpanan?.totalSimpanan || 0) - amount;
    } else if (savingsForm.type === 'correction') {
      newSavings = amount; // Koreksi: saldo akhir yang diinginkan
    }

    if (newSavings < 0) {
      toast({
        title: "Saldo tidak mencukupi",
        description: "Jumlah penarikan melebihi saldo simpanan",
        variant: "destructive",
      });
      return;
    }

    const categoryLabel = savingsCategories.find(cat => cat.value === savingsForm.category)?.label;

    // Simulate API call
    let desc = '';
    if (savingsForm.type === 'add') {
      desc = `Menambah ${categoryLabel} sebesar ${formatCurrency(amount)}`;
    } else if (savingsForm.type === 'subtract') {
      desc = `Mengurangi ${categoryLabel} sebesar ${formatCurrency(amount)}`;
    } else if (savingsForm.type === 'correction') {
      desc = `Mengoreksi saldo ${categoryLabel} menjadi ${formatCurrency(amount)}`;
    }
    toast({
      title: "Simpanan berhasil diupdate",
      description: desc,
    });

    // Reset form
    setSavingsForm({
      type: 'add',
      category: '',
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
      ? (member.summary?.totalActivePiutangAmount || 0) + amount 
      : (member.summary?.totalActivePiutangAmount || 0) - amount;

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Data Keuangan</h1>
        <p className="text-gray-600 mb-6">Kelola simpanan dan piutang anggota</p>
        <Card className="mb-8">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{member.nama}</h2>
              <div className="flex flex-wrap gap-2 mb-1">
                <Badge variant="outline">NRP: {member.nrp}</Badge>
                <Badge variant="outline">{member.role === 'admin' ? 'Admin' : 'Anggota'}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-700">
                <Wallet className="w-5 h-5 mr-2" />
                Saldo Simpanan Saat Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600 mb-2">
                {formatCurrency(member.simpanan?.totalSimpanan || 0)}
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
              <p className="text-3xl font-bold text-red-600 mb-2">
                {formatCurrency(member.summary?.totalActivePiutangAmount || 0)}
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
                    <Label htmlFor="savings-type">Tipe</Label>
                    <Select 
                      value={savingsForm.type} 
                      onValueChange={(value) => setSavingsForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">
                          <div className="flex items-center">
                            <Plus className="w-4 h-4 mr-2 text-green-600" />
                            Setoran
                          </div>
                        </SelectItem>
                        <SelectItem value="subtract">
                          <div className="flex items-center">
                            <Minus className="w-4 h-4 mr-2 text-red-600" />
                            Penarikan
                          </div>
                        </SelectItem>
                        <SelectItem value="correction">
                          <div className="flex items-center">
                            <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                            Koreksi
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="savings-category">Kategori Simpanan</Label>
                    <Select 
                      value={savingsForm.category} 
                      onValueChange={(value) => setSavingsForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori simpanan" />
                      </SelectTrigger>
                      <SelectContent>
                        {savingsCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
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

                  {savingsForm.amount && savingsForm.category && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Preview Transaksi:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Kategori:</span>
                          <span className="font-medium">
                            {savingsCategories.find(cat => cat.value === savingsForm.category)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saldo saat ini:</span>
                          <span className="font-medium">{formatCurrency(member.simpanan?.totalSimpanan || 0)}</span>
                        </div>
                        {savingsForm.type === 'correction' ? (
                          <>
                            <div className="flex justify-between">
                              <span>Koreksi:</span>
                              <span className="font-medium text-blue-600">{formatCurrency(parseFloat(savingsForm.amount) || 0)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-1">
                              <span className="font-medium">Saldo baru:</span>
                              <span className="font-bold">{formatCurrency(parseFloat(savingsForm.amount) || 0)}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span>{savingsForm.type === 'add' ? 'Tambah:' : 'Kurangi:'}</span>
                              <span className={`font-medium ${savingsForm.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                                {savingsForm.type === 'add' ? '+' : '-'}{formatCurrency(parseFloat(savingsForm.amount) || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between border-t pt-1">
                              <span className="font-medium">Saldo baru:</span>
                              <span className="font-bold">
                                {formatCurrency(
                                  savingsForm.type === 'add' 
                                    ? (member.simpanan?.totalSimpanan || 0) + (parseFloat(savingsForm.amount) || 0)
                                    : (member.simpanan?.totalSimpanan || 0) - (parseFloat(savingsForm.amount) || 0)
                                )}
                              </span>
                            </div>
                          </>
                        )}
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
                          <span className="font-medium">{formatCurrency(member.summary?.totalActivePiutangAmount || 0)}</span>
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
                                ? (member.summary?.totalActivePiutangAmount || 0) + (parseFloat(debtForm.amount) || 0)
                                : (member.summary?.totalActivePiutangAmount || 0) - (parseFloat(debtForm.amount) || 0)
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
    </div>
  );
};

export default EditFinancial;

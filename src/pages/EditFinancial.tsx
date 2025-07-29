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
import { useMember, useUpdateSimpanan, useUpdatePiutang, useCreatePiutang } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const EditFinancial = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch member data from API
  const { data: memberResponse, isLoading, error } = useMember(id || '');
  const member = memberResponse?.data || memberResponse;

  // Tambahkan hooks untuk update simpanan dan piutang
  const updateSimpanan = useUpdateSimpanan();
  const updatePiutang = useUpdatePiutang();
  const createPiutang = useCreatePiutang();
  const queryClient = useQueryClient();

  type SavingsType = 'add' | 'subtract' | 'correction';

  const [savingsForm, setSavingsForm] = useState({
    type: 'add' as SavingsType,
    category: '',
    amount: '',
    description: ''
  });

  // Type definitions
  type DebtFormType = 'payment' | 'pelunasan';

  const [debtForm, setDebtForm] = useState({
    type: 'payment' as DebtFormType,
    amount: '',
    description: '',
    interestRate: '2.5',
    duration: '12'
  });

  const [showAddPiutang, setShowAddPiutang] = useState(false);
  const [addPiutangForm, setAddPiutangForm] = useState({
    jenis: '',
    besarPinjaman: '',
    totalPiutang: '',
    biayaAngsuran: '',
    totalAngsuran: '',
    description: ''
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

  const handleSavingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!savingsForm.amount || !savingsForm.description || !savingsForm.category) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap isi semua field yang diperlukan termasuk kategori simpanan",
        variant: "destructive",
      });
      return;
    }

    try {
      let requestType: 'setoran' | 'penarikan' | 'koreksi';
      const amount = parseFloat(savingsForm.amount);

      switch (savingsForm.type) {
        case 'add':
          requestType = 'setoran';
          break;
        case 'subtract':
          requestType = 'penarikan';
          break;
        case 'correction':
          requestType = 'koreksi';
          break;
      }

      const payload = {
        type: requestType,
        category: savingsForm.category as 'wajib' | 'sukarela' | 'pokok' | 'hari-raya',
        amount: amount,
        description: savingsForm.description,
      };

      const response = await updateSimpanan.mutateAsync({ memberId: id, data: payload });
      toast({
        title: response?.message || 'Transaksi berhasil',
      });
      setSavingsForm({ type: 'add', category: '', amount: '', description: '' });
    } catch (err) {
      toast({
        title: 'Gagal update simpanan',
        description: err instanceof Error ? err.message : 'Terjadi kesalahan',
        variant: 'destructive',
      });
    }
  };

  const handleDebtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Different validation based on transaction type
    if (debtForm.type === 'pelunasan') {
      if (!debtForm.description) {
        toast({
          title: "Data tidak lengkap",
          description: "Harap isi deskripsi pelunasan",
          variant: "destructive",
        });
        return;
      }
    } else if (!debtForm.amount || !debtForm.description) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the active piutang ID
      const activePiutang = member.piutang?.find(p => !p.completedAt);
      const piutangId = activePiutang?.id;
      
      if (!piutangId) {
        toast({
          title: 'Tidak ada piutang aktif',
          description: 'Tidak ditemukan piutang yang bisa diupdate',
          variant: 'destructive',
        });
        return;
      }

      // Prepare the request payload
      const payload: {
        type: 'payment' | 'pelunasan';
        description: string;
        amount?: number;
      } = {
        type: debtForm.type,
        description: debtForm.description
      };

      // Only include amount for payment type
      if (debtForm.type === 'payment' && debtForm.amount) {
        payload.amount = parseFloat(debtForm.amount);
      }

      console.log('Sending request with payload:', payload);

      const response = await updatePiutang.mutateAsync({
        memberId: id,
        piutangId,
        data: payload,
      });
      await queryClient.invalidateQueries({ queryKey: ['member', id] });
      toast({
        title: 'Transaksi piutang berhasil',
      });
      setDebtForm({ type: 'payment', amount: '', description: '', interestRate: '2.5', duration: '12' });
    } catch (err) {
      toast({
        title: 'Gagal update piutang',
        description: err instanceof Error ? err.message : 'Terjadi kesalahan',
        variant: 'destructive',
      });
    }
  };

  const handleAddPiutang = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addPiutangForm.jenis || !addPiutangForm.besarPinjaman || !addPiutangForm.totalPiutang || !addPiutangForm.biayaAngsuran || !addPiutangForm.totalAngsuran || !addPiutangForm.description) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Harap isi semua field tambah piutang',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPiutang.mutateAsync({
        memberId: id,
        data: {
          jenis: addPiutangForm.jenis,
          besarPinjaman: parseFloat(addPiutangForm.besarPinjaman),
          totalPiutang: parseFloat(addPiutangForm.totalPiutang),
          biayaAngsuran: parseFloat(addPiutangForm.biayaAngsuran),
          totalAngsuran: parseInt(addPiutangForm.totalAngsuran),
          description: addPiutangForm.description,
        },
      });
      toast({ title: 'Tambah piutang berhasil' });
      setAddPiutangForm({ jenis: '', besarPinjaman: '', totalPiutang: '', biayaAngsuran: '', totalAngsuran: '', description: '' });
      setShowAddPiutang(false);
      await queryClient.invalidateQueries({ queryKey: ['member', id] });
    } catch (err) {
      toast({
        title: 'Gagal tambah piutang',
        description: err instanceof Error ? err.message : 'Terjadi kesalahan',
        variant: 'destructive',
      });
    }
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
                    <Label htmlFor="savings-type">Jenis Transaksi</Label>
                    <Select 
                      value={savingsForm.type} 
                      onValueChange={(value: SavingsType) => setSavingsForm(prev => ({ ...prev, type: value }))}
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
                        <>
                          <div className="flex justify-between">
                            <span>
                              {savingsForm.type === 'add' 
                                ? 'Tambah:' 
                                : savingsForm.type === 'subtract'
                                ? 'Kurangi:'
                                : 'Koreksi:'}
                            </span>
                            <span className={`font-medium ${
                              savingsForm.type === 'add' 
                                ? 'text-green-600' 
                                : savingsForm.type === 'subtract'
                                ? 'text-red-600'
                                : parseFloat(savingsForm.amount || '0') >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {savingsForm.type === 'correction' 
                                ? formatCurrency(parseFloat(savingsForm.amount || '0'))
                                : savingsForm.type === 'add'
                                ? '+' + formatCurrency(Math.abs(parseFloat(savingsForm.amount || '0')))
                                : '-' + formatCurrency(Math.abs(parseFloat(savingsForm.amount || '0')))}
                            </span>
                          </div>
                                                    <div className="flex justify-between border-t pt-1">
                            <span className="font-medium">Saldo baru:</span>
                            <span className="font-bold">
                              {(() => {
                                // Pastikan nilai saldo saat ini adalah number
                                const currentBalance = Number(member.simpanan?.totalSimpanan || 0);
                                // Pastikan nilai amount adalah number
                                const amount = Number(savingsForm.amount || 0);
                                
                                let newBalance;
                                switch (savingsForm.type) {
                                  case 'correction':
                                    newBalance = currentBalance + amount;
                                    break;
                                  case 'add':
                                    newBalance = currentBalance + Math.abs(amount);
                                    break;
                                  case 'subtract':
                                    newBalance = currentBalance - Math.abs(amount);
                                    break;
                                  default:
                                    newBalance = currentBalance;
                                }
                                
                                return formatCurrency(newBalance);
                              })()}
                            </span>
                          </div>
                        </>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={updateSimpanan.isPending}>
                    {updateSimpanan.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
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
                {/* Form Tambah Piutang */}
                <div className="mb-6">
                  {showAddPiutang ? (
                    <form onSubmit={handleAddPiutang} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="jenis">Jenis</Label>
                          <Input id="jenis" value={addPiutangForm.jenis} onChange={e => setAddPiutangForm(f => ({ ...f, jenis: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="besarPinjaman">Besar Pinjaman</Label>
                          <Input id="besarPinjaman" type="number" value={addPiutangForm.besarPinjaman} onChange={e => setAddPiutangForm(f => ({ ...f, besarPinjaman: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="totalPiutang">Total Piutang</Label>
                          <Input id="totalPiutang" type="number" value={addPiutangForm.totalPiutang} onChange={e => setAddPiutangForm(f => ({ ...f, totalPiutang: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="biayaAngsuran">Biaya Angsuran</Label>
                          <Input id="biayaAngsuran" type="number" value={addPiutangForm.biayaAngsuran} onChange={e => setAddPiutangForm(f => ({ ...f, biayaAngsuran: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="totalAngsuran">Total Angsuran</Label>
                          <Input id="totalAngsuran" type="number" value={addPiutangForm.totalAngsuran} onChange={e => setAddPiutangForm(f => ({ ...f, totalAngsuran: e.target.value }))} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Keterangan</Label>
                        <Textarea id="description" value={addPiutangForm.description} onChange={e => setAddPiutangForm(f => ({ ...f, description: e.target.value }))} required />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setShowAddPiutang(false)}>Batal</Button>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={createPiutang.isPending}>
                          {createPiutang.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tambah Piutang'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button variant="outline" className="mb-4" onClick={() => setShowAddPiutang(true)}>
                      <Plus className="w-4 h-4 mr-2" />Tambah Piutang
                    </Button>
                  )}
                </div>
                <form onSubmit={handleDebtSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="debt-type">Jenis Transaksi</Label>
                    <Select 
                      value={debtForm.type} 
                      onValueChange={(value: DebtFormType) => setDebtForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis transaksi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">
                          <div className="flex items-center">
                            <Minus className="w-4 h-4 mr-2 text-green-600" />
                            Bayar Angsuran
                          </div>
                        </SelectItem>
                        <SelectItem value="pelunasan">
                          <div className="flex items-center">
                            <Minus className="w-4 h-4 mr-2 text-blue-600" />
                            Pelunasan
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Input jumlah hanya untuk payment */}
                  {debtForm.type !== 'pelunasan' && (
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
                            Bayar pinjaman:
                          </span>
                          <span className="font-medium text-green-600">
                            -{formatCurrency(parseFloat(debtForm.amount) || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-1">
                          <span className="font-medium">Total piutang baru:</span>
                          <span className="font-bold">
                            {formatCurrency((member.summary?.totalActivePiutangAmount || 0) - (parseFloat(debtForm.amount) || 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={updatePiutang.isPending || createPiutang.isPending}
                  >
                    {(updatePiutang.isPending || createPiutang.isPending) ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Transaksi Piutang
                      </>
                    )}
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

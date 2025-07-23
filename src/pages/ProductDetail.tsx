
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';
import { useUserProduct } from '@/hooks/useApi';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Ambil data produk dari API
  const { data: productResponse, isLoading, error } = useUserProduct(id || '');
  const product = productResponse?.data;

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(numAmount);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center h-96">
        <span className="text-gray-500">Memuat detail produk...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center h-96">
        <span className="text-red-600">Gagal memuat detail produk</span>
      </div>
    );
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${quantity}x ${product.name} berhasil ditambahkan`,
    });
  };

  const handleBuyNow = () => {
    toast({
      title: "Menuju pembayaran",
      description: "Anda akan diarahkan ke halaman pembayaran",
    });
  };

  // Mapping kategoriId ke nama kategori
  const kategoriMap: Record<string, string> = {
    makanan: 'Makanan & Minuman',
    elektronik: 'Elektronik',
    'rumah-tangga': 'Rumah Tangga',
    pakaian: 'Pakaian',
    kesehatan: 'Kesehatan',
  };
  const kategoriNama = product.kategori?.namaKategori || kategoriMap[product.kategoriId] || 'Tanpa Kategori';

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/shop"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Toko
        </Link>
      </div>

      <div className="flex justify-center items-center min-h-[70vh] bg-gradient-to-br from-green-50 to-emerald-50 py-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          <div className="w-full flex justify-center mb-6">
            <img
              src={product.fotoProduk || '/placeholder.svg'}
              alt={product.namaProduk}
              className="w-64 h-64 object-contain rounded-xl border border-gray-100 shadow-sm bg-gray-50"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">{product.namaProduk}</h1>
          {/* Kategori Produk */}
          <div className="mb-2">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
              {kategoriNama}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2 text-center">{formatCurrency(product.harga)}</div>
          {product.stok !== undefined && (
            <div className="text-base font-medium text-gray-600 mb-4">Stok: <span className="font-semibold text-gray-800">{product.stok}</span></div>
          )}
          <div className="w-full mt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Deskripsi Produk</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.deskripsi}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

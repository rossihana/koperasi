
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

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app, fetch based on id
  const product = {
    id: id,
    name: 'Beras Premium 5kg',
    price: 65000,
    originalPrice: 70000,
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
      'https://images.unsplash.com/photo-1571942676516-bcab84649e44'
    ],
    category: 'Makanan & Minuman',
    rating: 4.8,
    reviews: 156,
    stock: 25,
    discount: 7,
    description: `Beras premium berkualitas tinggi dengan butiran yang pulen dan aroma yang harum. 
    Dipetik dari sawah terbaik dan diproses dengan teknologi modern untuk menjaga kualitas dan kebersihan.
    
    Spesifikasi:
    • Berat: 5kg
    • Jenis: Beras putih premium
    • Asal: Jawa Timur
    • Kemasan: Plastik vakum
    • Masa simpan: 12 bulan
    
    Keunggulan:
    • Butiran pulen dan tidak mudah hancur
    • Aroma harum alami
    • Bebas dari kutu dan hama
    • Telah tersertifikasi BPOM
    • Dikemas dengan teknologi vakum untuk menjaga kesegaran`,
    features: [
      'Butiran pulen dan tidak mudah hancur',
      'Aroma harum alami',
      'Bebas dari kutu dan hama',
      'Telah tersertifikasi BPOM',
      'Dikemas dengan teknologi vakum'
    ],
    seller: {
      name: 'Koperasi Tani Makmur',
      rating: 4.9,
      location: 'Jakarta'
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                -{product.discount}%
              </Badge>
            )}
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-green-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{product.rating}</span>
                <span className="ml-1 text-gray-500">({product.reviews} ulasan)</span>
              </div>
              <span className="text-green-600 font-medium">Stok: {product.stock}</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-green-600">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Hemat {formatCurrency(product.originalPrice - product.price)} ({product.discount}%)
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Jumlah</label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500 ml-4">
                Total: {formatCurrency(product.price * quantity)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="h-12 border-green-600 text-green-600 hover:bg-green-50"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Tambah ke Keranjang
            </Button>
            <Button
              onClick={handleBuyNow}
              className="h-12 bg-green-600 hover:bg-green-700"
            >
              Beli Sekarang
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4 mr-1" />
              Wishlist
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Bagikan
            </Button>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Informasi Penjual</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.seller.name}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {product.seller.rating} • {product.seller.location}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Kunjungi Toko
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Description */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Deskripsi Produk</h2>
              <div className="prose max-w-none">
                {product.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features & Benefits */}
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Keunggulan Produk</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Informasi Pengiriman</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Truck className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm">Gratis ongkir min. Rp 100.000</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm">Garansi kualitas produk</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm">Tukar/retur dalam 7 hari</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

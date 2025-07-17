
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Star, ShoppingCart } from 'lucide-react';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'makanan', label: 'Makanan & Minuman' },
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'rumah-tangga', label: 'Rumah Tangga' },
    { value: 'pakaian', label: 'Pakaian' },
    { value: 'kesehatan', label: 'Kesehatan' }
  ];

  const products = [
    {
      id: '1',
      name: 'Beras Premium 5kg',
      price: 65000,
      originalPrice: 70000,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      category: 'makanan',
      rating: 4.8,
      reviews: 156,
      stock: 25,
      discount: 7
    },
    {
      id: '2',
      name: 'Minyak Goreng 2L',
      price: 28000,
      originalPrice: 32000,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
      category: 'makanan',
      rating: 4.5,
      reviews: 89,
      stock: 15,
      discount: 12
    },
    {
      id: '3',
      name: 'Rice Cooker Digital',
      price: 450000,
      originalPrice: 520000,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      category: 'elektronik',
      rating: 4.7,
      reviews: 234,
      stock: 8,
      discount: 13
    },
    {
      id: '4',
      name: 'Deterjen Cair 1L',
      price: 15000,
      originalPrice: 18000,
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473',
      category: 'rumah-tangga',
      rating: 4.6,
      reviews: 67,
      stock: 30,
      discount: 17
    },
    {
      id: '5',
      name: 'Kemeja Batik Pria',
      price: 125000,
      originalPrice: 150000,
      image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176',
      category: 'pakaian',
      rating: 4.4,
      reviews: 45,
      stock: 12,
      discount: 17
    },
    {
      id: '6',
      name: 'Vitamin C 1000mg',
      price: 45000,
      originalPrice: 55000,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
      category: 'kesehatan',
      rating: 4.9,
      reviews: 123,
      stock: 20,
      discount: 18
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Toko Koperasi</h1>
        <p className="text-gray-600">Temukan produk berkualitas dengan harga terjangkau</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-64">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {product.discount > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  -{product.discount}%
                </Badge>
              )}
              <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                Stok: {product.stock}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {product.rating} ({product.reviews})
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/product/${product.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Detail
                  </Button>
                </Link>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Produk tidak ditemukan</h3>
          <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter kategori</p>
        </div>
      )}
    </div>
  );
};

export default Shop;


import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  stock?: number;
}

const Shop = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Beras Premium 5kg',
      price: 65000,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      category: 'makanan',
      description: 'Beras berkualitas tinggi',
      stock: 50
    },
    {
      id: '2',
      name: 'Minyak Goreng 2L',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5',
      category: 'makanan',
      description: 'Minyak goreng murni',
      stock: 30
    },
    {
      id: '3',
      name: 'Rice Cooker Digital',
      price: 450000,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c',
      category: 'elektronik',
      description: 'Rice cooker canggih',
      stock: 15
    },
    {
      id: '4',
      name: 'Deterjen Cair 1L',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473',
      category: 'rumah-tangga',
      description: 'Deterjen berkualitas',
      stock: 25
    },
    {
      id: '5',
      name: 'Kemeja Batik Pria',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176',
      category: 'pakaian',
      description: 'Kemeja batik premium',
      stock: 20
    },
    {
      id: '6',
      name: 'Vitamin C 1000mg',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
      category: 'kesehatan',
      description: 'Suplemen vitamin C',
      stock: 40
    }
  ]);

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'makanan', label: 'Makanan & Minuman' },
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'rumah-tangga', label: 'Rumah Tangga' },
    { value: 'pakaian', label: 'Pakaian' },
    { value: 'kesehatan', label: 'Kesehatan' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
    setShowProductForm(false);
    toast({
      title: "Produk berhasil ditambahkan",
      description: `${productData.name} telah ditambahkan ke toko`,
    });
  };

  const handleEditProduct = (productData: Omit<Product, 'id'>) => {
    if (!editingProduct) return;
    
    setProducts(prev => 
      prev.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id }
          : p
      )
    );
    setEditingProduct(null);
    setShowProductForm(false);
    toast({
      title: "Produk berhasil diupdate",
      description: `${productData.name} telah diperbarui`,
    });
  };

  const handleDeleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteProductId(null);
    toast({
      title: "Produk berhasil dihapus",
      description: `${product?.name} telah dihapus dari toko`,
    });
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const closeForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Toko Koperasi</h1>
          <p className="text-gray-600">Temukan produk berkualitas dengan harga terjangkau</p>
        </div>
        {user?.isAdmin && (
          <Button onClick={openAddForm} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
        )}
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
          <ProductCard
            key={product.id}
            product={product}
            isAdmin={user?.isAdmin || false}
            onEdit={openEditForm}
            onDelete={setDeleteProductId}
          />
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

      {/* Product Form Dialog */}
      <Dialog open={showProductForm} onOpenChange={closeForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            onCancel={closeForm}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProductId && handleDeleteProduct(deleteProductId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Shop;

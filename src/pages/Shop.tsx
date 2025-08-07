
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
import { Search, Filter, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';
import { useUserProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useApi';
import { Product } from '@/lib/api';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  // API hooks - menggunakan user products untuk tampilan dengan filter kategori
  const { data: productsResponse, isLoading, error } = useUserProducts(currentPage, selectedCategory);
  
  // Extract products array from response with safety check
  const products = productsResponse?.data?.products || [];
    
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'makanan', label: 'Makanan & Minuman' },
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'rumah-tangga', label: 'Rumah Tangga' },
    { value: 'pakaian', label: 'Pakaian' },
    { value: 'kesehatan', label: 'Kesehatan' }
  ];

  // Filter products by search term only since category filtering is handled by the API
  const filteredProducts = products.filter((product: Product) => {
    return product.namaProduk.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Reset ke halaman 1 jika filter/search berubah
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleAddProduct = async (productData: { namaProduk: string; harga: number; deskripsi: string; namaKategori: string; foto: File }) => {
    try {
      await createProductMutation.mutateAsync(productData);
      setShowProductForm(false);
      toast({
        title: "Produk berhasil ditambahkan",
        description: `${productData.namaProduk} telah ditambahkan ke toko`,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Gagal menambahkan produk",
        description: "Terjadi kesalahan saat menambahkan produk",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (productData: { name: string; price: number; description: string; category: string; imageFile?: File }) => {
    if (!editingProduct) return;
    try {
      const formData = new FormData();
      formData.append('namaProduk', productData.name);
      formData.append('harga', productData.price.toString());
      formData.append('deskripsi', productData.description || '');
      formData.append('namaKategori', productData.category);
      if (productData.imageFile instanceof File && productData.imageFile.size > 0) {
        formData.append('foto', productData.imageFile);
      }
      const response = await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        data: formData
      });
      setEditingProduct(null);
      setShowProductForm(false);
      toast({
        title: response?.message || "Produk berhasil diupdate",
        description: response?.data?.namaProduk
          ? `${response.data.namaProduk} telah diperbarui`
          : undefined,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Gagal mengupdate produk",
        description: "Terjadi kesalahan saat mengupdate produk",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      setDeleteProductId(null);
      toast({
        title: "Produk berhasil dihapus",
        description: "Produk telah dihapus dari toko",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Gagal menghapus produk",
        description: "Terjadi kesalahan saat menghapus produk",
        variant: "destructive",
      });
    }
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

  const navigate = useNavigate();

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Memuat produk...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Gagal memuat produk</p>
            <Button onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Toko Koperasi</h1>
          <p className="text-gray-600">Temukan berbagai produk berkualitas untuk anggota koperasi</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={openAddForm} className="flex items-center gap-2 w-full md:w-auto">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
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
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Tidak ada produk yang ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.namaProduk,
                price: parseInt(product.harga),
                image: product.fotoProduk || '/placeholder.svg',
                category: product.kategori?.namaKategori || ''
              }}
              isAdmin={user?.role === 'admin'}
              onEdit={user?.role === 'admin' ? () => openEditForm(product) : undefined}
              onDelete={user?.role === 'admin' ? () => setDeleteProductId(product.id) : undefined}
              onClick={(id) => navigate(`/product/${id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {productsResponse?.data?.pagination && productsResponse.data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Sebelumnya
          </Button>
          <span className="flex items-center px-4">
            Halaman {currentPage} dari {productsResponse.data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, productsResponse.data.pagination.totalPages))}
            disabled={currentPage === productsResponse.data.pagination.totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct ? {
              id: editingProduct.id,
              name: editingProduct.namaProduk,
              price: editingProduct.harga,
              image: editingProduct.fotoProduk || '/placeholder.svg',
              category: editingProduct.namaKategori,
              description: editingProduct.deskripsi
            } : undefined}
            onSubmit={(productData) => {
              if (editingProduct) {
                handleEditProduct({
                  ...productData,
                  description: productData.description || ''
                });
              } else {
                handleAddProduct({
                  namaProduk: productData.name,
                  harga: productData.price,
                  deskripsi: productData.description || '',
                  namaKategori: productData.category,
                  foto: productData.imageFile
                });
              }
            }}
            onCancel={closeForm}
            isLoading={createProductMutation.isPending || updateProductMutation.isPending}
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
              {deleteProductMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Shop;

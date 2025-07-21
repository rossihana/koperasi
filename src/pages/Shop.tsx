
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

const Shop = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  // API hooks - menggunakan user products untuk tampilan
  const { data: productsResponse, isLoading, error } = useUserProducts(currentPage);
  
  // Extract products array from response with safety check
  const products = Array.isArray(productsResponse?.data) 
    ? productsResponse.data 
    : productsResponse?.data?.products || productsResponse?.data || [];
    
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'Makanan', label: 'Makanan & Minuman' },
    { value: 'Elektronik', label: 'Elektronik' },
    { value: 'Rumah Tangga', label: 'Rumah Tangga' },
    { value: 'Pakaian', label: 'Pakaian' },
    { value: 'Kesehatan', label: 'Kesehatan' }
  ];

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.namaProduk.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.namaKategori === selectedCategory;
    return matchesSearch && matchesCategory;
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

  const handleEditProduct = async (productData: { namaProduk: string; harga: number; deskripsi: string; namaKategori: string; foto?: File }) => {
    if (!editingProduct) return;
    try {
      const formData = new FormData();
      formData.append('namaProduk', productData.namaProduk);
      formData.append('harga', productData.harga.toString());
      formData.append('deskripsi', productData.deskripsi || '');
      formData.append('namaKategori', productData.namaKategori);
      if (productData.foto instanceof File && productData.foto.size > 0) {
        formData.append('foto', productData.foto);
      }
      console.log('DEBUG: PUT /admin/products/:id', editingProduct.id, formData);
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Toko Koperasi</h1>
          <p className="text-gray-600">Temukan berbagai produk berkualitas untuk anggota koperasi</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={openAddForm} className="flex items-center gap-2">
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
                price: product.harga,
                image: product.foto,
                category: product.namaKategori
              }}
              isAdmin={user?.role === 'admin'}
              onEdit={user?.role === 'admin' ? () => openEditForm(product) : undefined}
              onDelete={user?.role === 'admin' ? () => setDeleteProductId(product.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {productsResponse && productsResponse.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Sebelumnya
          </Button>
          <span className="flex items-center px-4">
            Halaman {currentPage} dari {productsResponse.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, productsResponse.totalPages))}
            disabled={currentPage === productsResponse.totalPages}
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
              image: editingProduct.foto,
              category: editingProduct.namaKategori,
              description: editingProduct.deskripsi,
              stock: 0
            } : undefined}
            onSubmit={(productData) => {
              const formData: any = {
                namaProduk: productData.name,
                harga: productData.price,
                deskripsi: productData.description || '',
                namaKategori: productData.category
              };
              if (productData.imageFile) {
                formData.foto = productData.imageFile;
              }
              
              if (editingProduct) {
                console.log('DEBUG: update product', formData, editingProduct.id);
                handleEditProduct(formData);
              } else {
                console.log('DEBUG: add product', formData);
                handleAddProduct(formData);
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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  stock?: number;
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id'> & { imageFile?: File }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

import { useState, useEffect } from 'react';
// ... other imports

const ProductForm = ({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price.toString() || '',
    category: product?.category || '',
    description: product?.description || ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        description: product.description || ''
      });
      setImagePreview(product.image || '');
      console.log('Image preview set to:', product.image || ''); // Add this line
      setImageFile(null); // Clear any previously selected file when editing a new product
    } else {
      // Reset form for new product creation
      setFormData({
        name: '',
        price: '',
        category: '',
        description: ''
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [product]);

  const categories = [
    { value: 'makanan', label: 'Makanan & Minuman' },
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'rumah-tangga', label: 'Rumah Tangga' },
    { value: 'pakaian', label: 'Pakaian' },
    { value: 'kesehatan', label: 'Kesehatan' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon isi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    const submitData: Omit<Product, 'id'> & { imageFile?: File } = {
      name: formData.name,
      price: parseInt(formData.price),
      category: formData.category,
      description: formData.description,
      image: imagePreview || ''
    };
    if (imageFile) {
      submitData.imageFile = imageFile;
    }
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Produk</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Masukkan nama produk"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Harga (Rp)</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          placeholder="0"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Kategori</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        >
          <option value="">Pilih kategori</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Gambar Produk</Label>
        
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="imageFile"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              Klik untuk upload gambar atau drag & drop
            </span>
            <span className="text-xs text-gray-400 mt-1">
              PNG, JPG, GIF hingga 10MB
            </span>
          </label>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                console.error('Error loading image:', e.currentTarget.src);
                e.currentTarget.src = '/placeholder.svg'; // Fallback to a placeholder image
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={removeImage}
              className="absolute top-2 right-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}


      </div>

      {/* Hapus field stok */}

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Deskripsi produk..."
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <span className="mr-2"><svg className="animate-spin h-4 w-4 text-white inline" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg></span>}
          {product ? 'Update Produk' : 'Tambah Produk'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;

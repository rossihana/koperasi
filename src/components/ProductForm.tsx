
import { useState } from 'react';
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

const ProductForm = ({ product, onSubmit, onCancel, isLoading }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price.toString() || '',
    image: product?.image || '',
    category: product?.category || '',
    description: product?.description || ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image || '');

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
      return;
    }

    const submitData: any = {
      name: formData.name,
      price: parseInt(formData.price),
      image: '', // not used for upload
      category: formData.category,
      description: formData.description
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
        <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
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

        {/* URL Input sebagai alternatif */}
        <div className="mt-4">
          <Label htmlFor="image">Atau masukkan URL Gambar</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, image: e.target.value }));
              setImagePreview(e.target.value);
            }}
            placeholder="https://images.unsplash.com/..."
          />
        </div>
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

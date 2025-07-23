
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
}

const ProductCard = ({ product, isAdmin, onEdit, onDelete, onClick }: ProductCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => onClick?.(product.id)}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(product);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(product.id);
              }}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="text-lg font-bold text-green-600">
          {formatCurrency(product.price)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

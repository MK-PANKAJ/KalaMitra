import React from 'react';
import { MapPin, Award, IndianRupee, User } from 'lucide-react';
import { Product } from '../types';
import { LazyImage } from './LazyImage';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  showActions?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, showActions = false }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <LazyImage
          src={product.photos[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.hasQualityBadge && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-lg">
            <Award size={14} />
            QC Verified
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-deepblue-800 mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <User size={14} />
          <span>{product.artisanName}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-terracotta-600 mb-3">
          <MapPin size={14} />
          <span>{product.region}</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3 min-h-[40px]">
          {product.story}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center gap-1 text-2xl font-bold text-terracotta-600">
            <IndianRupee size={20} />
            <span>{product.price.toLocaleString('en-IN')}</span>
          </div>
          {showActions && (
            <button className="px-4 py-2 bg-terracotta-500 text-white rounded-lg hover:bg-terracotta-600 transition-colors text-sm font-semibold">
              View Details
            </button>
          )}
        </div>

        {product.materials && product.materials.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {product.materials.slice(0, 3).map((material, idx) => (
              <span
                key={idx}
                className="text-xs bg-saffron-100 text-saffron-800 px-2 py-1 rounded-full"
              >
                {material}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShoppingCart, Check, Eye, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { useMediStockStore } from '../../data/store';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  const { addToCart } = useMediStockStore();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenModal(product)}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer hover:border-teal-300"
    >
      <div className="p-4 relative">
        {/* Product Image */}
        <div className="w-full h-44 rounded-xl bg-slate-50 overflow-hidden relative border border-slate-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {product.isPrescriptionRequired && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold tracking-wide uppercase border border-rose-200 shadow-2xs">
              Rx
            </span>
          )}

          {product.stock <= product.minStockThreshold && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200 shadow-2xs">
              Low Stock: {product.stock}
            </span>
          )}

          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/95 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </span>
          </div>
        </div>

        {/* Title and Category */}
        <div className="mt-3.5 space-y-1">
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">
            {product.category}
          </span>
          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-teal-700 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-400">
            {product.unit}
          </p>
        </div>
      </div>

      {/* Price & Add to Cart matching Project.png */}
      <div className="p-4 pt-0 mt-auto border-t border-slate-100/80 flex items-center justify-between gap-2">
        <div>
          <span className="text-base sm:text-lg font-extrabold text-slate-900">
            ৳ {product.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`px-3.5 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-teal-600/25 active:scale-95'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};


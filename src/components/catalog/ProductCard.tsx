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
      className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer hover:border-teal-300"
    >
      <div className="p-2.5 sm:p-4 relative">
        {/* Product Image */}
        <div className="w-full h-28 sm:h-44 rounded-lg sm:rounded-xl bg-slate-50 overflow-hidden relative border border-slate-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {product.isPrescriptionRequired && (
            <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[9px] sm:text-[10px] font-bold tracking-wide uppercase border border-rose-200 shadow-2xs">
              Rx
            </span>
          )}

          {product.stock <= product.minStockThreshold && (
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 sm:px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[8px] sm:text-[10px] font-bold border border-amber-200 shadow-2xs">
              Low: {product.stock}
            </span>
          )}

          <div className="hidden sm:flex absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
            <span className="bg-white/95 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </span>
          </div>
        </div>

        {/* Title and Category */}
        <div className="mt-2 sm:mt-3.5 space-y-0.5 sm:space-y-1">
          <span className="text-[9px] sm:text-[10px] font-bold text-teal-600 uppercase tracking-wider block truncate">
            {product.category}
          </span>
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-teal-700 transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400 truncate">
            {product.unit}
          </p>
        </div>
      </div>

      {/* Price & Add to Cart matching Project.png */}
      <div className="p-2.5 sm:p-4 pt-1 sm:pt-0 mt-auto border-t border-slate-100/80 flex items-center justify-between gap-1.5 sm:gap-2">
        <div>
          <span className="text-xs sm:text-base font-extrabold text-slate-900">
            ৳ {product.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-[11px] sm:text-xs transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-teal-600/25 active:scale-95'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline sm:inline">Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};


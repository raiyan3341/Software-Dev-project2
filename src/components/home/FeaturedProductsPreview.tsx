import React from 'react';
import { ArrowRight, ShoppingCart, Eye } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { Product } from '../../types';

interface FeaturedProductsPreviewProps {
  onViewAll: () => void;
  onOpenProductModal: (product: Product) => void;
}

export const FeaturedProductsPreview: React.FC<FeaturedProductsPreviewProps> = ({
  onViewAll,
  onOpenProductModal,
}) => {
  const { products, addToCart } = useMediStockStore();
  const featured = products.slice(0, 4);

  return (
    <section className="py-12 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Healthcare Products
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top requested pharmaceuticals and medical equipment in stock
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors group"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-4 relative">
                {/* Product Image */}
                <div 
                  onClick={() => onOpenProductModal(product)}
                  className="w-full h-48 rounded-xl bg-slate-100 overflow-hidden relative cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.isPrescriptionRequired && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold tracking-wide uppercase border border-rose-200">
                      Rx Required
                    </span>
                  )}
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Quick View
                    </span>
                  </div>
                </div>

                {/* Meta & Title */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 
                    onClick={() => onOpenProductModal(product)}
                    className="font-bold text-slate-900 text-base mt-1 line-clamp-1 hover:text-teal-700 cursor-pointer transition-colors"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {product.manufacturer} • {product.unit}
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-0 mt-auto border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">B2B Price</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    ৳ {product.price}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-teal-600/20 transition-all flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


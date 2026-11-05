import React, { useState } from 'react';
import { X, ShoppingCart, ShieldCheck, AlertCircle, Calendar, Hash, Building2, Check, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { useMediStockStore } from '../../data/store';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, activeRole, deleteProduct } = useMediStockStore();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-sm border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isPrescriptionRequired && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Prescription Required
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  {product.category}
                </span>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {product.name}
                </h2>

                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Manufacturer: <span className="font-medium text-slate-700">{product.manufacturer}</span>
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" /> SKU Code:
                    </span>
                    <span className="font-mono font-medium text-slate-800">{product.sku}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Batch Number:</span>
                    <span className="font-mono font-medium text-slate-800">{product.batchNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Expiry Date:
                    </span>
                    <span className="font-semibold text-emerald-700">{product.expiryDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Packaging Unit:</span>
                    <span className="font-medium text-slate-800">{product.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Available Stock:</span>
                    <span className={`font-bold ${product.stock < product.minStockThreshold ? 'text-amber-600' : 'text-slate-800'}`}>
                      {product.stock} units
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs text-slate-400 font-medium">Restock Price</span>
                  <span className="text-3xl font-extrabold text-slate-900">
                    ৳ {product.price}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-sm font-bold text-slate-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                      addedNotice
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-teal-600/25'
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> Add to Order Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Clinical Product Description
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Admin / Owner Actions */}
          {(activeRole === 'admin' || activeRole === 'owner') && (
            <div className="mt-6 pt-4 border-t border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/60 p-4 rounded-2xl border border-rose-200">
              <div>
                <p className="text-xs font-bold text-rose-900">Administrative Product Governance</p>
                <p className="text-[11px] text-rose-600">Completely remove this SKU and medicine from catalog and inventory</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to permanently delete "${product.name}" (SKU: ${product.sku})? This cannot be undone.`)) {
                    deleteProduct(product.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Product</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


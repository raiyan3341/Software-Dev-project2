import React, { useState } from 'react';
import { X, Plus, ShieldCheck, AlertCircle, Package } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { Product } from '../../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { products, setProducts, categories, logActivity } = useMediStockStore();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Tablets & Capsules');
  const [manufacturer, setManufacturer] = useState('');
  const [unit, setUnit] = useState('1 Box (10x10 Tablets)');
  const [price, setPrice] = useState(150);
  const [stock, setStock] = useState(200);
  const [minStockThreshold, setMinStockThreshold] = useState(30);
  const [batchNumber, setBatchNumber] = useState(`BT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [isPrescriptionRequired, setIsPrescriptionRequired] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name,
      sku: sku || `MED-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      manufacturer: manufacturer || 'Square Pharmaceuticals PLC',
      unit,
      price: Number(price),
      stock: Number(stock),
      minStockThreshold: Number(minStockThreshold),
      isPrescriptionRequired,
      isActive: true,
      batchNumber,
      expiryDate,
      description: description || 'Genuine DGHS certified pharmaceutical formulation.',
      image,
    };

    setProducts([newProduct, ...products]);
    logActivity('Added New Product to Catalog', `${name} (${newProduct.sku})`, 'product');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Add New Medical Product</h3>
              <p className="text-xs text-slate-500">Create SKU and register stock into central inventory</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cefixime 200mg Capsules"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">SKU / Code</label>
                <input
                  type="text"
                  placeholder="e.g. MED-CEF-200"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Manufacturer *</label>
                <input
                  type="text"
                  placeholder="e.g. Square / Beximco / Incepta"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit Packaging</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Strip (10 Tabs)"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">B2B Restock Price (৳) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none font-bold text-teal-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Stock Qty *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Number *</label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none text-slate-600"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                />
              </div>

              <div className="col-span-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPrescriptionRequired}
                    onChange={(e) => setIsPrescriptionRequired(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <span className="font-bold text-rose-700">Requires Doctor Prescription (Rx)</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
              >
                Save & Add to Catalog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


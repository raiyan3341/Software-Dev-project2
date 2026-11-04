import React from 'react';
import {
  Wind,
  Flame,
  Activity,
  HeartPulse,
  PlusSquare,
  Sparkles,
  FlaskConical,
  Pill,
  Shield,
  Thermometer,
  Hand,
  Stethoscope,
  Droplets,
  Box,
  Layers,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { useMediStockStore } from '../../data/store';

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
  priceFilter: number;
  onPriceFilterChange: (price: number) => void;
  prescriptionOnly: boolean;
  onPrescriptionOnlyChange: (val: boolean) => void;
  inStockOnly: boolean;
  onInStockOnlyChange: (val: boolean) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  priceFilter,
  onPriceFilterChange,
  prescriptionOnly,
  onPrescriptionOnlyChange,
  inStockOnly,
  onInStockOnlyChange,
}) => {
  const { categories, products } = useMediStockStore();

  const iconMap: Record<string, any> = {
    'Cold & Cough': Wind,
    'Gastric & Digestive': Flame,
    'Blood Pressure': Activity,
    'Diabetes': HeartPulse,
    'First Aid': PlusSquare,
    'Creams & Ointments': Sparkles,
    'Syrups & Liquids': FlaskConical,
    'Tablets & Capsules': Pill,
    'Masks & PPE': Shield,
    'Thermometers': Thermometer,
    'Gloves': Hand,
    'Medical Equipment': Stethoscope,
    'Hygiene Supplies': Droplets,
    'Other Supplies': Box,
  };

  const handleResetFilters = () => {
    onSelectCategory(null);
    onPriceFilterChange(5000);
    onPrescriptionOnlyChange(false);
    onInStockOnlyChange(false);
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-6 shrink-0 h-fit">
      
      {/* Category Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-600" />
          Categories
        </h3>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* 14 Categories matching Project.png Screen 2 */}
      <div className="space-y-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-teal-50 text-teal-700 font-bold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>All Categories</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">
            {products.length}
          </span>
        </button>

        {categories.map((cat) => {
          const Icon = iconMap[cat.name] || Box;
          const isSelected = selectedCategory === cat.name;
          const count = products.filter(p => p.category === cat.name).length;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                isSelected
                  ? 'bg-teal-50 text-teal-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isSelected ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-600'
                }`} />
                <span className="truncate text-left">{cat.name}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                isSelected ? 'bg-teal-200/60 text-teal-900' : 'bg-slate-100 text-slate-500'
              }`}>
                {count > 0 ? count : cat.itemCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Refine Filters */}
      <div className="border-t border-slate-100 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            Filter by Price
          </h4>
          <span className="text-xs font-bold text-teal-700">Up to ৳{priceFilter}</span>
        </div>

        <input
          type="range"
          min="20"
          max="5000"
          step="25"
          value={priceFilter}
          onChange={(e) => onPriceFilterChange(Number(e.target.value))}
          className="w-full accent-teal-600 cursor-pointer"
        />

        <div className="flex justify-between text-[11px] text-slate-400">
          <span>৳ 20</span>
          <span>৳ 5,000+</span>
        </div>
      </div>

      {/* Toggle Checkboxes */}
      <div className="border-t border-slate-100 pt-4 space-y-3">
        <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
          />
          <span>In Stock Only</span>
        </label>

        <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={prescriptionOnly}
            onChange={(e) => onPrescriptionOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
          />
          <span>Prescription Medicines (Rx)</span>
        </label>
      </div>

      {/* Reset button */}
      <button
        onClick={handleResetFilters}
        className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset All Filters
      </button>

    </aside>
  );
};


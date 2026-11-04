import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, PlusCircle, AlertCircle, Sparkles, X, Layers, Check } from 'lucide-react';
import { CategorySidebar } from './CategorySidebar';
import { MaskPromoBanner } from './MaskPromoBanner';
import { ProductCard } from './ProductCard';
import { useMediStockStore } from '../../data/store';
import { Product } from '../../types';

interface ProductCatalogPageProps {
  initialCategory?: string;
  onOpenProductModal: (product: Product) => void;
  onNavigateDemandRequest: () => void;
}

export const ProductCatalogPage: React.FC<ProductCatalogPageProps> = ({
  initialCategory,
  onOpenProductModal,
  onNavigateDemandRequest,
}) => {
  const { products, categories } = useMediStockStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    if (!initialCategory) return null;
    const matched = categories.find(c => c.slug === initialCategory || c.name.toLowerCase() === initialCategory.toLowerCase());
    return matched ? matched.name : initialCategory;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<number>(5000);
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name'>('relevance');

  // React to initialCategory navigation changes
  useEffect(() => {
    if (initialCategory) {
      const matched = categories.find(c => c.slug === initialCategory || c.name.toLowerCase() === initialCategory.toLowerCase());
      setSelectedCategory(matched ? matched.name : initialCategory);
    }
  }, [initialCategory, categories]);

  // Real-time instantaneous search & ranking algorithm
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products
      .filter((p) => {
        // 1. Category filter
        if (selectedCategory && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // 2. Real-time typing search filter
        if (query) {
          const nameLower = p.name.toLowerCase();
          const catLower = p.category.toLowerCase();
          const skuLower = p.sku.toLowerCase();
          const mfgLower = p.manufacturer.toLowerCase();
          const descLower = (p.description || '').toLowerCase();

          const matches =
            nameLower.includes(query) ||
            catLower.includes(query) ||
            skuLower.includes(query) ||
            mfgLower.includes(query) ||
            descLower.includes(query);

          if (!matches) return false;
        }

        // 3. Price filter
        if (p.price > priceFilter) {
          return false;
        }

        // 4. Prescription filter
        if (prescriptionOnly && !p.isPrescriptionRequired) {
          return false;
        }

        // 5. In-stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // If user is searching, prioritize product names that start with or match the query first!
        if (query) {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();

          const aStarts = aName.startsWith(query);
          const bStarts = bName.startsWith(query);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;

          const aIndex = aName.indexOf(query);
          const bIndex = bName.indexOf(query);
          if (aIndex !== -1 && bIndex !== -1 && aIndex !== bIndex) {
            return aIndex - bIndex;
          }
        }

        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, priceFilter, prescriptionOnly, inStockOnly, sortBy]);

  // Featured row products when viewing full catalog
  const featuredRowProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const handleClearAllFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceFilter(5000);
    setPrescriptionOnly(false);
    setInStockOnly(false);
    setSortBy('relevance');
  };

  const isFilteringActive = Boolean(selectedCategory || searchQuery.trim() || priceFilter < 5000 || prescriptionOnly || inStockOnly);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Controls Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Instant Live Search Input matching User Requirement */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medicine name, generic, SKU..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-2xl border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
            />
            <Search className="w-4 h-4 text-teal-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Active Category Indicator & Results Count */}
          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
            <span>
              Showing <strong className="text-slate-900 font-extrabold text-sm">{filteredProducts.length}</strong> items
            </span>
            {selectedCategory && (
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-bold text-xs border border-teal-200 flex items-center gap-1.5 shadow-2xs">
                <span>Category: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-3.5 h-3.5 rounded-full hover:bg-teal-200 flex items-center justify-center text-teal-800"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 font-semibold text-xs border border-cyan-200 flex items-center gap-1">
                <span>"{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="w-3.5 h-3.5 rounded-full hover:bg-cyan-200 flex items-center justify-center text-cyan-800"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {isFilteringActive && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold underline ml-1 cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
            >
              <option value="relevance">Relevance / Match</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* 2-Column Layout matching Project.png Screen 2 */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* Left Sidebar: 14 Categories with live filtering */}
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            priceFilter={priceFilter}
            onPriceFilterChange={setPriceFilter}
            prescriptionOnly={prescriptionOnly}
            onPrescriptionOnlyChange={setPrescriptionOnly}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
          />

          {/* Right Main Content */}
          <main className="flex-1 w-full space-y-8">
            
            {/* Promo Banner matching Project.png (only on general view or when Masks selected) */}
            {(!selectedCategory || selectedCategory === 'Masks & PPE') && !searchQuery && (
              <MaskPromoBanner
                onShopMasks={() => setSelectedCategory('Masks & PPE')}
              />
            )}

            {/* Featured Products Section matching Project.png Screen 2 (shown when no category is filtered) */}
            {!selectedCategory && !searchQuery && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
                      Featured Products
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-teal-600">
                    Handpicked essentials
                  </span>
                </div>

                {/* 4 Featured Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                  {featuredRowProducts.map((prod) => (
                    <ProductCard
                      key={`featured-${prod.id}`}
                      product={prod}
                      onOpenModal={onOpenProductModal}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Filtered Catalog Header */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                      {selectedCategory
                        ? `${selectedCategory} Supplies`
                        : searchQuery
                        ? `Search Results for "${searchQuery}"`
                        : 'Complete Medical Supply Inventory'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedCategory
                        ? `Showing verified medicines and equipment under ${selectedCategory}`
                        : 'Wholesale B2B & Public Healthcare Supply catalog'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 self-start sm:self-auto bg-slate-100 px-2.5 py-1 rounded-lg">
                  {filteredProducts.length} items available
                </span>
              </div>

              {/* Products Grid or Empty State */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">No matching medical supplies found</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {searchQuery
                        ? `No products matched "${searchQuery}". Please check your spelling or try searching another generic name.`
                        : 'No items match your active price or prescription filters.'}
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={handleClearAllFilters}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={onNavigateDemandRequest}
                      className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Request Product Restock
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onOpenModal={onOpenProductModal}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Need Missing Medicine? Callout Box */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-3xl border border-teal-200 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Can't find a specific medicine or medical device?
                </h4>
                <p className="text-xs text-slate-600 max-w-xl">
                  Hospitals and pharmacies can submit instant product demand requests. Our procurement team will source it directly from certified manufacturers.
                </p>
              </div>
              <button
                onClick={onNavigateDemandRequest}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs whitespace-nowrap shadow-md shadow-teal-600/20 transition-all shrink-0"
              >
                Submit Supply Request →
              </button>
            </div>

          </main>

        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  ShoppingBag,
  Plus,
  Minus,
  PackageX,
  Sparkles,
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { StationeryCategory } from '../types';

const CATEGORIES: ('All' | StationeryCategory)[] = [
  'All',
  'Pens and pencils',
  'Notebooks and registers',
  'Scissors',
  'Staplers',
  'Files and folders',
  'Highlighters and markers',
  'Sticky notes',
  'Geometry supplies',
  'Project supplies',
];

export const StationeryPage: React.FC = () => {
  const { products } = useOrders();
  const { addStationery, updateStationeryQty, getItemQuantity } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategoryParam = (searchParams.get('category') as StationeryCategory) || 'All';
  const activeSearchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(activeCategoryParam);
  const [searchTerm, setSearchTerm] = useState<string>(activeSearchParam);
  const [stockOnly, setStockOnly] = useState<boolean>(false);

  // Sync state if URL query params change
  React.useEffect(() => {
    if (activeCategoryParam && activeCategoryParam !== selectedCategory) {
      setSelectedCategory(activeCategoryParam);
    }
    if (activeSearchParam && activeSearchParam !== searchTerm) {
      setSearchTerm(activeSearchParam);
    }
  }, [activeCategoryParam, activeSearchParam]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim()) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'All' || prod.category === selectedCategory;
      const matchesSearch =
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStock = !stockOnly || prod.inStock;

      return matchesCategory && matchesSearch && matchesStock;
    });
  }, [products, selectedCategory, searchTerm, stockOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-theme pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00]/15 border border-[#FFCC00]/30 text-xs font-bold text-yellow-600 dark:text-[#FFCC00] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Stationery Catalogue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-theme-main">
            College Stationery Supplies
          </h1>
          <p className="text-sm text-theme-muted mt-1">
            Genuine notebooks, registers, pens, exam kits, and project folders
          </p>
        </div>

        {/* Search input in header */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, brand, or tag..."
            className="w-full bg-theme-input text-xs sm:text-sm text-theme-main placeholder:text-theme-muted/60 pl-10 pr-12 py-2.5 rounded-xl border border-theme focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                searchParams.delete('search');
                setSearchParams(searchParams);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-theme-muted hover:text-theme-main font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills and Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-theme-muted uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#FFCC00]" />
            <span>Filter Categories:</span>
          </div>

          <label className="flex items-center gap-2 text-xs text-theme-muted cursor-pointer hover:text-theme-main">
            <input
              type="checkbox"
              checked={stockOnly}
              onChange={(e) => setStockOnly(e.target.checked)}
              className="rounded bg-theme-input border-theme text-[#FFCC00] focus:ring-0"
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Horizontal scrollable category pill list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#FFCC00] text-[#0B1016] shadow-sm shadow-[#FFCC00]/20'
                    : 'bg-theme-card text-theme-muted hover:text-theme-main hover:bg-theme-card-hover border border-theme'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-theme-card border border-theme rounded-3xl p-12 text-center max-w-lg mx-auto my-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-theme-input border border-theme flex items-center justify-center text-theme-muted mx-auto mb-4">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-theme-main">No stationery items found</h3>
          <p className="text-xs text-theme-muted mt-1 max-w-xs mx-auto">
            Try adjusting your search keywords or clearing the category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchTerm('');
              setStockOnly(false);
              setSearchParams({});
            }}
            className="mt-6 text-xs font-bold bg-[#FFCC00] text-[#0B1016] px-5 py-2.5 rounded-xl hover:bg-[#E5B800] transition-colors shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const currentCartQty = getItemQuantity(prod.id);

            return (
              <div
                key={prod.id}
                className="bg-theme-card border border-theme hover:border-[#FFCC00]/50 rounded-2xl overflow-hidden shadow-md flex flex-col transition-all duration-200 group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-semibold text-[#FFCC00]">
                    {prod.category}
                  </div>

                  {!prod.inStock ? (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-rose-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Out of Stock
                      </span>
                    </div>
                  ) : prod.stock < 10 ? (
                    <div className="absolute bottom-2 right-2 bg-amber-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                      Only {prod.stock} left!
                    </div>
                  ) : null}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-theme-main line-clamp-2 group-hover:text-yellow-600 dark:group-hover:text-[#FFCC00] transition-colors leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-theme-muted line-clamp-2 mt-1.5 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  {/* Pricing and Cart Actions */}
                  <div className="mt-4 pt-3 border-t border-theme flex items-center justify-between">
                    <div>
                      <span className="text-lg font-black text-theme-main">
                        ₹{prod.price}
                      </span>
                      <span className="text-[10px] text-theme-muted block">MRP incl. tax</span>
                    </div>

                    {currentCartQty > 0 ? (
                      <div className="flex items-center gap-2 bg-theme-input border border-theme rounded-xl p-1">
                        <button
                          onClick={() => updateStationeryQty(prod.id, currentCartQty - 1)}
                          className="w-7 h-7 rounded-lg bg-theme-card hover:bg-theme-card-hover text-theme-main flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-yellow-600 dark:text-[#FFCC00] px-1">
                          {currentCartQty}
                        </span>
                        <button
                          onClick={() => updateStationeryQty(prod.id, currentCartQty + 1)}
                          disabled={currentCartQty >= prod.stock}
                          className="w-7 h-7 rounded-lg bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] flex items-center justify-center transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addStationery(prod, 1)}
                        disabled={!prod.inStock}
                        className="flex items-center gap-1.5 text-xs font-bold bg-[#FFCC00] hover:bg-[#E5B800] text-[#0B1016] px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-[#FFCC00]/20 active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

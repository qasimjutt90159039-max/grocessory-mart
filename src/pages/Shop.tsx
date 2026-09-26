import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { Product, Category, Brand } from '../types';
import { api } from '../api';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter states
  const categoryParam = searchParams.get('category') || 'all';
  const subcategoryParam = searchParams.get('subcategory') || 'all';
  const brandParam = searchParams.get('brand') || 'all';
  const searchParam = searchParams.get('search') || '';
  const dealsParam = searchParams.get('deals') === 'true';
  const sortParam = searchParams.get('sort') || 'featured';

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodData, catData, brandData] = await Promise.all([
          api.getProducts({
            category: categoryParam !== 'all' ? categoryParam : undefined,
            subcategory: subcategoryParam !== 'all' ? subcategoryParam : undefined,
            brand: brandParam !== 'all' ? brandParam : undefined,
            search: searchParam || undefined,
            isDeal: dealsParam ? true : undefined,
            sort: sortParam,
          }),
          api.getCategories(),
          api.getBrands(),
        ]);
        setProducts(prodData);
        setCategories(catData);
        setBrands(brandData);
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryParam, subcategoryParam, brandParam, searchParam, dealsParam, sortParam]);

  const updateFilter = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // Reset subcategory if category changes
    if (key === 'category') {
      next.delete('subcategory');
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setMinPrice(0);
    setMaxPrice(5000);
    setInStockOnly(false);
  };

  // Client side extra filtering (price range & in stock)
  const displayedProducts = products.filter((p) => {
    const price = p.salePrice || p.price;
    if (price < minPrice || price > maxPrice) return false;
    if (inStockOnly && p.stockStatus === 'out_of_stock') return false;
    return true;
  });

  const selectedCategoryObj = categories.find((c) => c.slug === categoryParam);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
            {selectedCategoryObj
              ? selectedCategoryObj.name
              : dealsParam
              ? 'Fresh Weekly Deals & Discounts'
              : searchParam
              ? `Search Results for "${searchParam}"`
              : 'Browse Grocery Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Showing {displayedProducts.length} items available for local delivery across Multan
          </p>
        </div>

        {/* Active Filters Row */}
        {(categoryParam !== 'all' ||
          subcategoryParam !== 'all' ||
          brandParam !== 'all' ||
          searchParam ||
          dealsParam) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-xl border border-neutral-200">
            <span className="text-xs font-bold text-neutral-500">Active Filters:</span>

            {categoryParam !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#166534] text-xs font-semibold px-2.5 py-1 rounded-lg">
                Category: {selectedCategoryObj?.name || categoryParam}
                <button onClick={() => updateFilter('category', null)}>
                  <X className="w-3.5 h-3.5 hover:text-red-600" />
                </button>
              </span>
            )}

            {subcategoryParam !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#166534] text-xs font-semibold px-2.5 py-1 rounded-lg">
                Subcategory: {subcategoryParam}
                <button onClick={() => updateFilter('subcategory', null)}>
                  <X className="w-3.5 h-3.5 hover:text-red-600" />
                </button>
              </span>
            )}

            {brandParam !== 'all' && (
              <span className="inline-flex items-center gap-1 bg-[#DCFCE7] text-[#166534] text-xs font-semibold px-2.5 py-1 rounded-lg">
                Brand: {brandParam}
                <button onClick={() => updateFilter('brand', null)}>
                  <X className="w-3.5 h-3.5 hover:text-red-600" />
                </button>
              </span>
            )}

            {dealsParam && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-lg">
                Deals Only
                <button onClick={() => updateFilter('deals', null)}>
                  <X className="w-3.5 h-3.5 hover:text-red-600" />
                </button>
              </span>
            )}

            {searchParam && (
              <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
                Keyword: "{searchParam}"
                <button onClick={() => updateFilter('search', null)}>
                  <X className="w-3.5 h-3.5 hover:text-red-600" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:underline font-semibold ml-auto flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-heading font-bold text-sm text-neutral-900 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter('category', 'all')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      categoryParam === 'all'
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span>All Groceries</span>
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateFilter('category', c.slug)}
                      className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                        categoryParam === c.slug
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {c.productCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories (if a category is active) */}
              {selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
                <div className="pt-4 border-t border-neutral-100">
                  <h3 className="font-heading font-bold text-xs text-neutral-900 uppercase tracking-wider mb-2.5">
                    Subcategories
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => updateFilter('subcategory', 'all')}
                      className={`w-full text-left py-1 px-2 rounded text-xs transition-colors ${
                        subcategoryParam === 'all'
                          ? 'font-bold text-[#166534] bg-emerald-50'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      All in {selectedCategoryObj.name}
                    </button>
                    {selectedCategoryObj.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => updateFilter('subcategory', sub)}
                        className={`w-full text-left py-1 px-2 rounded text-xs transition-colors ${
                          subcategoryParam === sub
                            ? 'font-bold text-[#166534] bg-emerald-50'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Filter */}
              <div className="pt-4 border-t border-neutral-100">
                <h3 className="font-heading font-bold text-sm text-neutral-900 uppercase tracking-wider mb-3">
                  Brands
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => updateFilter('brand', 'all')}
                    className={`w-full text-left py-1 px-2 rounded text-xs transition-colors ${
                      brandParam === 'all'
                        ? 'font-bold text-[#166534] bg-emerald-50'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => updateFilter('brand', b.name)}
                      className={`w-full text-left py-1 px-2 rounded text-xs transition-colors ${
                        brandParam.toLowerCase() === b.name.toLowerCase()
                          ? 'font-bold text-[#166534] bg-emerald-50'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-sm text-neutral-900 uppercase tracking-wider">
                    Price Range
                  </h3>
                  <span className="text-xs font-mono text-[#166534] font-semibold">
                    Up to PKR {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#16A34A]"
                />
              </div>

              {/* In-Stock Toggle */}
              <div className="pt-4 border-t border-neutral-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#16A34A] focus:ring-[#16A34A] accent-[#16A34A]"
                  />
                  <span>In-Stock Items Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Product Grid Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar: Mobile Filter Toggle & Sort Select */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E5E7EB] flex items-center justify-between gap-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2 ml-auto text-xs">
                <span className="text-neutral-500 font-semibold">Sort By:</span>
                <select
                  value={sortParam}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-neutral-50 border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-neutral-800 focus:outline-hidden focus:border-[#16A34A]"
                >
                  <option value="featured">Featured & Best Sellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-24">
                <div className="w-10 h-10 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-semibold text-neutral-500">Loading fresh groceries...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
                <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-base text-neutral-800">No items match your filters</h3>
                <p className="text-xs text-neutral-500 mt-1 mb-6">
                  Try adjusting the category, clear search keywords or reset price ranges.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-[#16A34A] text-white text-xs font-bold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm h-full bg-white shadow-2xl p-5 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="font-heading font-bold text-base text-neutral-900">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-neutral-500 mb-2">Category</h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    updateFilter('category', 'all');
                    setMobileFiltersOpen(false);
                  }}
                  className={`w-full text-left py-1 px-2 rounded text-xs ${
                    categoryParam === 'all' ? 'font-bold text-[#166534] bg-emerald-50' : 'text-neutral-700'
                  }`}
                >
                  All Groceries
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      updateFilter('category', c.slug);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left py-1 px-2 rounded text-xs ${
                      categoryParam === c.slug ? 'font-bold text-[#166534] bg-emerald-50' : 'text-neutral-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setMobileFiltersOpen(false);
              }}
              className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

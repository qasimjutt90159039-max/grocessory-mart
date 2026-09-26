import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Phone,
  Clock,
  Percent,
  CheckCircle,
  Tag,
  Star,
  MapPin,
  ChevronRight,
  Flame
} from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../api';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { useCart } from '../context/CartContext';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodData, catData] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const dealProducts = products.filter((p) => p.isDeal || (p.salePrice && p.salePrice < p.price)).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const filteredProducts =
    activeTab === 'all'
      ? products.slice(0, 8)
      : products.filter((p) => p.category === activeTab).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Large Modern Grocery Hero Section */}
      <section className="relative bg-gradient-to-b from-[#F0FDF4] via-white to-[#F8FAFC] pt-8 pb-16 lg:py-16 border-b border-[#E5E7EB] overflow-hidden">
        {/* Subtle geometric dot pattern */}
        <div className="absolute inset-0 bg-grocery-pattern opacity-40 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading + Description + CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#DCFCE7] text-[#166534] px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Multan Mart • Online Grocery Store</span>
              </div>

              {/* HEADING WITH VIBRANT CHANGED COLOR AS REQUESTED */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent">
                  FRESH ESSENTIALS
                </span>{' '}
                <span className="text-[#14532D] block sm:inline">
                  FOR EVERYDAY LIFE
                </span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl">
                Shop groceries, household essentials and everyday products from one convenient online store. Quality pantry staples delivered directly to your home across Multan with Cash on Delivery.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="bg-[#16A34A] hover:bg-[#166534] text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all flex items-center gap-2 group"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/shop?deals=true"
                  className="bg-white hover:bg-neutral-50 text-neutral-800 border border-[#E5E7EB] hover:border-[#16A34A] font-bold text-sm px-6 py-3.5 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Percent className="w-4 h-4 text-emerald-600" />
                  <span>EXPLORE DEALS</span>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-neutral-200/80 max-w-lg text-xs">
                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                  <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                  <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Fresh Stock</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                  <CheckCircle className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Shah Rukn E Alam</span>
                </div>
              </div>
            </div>

            {/* Right Column: Original Grocery Photography & Floating Product Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Real Grocery Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white aspect-4/3 sm:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=85"
                    alt="Fresh supermarket grocery products, food staples, vegetables and fruits at Multan Mart"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-white/60 shadow-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-neutral-900">Multan Mart Daily Dispatch</p>
                      <p className="text-[11px] text-neutral-500">Order online or call +92 303 0034443</p>
                    </div>
                    <span className="bg-[#16A34A] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      Open Daily
                    </span>
                  </div>
                </div>

                {/* Floating Card 1: Basmati Rice */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-neutral-100 flex items-center gap-3 animate-bounce-subtle">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80"
                      alt="Super Kernel Basmati Rice"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-700">Pantry King</span>
                    <p className="text-xs font-bold text-neutral-900">Super Kernel Basmati</p>
                    <p className="text-[11px] font-mono font-semibold text-[#166534]">5 kg Pack</p>
                  </div>
                </div>

                {/* Floating Card 2: Fresh Pure Milk */}
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-neutral-100 flex items-center gap-3 hidden sm:flex">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80"
                      alt="Full Cream Fresh Milk"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#16A34A]">Dairy Daily</span>
                    <p className="text-xs font-bold text-neutral-900">Pure Full Cream Milk</p>
                    <p className="text-[11px] font-mono font-semibold text-[#166534]">100% Homogenized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Top Feature Banner */}
      <section className="bg-white py-6 border-b border-[#E5E7EB]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Cash on Delivery</h4>
                <p className="text-[11px] text-neutral-500">Inspect order before payment</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Genuine Brands</h4>
                <p className="text-[11px] text-neutral-500">Guard, Dalda, Tapal & more</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Open 7 Days</h4>
                <p className="text-[11px] text-neutral-500">8:00 AM – 11:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Direct Helpline</h4>
                <p className="text-[11px] text-neutral-500 font-mono">+92 303 0034443</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop By Category (Large visual category cards with original photographic imagery) */}
      <section className="py-14 container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#16A34A] text-xs font-bold uppercase tracking-wider mb-1">
              <span>Categories</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
              Explore Our Grocery Shelves
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#16A34A] hover:text-[#166534] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#16A34A] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="aspect-4/3 w-full bg-[#F0FDF4]/30 overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-heading font-extrabold text-base sm:text-lg leading-tight group-hover:text-[#DCFCE7] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-emerald-100 font-medium">
                    {cat.productCount}+ Products Available
                  </span>
                </div>
              </div>

              {/* Subcategories tags */}
              <div className="p-3 bg-white flex flex-wrap gap-1">
                {cat.subcategories.slice(0, 3).map((sub) => (
                  <span
                    key={sub}
                    className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium group-hover:bg-[#DCFCE7] group-hover:text-[#166534] transition-colors"
                  >
                    {sub}
                  </span>
                ))}
                {cat.subcategories.length > 3 && (
                  <span className="text-[10px] text-neutral-400 font-medium px-1">
                    +{cat.subcategories.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Fresh Deals & Discounts Section */}
      {dealProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-emerald-950 via-[#14532D] to-emerald-900 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-400 text-neutral-900 font-extrabold text-[11px] px-3 py-1 rounded-md uppercase tracking-wider mb-2">
                  <Flame className="w-3.5 h-3.5 fill-neutral-900" />
                  <span>Limited Time Grocery Savings</span>
                </div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  Fresh Weekly Deals
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-lg">
                  Special savings on premium staples, milk cartons, pure tea, and family-sized household essentials.
                </p>
              </div>

              <Link
                to="/shop?deals=true"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-[#14532D] font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-1.5 self-start md:self-auto"
              >
                <span>View All Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dealProducts.map((product) => (
                <div key={product.id} className="text-neutral-900">
                  <ProductCard product={product} onQuickView={setSelectedProduct} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Best Sellers & Daily Essentials Grid with Filter Tabs */}
      <section className="py-14 container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#16A34A] text-xs font-bold uppercase tracking-wider mb-1">
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight">
              Everyday Pantry Essentials
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              All Essentials
            </button>
            <button
              onClick={() => setActiveTab('grocery')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'grocery'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Grocery & Atta
            </button>
            <button
              onClick={() => setActiveTab('dairy-breakfast')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'dairy-breakfast'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Dairy & Eggs
            </button>
            <button
              onClick={() => setActiveTab('beverages')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'beverages'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Tea & Beverages
            </button>
            <button
              onClick={() => setActiveTab('household')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'household'
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-white border border-[#E5E7EB] text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Household
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setSelectedProduct}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-neutral-300 hover:border-[#16A34A] text-neutral-800 hover:text-[#16A34A] font-bold text-sm rounded-xl shadow-xs transition-colors"
          >
            <span>Explore Full 40+ Product Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. Promotional Banner: Month-End Grocery Bundle */}
      <section className="py-10 container mx-auto px-4">
        <div className="bg-gradient-to-br from-[#166534] via-[#14532D] to-neutral-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block bg-[#22C55E] text-[#14532D] font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
              Shah Rukn E Alam Special
            </span>
            <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-white leading-tight">
              Use Coupon <span className="text-amber-400 font-mono">WELCOME10</span> For 10% Off
            </h3>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Order your monthly household ration with ease. Enjoy free doorstep delivery on all orders exceeding PKR 2,500 across Multan.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="bg-white hover:bg-emerald-50 text-[#14532D] font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors"
              >
                Apply On Order
              </Link>
              <div className="text-xs text-emerald-200">
                <span>Direct Helpline: </span>
                <a href="tel:+923030034443" className="font-mono font-bold text-white hover:underline">
                  +92 303 0034443
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Verified Local Physical Store Information */}
      <section className="py-12 bg-white border-t border-[#E5E7EB]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[#16A34A] text-xs font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4" />
                <span>Local Physical Store Presence</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 tracking-tight mb-4">
                Visit Multan Mart at Thana Chowk
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                Prefer to shop in person or inspect your daily groceries? Our store is conveniently located at Thana Chowk in Shah Rukn E Alam Housing Scheme, Multan.
              </p>

              <div className="space-y-3 text-xs text-neutral-700">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
                  <MapPin className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold mb-0.5">Address:</strong>
                    <span>A 31, Commercial Market, Thana Chowk, A Block, Shah Rukn E Alam Housing Scheme, Multan, Punjab, Pakistan</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
                  <Phone className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <div>
                    <strong className="block text-neutral-900 font-semibold mb-0.5">Contact Phone:</strong>
                    <a href="tel:+923030034443" className="text-[#16A34A] font-mono font-bold text-sm hover:underline">
                      +92 303 0034443
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Map Representation */}
            <div className="bg-[#F0FDF4] rounded-2xl p-6 border border-[#DCFCE7] flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#16A34A] text-white flex items-center justify-center font-bold">
                    MM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Multan Mart Storefront</h4>
                    <p className="text-xs text-neutral-500">Commercial Market, Multan</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-[#DCFCE7] px-2 py-0.5 rounded">
                  Open Now
                </span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-neutral-200 text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Delivery Method:</span>
                  <span className="font-semibold text-neutral-900">Cash on Delivery (COD)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Standard Delivery:</span>
                  <span className="font-mono text-neutral-900">PKR 150 (Free over PKR 2,500)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Service Area:</span>
                  <span className="font-semibold text-neutral-900">All Multan Sectors</span>
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#166534] text-white text-xs font-bold rounded-xl text-center transition-colors"
              >
                Get Directions & Send Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

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

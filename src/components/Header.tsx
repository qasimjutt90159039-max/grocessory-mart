import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Phone,
  Sparkles,
  Percent,
  LogOut,
  LayoutDashboard,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { itemCount, setIsDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navCategories = [
    { label: 'Grocery & Staples', path: '/shop?category=grocery' },
    { label: 'Beverages & Drinks', path: '/shop?category=beverages' },
    { label: 'Dairy & Breakfast', path: '/shop?category=dairy-breakfast' },
    { label: 'Snacks & Packaged', path: '/shop?category=snacks-packaged' },
    { label: 'Household Essentials', path: '/shop?category=household' },
    { label: 'Personal Care', path: '/shop?category=personal-care' },
    { label: 'Baby Care', path: '/shop?category=baby-care' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path.startsWith('/shop?category=') && location.search.includes(path.split('?')[1])) return true;
    if (path === '/shop' && location.pathname === '/shop' && !location.search.includes('category') && !location.search.includes('deals')) return true;
    if (path === '/shop?deals=true' && location.search.includes('deals=true')) return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-xs">
      {/* Zone 1: Top Announcement Bar */}
      <div className="bg-[#14532D] text-white text-xs py-1.5 px-4 font-medium">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            <span className="font-medium tracking-wide">
              Fresh Groceries & Everyday Essentials • Shah Rukn E Alam, Multan
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-emerald-100 text-xs">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>A 31 Commercial Market, Thana Chowk, Multan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
              <a href="tel:+923030034443" className="hover:text-white font-mono transition-colors">
                +92 303 0034443
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 2: Main Header Navigation & Actions */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-700 hover:text-[#16A34A] hover:bg-[#F0FDF4] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#14532D] flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-[#171717] group-hover:text-[#16A34A] transition-colors leading-none">
                  MULTAN MART
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#16A34A] mt-0.5">
                  Fresh Grocery & Daily Needs
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search groceries, atta, rice, tea, oil, dairy, snacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F0FDF4]/50 hover:bg-[#F0FDF4] focus:bg-white text-sm text-[#171717] placeholder:text-neutral-400 pl-4 pr-11 py-2.5 rounded-xl border border-[#E5E7EB] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all outline-hidden"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#16A34A] hover:bg-[#166534] text-white rounded-lg flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Quick Action Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger (Mobile only) */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-700 hover:text-[#16A34A] hover:bg-[#F0FDF4] transition-colors"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 rounded-lg text-neutral-700 hover:text-[#16A34A] hover:bg-[#F0FDF4] transition-colors flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#16A34A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account / User Menu */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-[#E5E7EB] hover:border-[#16A34A] bg-[#F0FDF4]/30 hover:bg-[#F0FDF4] text-neutral-700 text-xs font-medium transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline-block max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-[#F0FDF4] hover:text-[#16A34A]"
                      >
                        <UserIcon className="w-4 h-4 text-neutral-400" />
                        My Account & Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#166534] bg-emerald-50 hover:bg-emerald-100"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#16A34A]" />
                          Admin Store Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#E5E7EB] hover:border-[#16A34A] text-neutral-700 text-xs font-semibold hover:text-[#16A34A] transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-neutral-500" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#16A34A] hover:bg-[#166534] text-white py-2 px-3.5 rounded-xl font-semibold text-xs transition-colors shadow-xs group"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-amber-400 text-neutral-900 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input dropdown */}
        {searchOpen && (
          <div className="md:hidden pt-3 pb-1">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search groceries, atta, rice, tea, oil..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#F0FDF4] text-sm text-[#171717] placeholder:text-neutral-400 pl-4 pr-10 py-2.5 rounded-xl border border-[#16A34A] focus:outline-hidden"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-2.5 bg-[#16A34A] text-white rounded-lg flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Zone 3: Bottom Category Bar & Links */}
      <nav className="border-t border-[#E5E7EB] bg-[#F0FDF4]/30 hidden lg:block">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`py-2.5 px-3 rounded-lg transition-colors ${
                isActive('/') ? 'text-[#16A34A] font-bold bg-[#DCFCE7]' : 'text-neutral-700 hover:text-[#16A34A]'
              }`}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={`py-2.5 px-3 rounded-lg transition-colors ${
                isActive('/shop') ? 'text-[#16A34A] font-bold bg-[#DCFCE7]' : 'text-neutral-700 hover:text-[#16A34A]'
              }`}
            >
              Shop All
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 py-2.5 px-3 rounded-lg text-neutral-700 hover:text-[#16A34A] transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute left-0 top-full w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  {navCategories.map((c) => (
                    <Link
                      key={c.path}
                      to={c.path}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-neutral-700 hover:bg-[#F0FDF4] hover:text-[#16A34A] transition-colors"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/shop?category=grocery"
              className={`py-2.5 px-3 rounded-lg transition-colors ${
                isActive('/shop?category=grocery') ? 'text-[#16A34A] font-bold bg-[#DCFCE7]' : 'text-neutral-700 hover:text-[#16A34A]'
              }`}
            >
              Grocery & Staples
            </Link>

            <Link
              to="/shop?category=beverages"
              className={`py-2.5 px-3 rounded-lg transition-colors ${
                isActive('/shop?category=beverages') ? 'text-[#16A34A] font-bold bg-[#DCFCE7]' : 'text-neutral-700 hover:text-[#16A34A]'
              }`}
            >
              Beverages
            </Link>

            <Link
              to="/shop?category=dairy-breakfast"
              className={`py-2.5 px-3 rounded-lg transition-colors ${
                isActive('/shop?category=dairy-breakfast') ? 'text-[#16A34A] font-bold bg-[#DCFCE7]' : 'text-neutral-700 hover:text-[#16A34A]'
              }`}
            >
              Dairy & Breakfast
            </Link>

            <Link
              to="/shop?category=household"
              className={`py-2.5 px-3 rounded-lg transition-colors ${
                isActive('/shop?category=household') ? 'text-[#16A34A] font-bold bg-[#DCFCE7]' : 'text-neutral-700 hover:text-[#16A34A]'
              }`}
            >
              Household
            </Link>

            <Link
              to="/shop?category=personal-care"
              className={`py-2.5 px-3 rounded-lg transition-colors ${
                isActive('/shop?category=personal-care') ? 'text-[#16A34A] font-bold bg-[#DCFCE7]' : 'text-neutral-700 hover:text-[#16A34A]'
              }`}
            >
              Personal Care
            </Link>

            <Link
              to="/shop?deals=true"
              className={`py-2.5 px-3 rounded-lg flex items-center gap-1 text-amber-700 hover:text-amber-800 transition-colors font-bold ${
                isActive('/shop?deals=true') ? 'bg-amber-100 text-amber-900' : ''
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-amber-600" />
              <span>Fresh Deals</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-neutral-600">
            <Link to="/about" className="hover:text-[#16A34A] transition-colors">
              About Store
            </Link>
            <Link to="/contact" className="hover:text-[#16A34A] transition-colors">
              Contact & Location
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[108px] z-50 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-4/5 max-w-sm h-full overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="pb-3 border-b border-neutral-100">
              <p className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-2">Explore Groceries</p>
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-sm font-semibold rounded-lg text-neutral-800 hover:bg-[#F0FDF4] hover:text-[#16A34A]"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-sm font-semibold rounded-lg text-neutral-800 hover:bg-[#F0FDF4] hover:text-[#16A34A]"
                >
                  All Products
                </Link>
                <Link
                  to="/shop?deals=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-sm font-semibold rounded-lg text-amber-700 bg-amber-50"
                >
                  Fresh Deals & Discounts
                </Link>
              </div>
            </div>

            <div className="pb-3 border-b border-neutral-100">
              <p className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-2">Categories</p>
              <div className="space-y-1">
                {navCategories.map((c) => (
                  <Link
                    key={c.path}
                    to={c.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 px-3 text-xs font-medium rounded-lg text-neutral-700 hover:bg-[#F0FDF4] hover:text-[#16A34A]"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs space-y-2 text-neutral-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#16A34A]" />
                <a href="tel:+923030034443" className="font-mono text-neutral-900 font-semibold">
                  +92 303 0034443
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>A 31 Commercial Market, Thana Chowk, Shah Rukn E Alam, Multan</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

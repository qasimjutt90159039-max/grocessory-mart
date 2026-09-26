import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { api } from '../api';
import { Order } from '../types';

export const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Active tab derived from subpath or state
  const activeTab = location.pathname.includes('/orders')
    ? 'orders'
    : location.pathname.includes('/wishlist')
    ? 'wishlist'
    : 'profile';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadUserOrders() {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadUserOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
          <div>
            <div className="text-xs font-mono text-slate-500 mb-1">Customer Portal</div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              Welcome, {user.name}
            </h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="self-start sm:self-auto px-3.5 py-1.5 text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
            <Link
              to="/account"
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'profile'
                  ? 'bg-[#DDF6F5] text-[#16706F]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile &amp; Coordinates</span>
            </Link>

            <Link
              to="/account/orders"
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#DDF6F5] text-[#16706F]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                {orders.length}
              </span>
            </Link>

            <Link
              to="/account/wishlist"
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'wishlist'
                  ? 'bg-[#DDF6F5] text-[#16706F]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Saved Equipment</span>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                {wishlist.length}
              </span>
            </Link>

            {user.role === 'admin' && (
              <div className="pt-2 border-t border-slate-100 mt-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            )}
          </aside>

          {/* Main Tab Content */}
          <main className="lg:col-span-9 space-y-6">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs font-mono text-xs">
                <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                  Account Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block mb-1 text-[11px]">FULL NAME:</span>
                    <span className="font-bold text-slate-800 text-sm">{user.name}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block mb-1 text-[11px]">EMAIL:</span>
                    <span className="font-bold text-slate-800 text-sm">{user.email}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block mb-1 text-[11px]">CONTACT PHONE:</span>
                    <span className="font-bold text-slate-800 text-sm">{user.phone || 'Not provided'}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block mb-1 text-[11px]">ORGANIZATION:</span>
                    <span className="font-bold text-slate-800 text-sm">{user.companyName || 'Retail Customer'}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Default Delivery Destination:</span>
                  <p className="text-slate-600">
                    {user.address?.street ? (
                      `${user.address.street}, ${user.address.city} (${user.address.postalCode})`
                    ) : (
                      'No saved street address. You can provide delivery addresses dynamically during checkout.'
                    )}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="font-heading font-bold text-base text-slate-900">
                    Order Tracking &amp; History ({orders.length})
                  </h2>
                  <span className="text-xs font-mono text-slate-500">
                    Cash on Delivery
                  </span>
                </div>

                {loadingOrders ? (
                  <div className="py-12 text-center text-xs text-slate-500 font-mono animate-pulse">
                    Loading your orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Package className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">No orders placed yet</p>
                    <Link
                      to="/shop"
                      className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#31AAA9] rounded"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3 font-mono text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                          <div>
                            <span className="font-bold text-slate-900">{order.orderNumber}</span>
                            <span className="text-slate-400 ml-2">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            STATUS: {order.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-slate-700">
                              <span>{item.quantity}x {item.productName}</span>
                              <span className="font-bold">PKR {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                          <span>Total (COD):</span>
                          <span className="text-[#16706F]">PKR {order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                  Saved Equipment ({wishlist.length})
                </h2>

                {wishlist.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">No items saved in wishlist</p>
                    <Link
                      to="/shop"
                      className="inline-block px-4 py-2 text-xs font-semibold text-white bg-[#31AAA9] rounded"
                    >
                      Browse Equipment
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {wishlist.map(prod => (
                      <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-50 border rounded p-1 flex items-center justify-center shrink-0">
                            <img src={prod.images[0] || '/assets/tcs_platform.svg'} alt="" className="max-h-full max-w-full object-contain" />
                          </div>
                          <div>
                            <Link to={`/product/${prod.slug}`} className="text-xs font-bold text-slate-900 hover:text-[#16706F] block">
                              {prod.name}
                            </Link>
                            <span className="text-[10px] font-mono text-slate-400">SKU: {prod.sku}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {prod.priceType === 'verified' && prod.price ? (
                            <button
                              onClick={() => {
                                addToCart(prod, 1);
                                removeFromWishlist(prod.id);
                              }}
                              className="px-3 py-1.5 text-xs text-white bg-[#31AAA9] rounded font-semibold flex items-center gap-1"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Move to Cart</span>
                            </button>
                          ) : (
                            <Link
                              to={`/quote?product=${encodeURIComponent(prod.name)}`}
                              className="px-3 py-1.5 text-xs text-white bg-slate-900 rounded font-semibold"
                            >
                              Quote
                            </Link>
                          )}
                          <button
                            onClick={() => removeFromWishlist(prod.id)}
                            className="text-xs text-rose-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

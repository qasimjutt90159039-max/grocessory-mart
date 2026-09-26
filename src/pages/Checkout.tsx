import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export const Checkout: React.FC = () => {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address?.street || '',
    city: user?.address?.city || 'Multan',
    postalCode: user?.address?.postalCode || '60000',
    deliveryNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 container mx-auto px-4 text-center">
        <h1 className="font-heading font-bold text-2xl text-slate-900 mb-2">No Items in Cart</h1>
        <p className="text-xs text-slate-500 mb-6">Your shopping cart is currently empty.</p>
        <Link to="/shop" className="px-4 py-2 text-xs font-semibold text-white bg-[#31AAA9] rounded">
          Browse Equipment Catalog
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email
        },
        delivery: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          deliveryNotes: formData.deliveryNotes
        },
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          slug: item.product.slug,
          price: item.product.price || 0,
          priceType: item.product.priceType,
          quantity: item.quantity,
          image: item.product.images[0] || '/assets/tcs_platform.svg'
        })),
        paymentMethod: 'Cash on Delivery'
      };

      const res = await api.createOrder(orderPayload);
      clearCart();
      navigate(`/order-success/${res.orderNumber}`, { state: { order: res.order } });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-8">
          <div>
            <div className="text-xs font-mono text-slate-500 mb-0.5">Order Checkout · Cash on Delivery</div>
            <h1 className="font-heading font-bold text-2xl text-slate-900">
              Confirm &amp; Place Equipment Order
            </h1>
          </div>
          <Link
            to="/cart"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </Link>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Customer & Delivery Information */}
            <div className="lg:col-span-7 space-y-6">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono rounded">
                  {errorMsg}
                </div>
              )}

              {/* Customer Block */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                  1. Customer Details
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Tariq Mehmood"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Phone Number (for Courier &amp; WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 0300-1234567"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. yourname@domain.com"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Block */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                  2. Delivery Address
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Street Address &amp; Shop / Warehouse Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Shop #12, Grain Market or House #5, Street 2"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Multan, Khanewal, Shujabad"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                        placeholder="e.g. 60000"
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Delivery Instructions / Landmarks (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.deliveryNotes}
                      onChange={e => setFormData({ ...formData, deliveryNotes: e.target.value })}
                      placeholder="e.g. Near Chowk Shaheedan, call on arrival, delivery before 5 PM..."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Block */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3 font-mono text-xs">
                <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                  3. Payment Method
                </h2>

                <div className="p-4 bg-[#DDF6F5]/40 border-2 border-[#31AAA9] rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#16706F] text-white flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-slate-500">
                        Pay cash to courier upon physical arrival and inspection.
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#16706F]">Active</span>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                Order Review ({items.length} items)
              </h2>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-slate-50 rounded border p-0.5 flex items-center justify-center shrink-0">
                        <img
                          src={item.product.images[0] || '/assets/tcs_platform.svg'}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 line-clamp-1 block">
                          {item.product.name}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          Qty: {item.quantity} × {item.product.price ? `PKR ${item.product.price.toLocaleString()}` : 'Quote'}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 shrink-0">
                      {item.product.price
                        ? `PKR ${(item.product.price * item.quantity).toLocaleString()}`
                        : 'Quotation'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee:</span>
                  <span>PKR {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
                  <span>Total Due (COD):</span>
                  <span className="text-[#16706F]">PKR {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 text-xs font-bold tracking-wider text-white bg-[#31AAA9] hover:bg-[#16706F] rounded shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <Truck className="w-4 h-4" />
                <span>{loading ? 'CONFIRMING ORDER...' : 'PLACE ORDER (CASH ON DELIVERY)'}</span>
              </button>

              <div className="text-[11px] text-slate-500 font-mono text-center pt-2">
                Aaliyan Trader's Scales · Multan, Punjab
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

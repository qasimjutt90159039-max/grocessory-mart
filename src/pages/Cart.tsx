import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { items, subtotal, deliveryFee, total, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-8 gap-4">
          <div>
            <div className="text-xs font-mono text-slate-500 mb-1">Storefront · Shopping Cart</div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
              Your Equipment Cart
            </h1>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="font-heading font-bold text-lg text-slate-800">Your Cart is Currently Empty</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore our range of TCS/ACS weighing scales, precision tabletop balances, and professional power tools.
            </p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-[#31AAA9] hover:bg-[#16706F] rounded"
            >
              Explore Equipment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items list */}
            <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-mono text-slate-500">
                <span>ITEM DETAILS</span>
                <button onClick={clearCart} className="text-rose-600 hover:underline">
                  Empty Cart
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {items.map(item => (
                  <div key={item.product.id} className="py-4 flex gap-4 items-center">
                    <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={item.product.images[0] || '/assets/tcs_platform.svg'}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="text-[10px] font-mono text-[#16706F]">
                        {item.product.subcategory || item.product.category} · SKU: {item.product.sku}
                      </div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#16706F] line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-xs font-mono font-bold text-slate-800 mt-1">
                        {item.product.price ? `PKR ${item.product.price.toLocaleString()}` : 'Price on Request'}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-300 rounded bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-xs font-mono font-bold text-slate-900 w-24 text-right">
                      {item.product.price
                        ? `PKR ${(item.product.price * item.quantity).toLocaleString()}`
                        : 'Quotation'}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs font-mono text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-slate-900 font-bold">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery:</span>
                  <span className="text-slate-900 font-bold">PKR {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-[#16706F]">PKR {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  to="/checkout"
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-[#31AAA9] hover:bg-[#16706F] rounded flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5 font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#16706F] shrink-0" />
                  <span>Payment Mode: Cash on Delivery (COD)</span>
                </div>
                <p className="text-slate-400">
                  Verify parcel contents and physical condition upon delivery in Multan or nationwide before paying the courier.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

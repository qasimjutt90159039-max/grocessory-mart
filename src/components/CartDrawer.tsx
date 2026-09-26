import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    discount,
    total,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (!isDrawerOpen) return null;

  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F0FDF4]/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#16A34A]" />
              <h2 className="font-heading font-bold text-base text-[#171717]">
                Grocery Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-[#DCFCE7]/60 px-5 py-2.5 border-b border-[#DCFCE7] text-xs">
            {subtotal >= freeDeliveryThreshold ? (
              <div className="flex items-center gap-1.5 text-[#166534] font-semibold">
                <Check className="w-4 h-4 text-[#16A34A]" />
                <span>You unlocked FREE Local Delivery in Multan!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-neutral-700 font-medium mb-1">
                  <span>Add PKR {amountNeededForFree.toLocaleString()} for Free Delivery</span>
                  <span className="font-bold text-[#166534]">{freeDeliveryProgress}%</span>
                </div>
                <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#16A34A] h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mx-auto mb-4 text-[#16A34A]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-neutral-900">Your grocery basket is empty</p>
                <p className="text-xs text-neutral-500 mt-1 mb-6 max-w-xs mx-auto">
                  Explore fresh rice, atta, tea, pure oil, snacks, and daily household essentials.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#166534] rounded-xl shadow-xs transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = item.product.salePrice || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 pb-3.5 border-b border-neutral-100 last:border-0"
                  >
                    <div className="w-16 h-16 bg-[#F0FDF4]/50 rounded-xl border border-neutral-200 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-red-500 p-0.5"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          {item.product.weight} • PKR {itemPrice.toLocaleString()} each
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#16A34A] rounded-lg bg-[#F0FDF4] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-700 hover:bg-[#DCFCE7]"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#166534]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-700 hover:bg-[#DCFCE7]"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-heading font-extrabold text-sm text-neutral-900">
                          PKR {(itemPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E5E7EB] bg-[#F0FDF4]/30 space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-900 font-semibold">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#16A34A] font-semibold">
                    <span>Coupon Savings</span>
                    <span className="font-mono">- PKR {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee (Multan)</span>
                  <span className="font-mono text-neutral-900">
                    {deliveryFee === 0 ? (
                      <span className="text-[#16A34A] font-bold">FREE</span>
                    ) : (
                      `PKR ${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span className="font-heading font-extrabold text-[#166534]">
                    PKR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="py-2.5 px-3 text-center border border-neutral-300 hover:border-[#16A34A] text-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="py-2.5 px-3 text-center bg-[#16A34A] hover:bg-[#166534] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors"
                >
                  <span>Checkout COD</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-[11px] text-center text-neutral-400">
                Cash on Delivery • Doorstep Inspection
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { X, Check, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, items, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;

  const currentPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 border border-[#E5E7EB] p-6 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 bg-neutral-100 rounded-full z-20 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="bg-[#F0FDF4]/40 rounded-xl p-4 border border-[#E5E7EB] flex items-center justify-center relative">
            <img
              src={product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
              alt={product.name}
              className="max-h-60 max-w-full object-contain"
            />
            {hasDiscount && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                SALE
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                <span className="font-semibold text-emerald-800 uppercase tracking-wider">{product.brand}</span>
                <span className="bg-neutral-100 px-2 py-0.5 rounded font-mono">{product.weight}</span>
              </div>

              <h2 className="font-heading font-bold text-lg text-neutral-900 leading-snug mb-2">
                {product.name}
              </h2>

              <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                {product.shortDescription || product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-xs text-neutral-500 font-semibold">PKR</span>
                <span className="font-heading font-extrabold text-2xl text-neutral-900">
                  {currentPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-neutral-400 line-through">
                    PKR {product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Quick specs / nutrition snippet */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="text-[11px] text-neutral-500 mb-4 bg-[#F0FDF4] p-2.5 rounded-lg border border-[#DCFCE7]">
                  <strong className="text-neutral-700">Ingredients: </strong>
                  {product.ingredients.join(', ')}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                {quantityInCart > 0 ? (
                  <div className="flex-1 flex items-center justify-between bg-[#F0FDF4] border border-[#16A34A] rounded-xl px-3 py-1.5">
                    <button
                      onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-lg text-neutral-700 hover:bg-[#DCFCE7] rounded"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-[#166534]">
                      {quantityInCart} in cart
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-lg text-neutral-700 hover:bg-[#DCFCE7] rounded"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="flex-1 py-2.5 px-4 bg-[#16A34A] hover:bg-[#166534] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                )}

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    inWishlist
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-neutral-200 text-neutral-500 hover:text-rose-600 hover:bg-neutral-50'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-[#16A34A] hover:underline font-semibold flex items-center gap-1"
                >
                  View Full Details & Nutrition <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-neutral-500 font-mono text-[11px]">SKU: {product.sku}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

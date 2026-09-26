import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, items, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;

  const currentPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#16A34A] hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
        {hasDiscount && (
          <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
        {product.isDeal && (
          <span className="bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Sparkles className="w-2.5 h-2.5" /> Deal
          </span>
        )}
        {product.isBestSeller && !hasDiscount && (
          <span className="bg-[#166534] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
            Top Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
          isFavorited
            ? 'bg-rose-50 text-rose-600'
            : 'bg-white/90 text-neutral-400 hover:text-rose-600 hover:bg-white'
        }`}
        title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-label="Wishlist"
      >
        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
      </button>

      {/* Image Container with Original Real Product Photography */}
      <div className="relative pt-[85%] w-full bg-[#F0FDF4]/30 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="absolute inset-0 p-4 flex items-center justify-center">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // Fallback to high quality grocery placeholder
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </Link>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 hover:bg-white text-neutral-700 hover:text-[#16A34A] text-xs font-semibold py-1.5 px-2.5 rounded-lg shadow-md flex items-center gap-1.5"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick View</span>
          </button>
        )}
      </div>

      {/* Details Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Weight Pill */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5">
            <span className="font-semibold text-emerald-800 uppercase tracking-wider">{product.brand}</span>
            <span className="bg-neutral-100 font-medium px-2 py-0.5 rounded text-neutral-600">{product.weight}</span>
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-heading font-bold text-sm text-neutral-900 hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug mb-2"
          >
            {product.name}
          </Link>

          {/* Rating & Stock Indicator */}
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <span>★</span>
              <span className="text-neutral-700">{product.rating.toFixed(1)}</span>
              <span className="text-neutral-400 font-normal text-[11px]">({product.reviewCount})</span>
            </div>

            {product.stockStatus === 'out_of_stock' ? (
              <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                Out of Stock
              </span>
            ) : product.stockStatus === 'low_stock' ? (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                Low Stock
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Check className="w-3 h-3 text-[#16A34A]" /> In Stock
              </span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-neutral-500">PKR</span>
              <span className="font-heading font-extrabold text-lg text-neutral-900 tracking-tight">
                {currentPrice.toLocaleString()}
              </span>
            </div>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                PKR {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity Stepper */}
          {product.stockStatus === 'out_of_stock' ? (
            <button
              disabled
              className="py-1.5 px-3 rounded-xl bg-neutral-100 text-neutral-400 text-xs font-semibold cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center bg-[#F0FDF4] border border-[#16A34A] rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                className="w-7 h-8 flex items-center justify-center text-neutral-700 hover:bg-[#DCFCE7] font-bold text-sm"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-7 text-center font-heading font-bold text-xs text-[#166534]">
                {quantityInCart}
              </span>
              <button
                onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                className="w-7 h-8 flex items-center justify-center text-neutral-700 hover:bg-[#DCFCE7] font-bold text-sm"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className="py-2 px-3.5 rounded-xl bg-[#16A34A] hover:bg-[#166534] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors group-hover:scale-105"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

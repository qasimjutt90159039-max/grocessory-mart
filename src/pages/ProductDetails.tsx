import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  Check,
  Star,
  Clock,
  ArrowLeft,
  Share2,
  ChevronRight
} from 'lucide-react';
import { Product, Review } from '../types';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'details' | 'nutrition' | 'reviews'>('details');

  // Review form
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const { addToCart, items, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const prod = await api.getProductBySlug(slug);
        setProduct(prod);
        setSelectedImage(prod.images[0] || '');

        // Load reviews & related
        const [revData, allProds] = await Promise.all([
          api.getReviews(prod.id),
          api.getProducts({ category: prod.category }),
        ]);
        setReviews(revData);
        setRelatedProducts(allProds.filter((p) => p.id !== prod.id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-neutral-500">Loading product information...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16">
        <div className="container mx-auto px-4 max-w-md text-center">
          <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="font-heading font-bold text-xl text-neutral-800">Product Not Found</h2>
          <p className="text-xs text-neutral-500 mt-2 mb-6">
            The requested grocery item may have been relocated or updated.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#16A34A] text-white text-xs font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;
  const currentPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReviewMessage('Please log in to submit a review.');
      return;
    }
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    setReviewMessage(null);
    try {
      await api.submitReview({
        productId: product.id,
        productName: product.name,
        rating: reviewRating,
        review: reviewComment.trim(),
      });
      setReviewMessage('Review submitted successfully! Thank you for your feedback.');
      setReviewComment('');
      // Reload reviews
      const updated = await api.getReviews(product.id);
      setReviews(updated);
    } catch (err: any) {
      setReviewMessage(err.message || 'Could not submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 flex-wrap">
          <Link to="/" className="hover:text-[#16A34A]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#16A34A]">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#16A34A] capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Details Main Block */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs p-6 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full bg-[#F0FDF4]/30 rounded-2xl border border-neutral-200 p-6 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImage || product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
                {hasDiscount && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 rounded-xl border-2 p-1 bg-white shrink-0 overflow-hidden ${
                        selectedImage === img ? 'border-[#16A34A]' : 'border-neutral-200'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Purchase Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Brand & Weight */}
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span className="font-extrabold text-[#166534] uppercase tracking-wider text-sm">
                    {product.brand}
                  </span>
                  <span className="font-mono bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-md font-semibold">
                    Weight: {product.weight}
                  </span>
                </div>

                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-4 text-xs mb-4">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <span>★</span>
                    <span className="text-neutral-800">{product.rating.toFixed(1)}</span>
                    <span className="text-neutral-400 font-normal">({reviews.length} reviews)</span>
                  </div>
                  <span className="text-neutral-300">•</span>
                  {product.stockStatus === 'in_stock' ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#16A34A]" /> In Stock ({product.stock} units available)
                    </span>
                  ) : (
                    <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="bg-[#F0FDF4]/50 border border-[#DCFCE7] rounded-2xl p-4 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-neutral-500 font-bold">PKR</span>
                    <span className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900">
                      {currentPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-base text-neutral-400 line-through ml-2">
                        PKR {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Inclusive of all local taxes • Cash on Delivery across Multan
                  </p>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                  {product.description || product.shortDescription}
                </p>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 gap-3 text-xs text-neutral-600 mb-6 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">SKU Code:</span>
                    <span className="font-mono font-semibold text-neutral-800">{product.sku}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Category:</span>
                    <span className="font-semibold text-neutral-800 capitalize">
                      {product.category.replace('-', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Subcategory:</span>
                    <span className="font-semibold text-neutral-800">{product.subcategory || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Packaging Unit:</span>
                    <span className="font-semibold text-neutral-800">{product.unit || 'Pack'}</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-11 flex items-center justify-center text-sm font-bold text-neutral-700 hover:bg-neutral-100"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-11 flex items-center justify-center text-sm font-bold text-neutral-700 hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product, quantity)}
                    disabled={product.stockStatus === 'out_of_stock'}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                      product.stockStatus === 'out_of_stock'
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-[#16A34A] hover:bg-[#166534] text-white shadow-emerald-600/20 hover:shadow-lg'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add {quantity} to Cart</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-xl border transition-colors ${
                      isFavorited
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-neutral-300 text-neutral-500 hover:text-rose-600 hover:bg-neutral-50'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Delivery reassurance */}
                <div className="flex items-center gap-3 p-3 bg-[#DCFCE7]/40 rounded-xl text-xs text-[#166534] border border-[#DCFCE7]">
                  <Truck className="w-4 h-4 shrink-0 text-[#16A34A]" />
                  <span>Free local delivery on orders over PKR 2,500. Cash on delivery accepted.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Section: Details / Nutrition / Reviews */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs p-6 lg:p-10 mb-12">
          {/* Tabs header */}
          <div className="flex border-b border-neutral-200 gap-6 mb-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-bold transition-colors relative ${
                activeTab === 'details'
                  ? 'text-[#16A34A] border-b-2 border-[#16A34A]'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Product Description
            </button>
            {product.nutrition && (
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`pb-3 text-sm font-bold transition-colors relative ${
                  activeTab === 'nutrition'
                    ? 'text-[#16A34A] border-b-2 border-[#16A34A]'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Nutrition Facts
              </button>
            )}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition-colors relative ${
                activeTab === 'reviews'
                  ? 'text-[#16A34A] border-b-2 border-[#16A34A]'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <div className="space-y-6 text-sm text-neutral-700 max-w-3xl leading-relaxed">
              <div>
                <h3 className="font-heading font-bold text-base text-neutral-900 mb-2">About This Item</h3>
                <p>{product.description}</p>
              </div>

              {product.ingredients && product.ingredients.length > 0 && (
                <div>
                  <h4 className="font-heading font-bold text-sm text-neutral-900 mb-2">Ingredients</h4>
                  <p className="bg-[#F0FDF4] p-3 rounded-xl border border-[#DCFCE7] text-neutral-800">
                    {product.ingredients.join(', ')}
                  </p>
                </div>
              )}

              {product.storageInstructions && (
                <div>
                  <h4 className="font-heading font-bold text-sm text-neutral-900 mb-2">Storage Instructions</h4>
                  <p className="text-neutral-600">{product.storageInstructions}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Nutrition */}
          {activeTab === 'nutrition' && product.nutrition && (
            <div className="max-w-md bg-[#F0FDF4]/50 border border-[#DCFCE7] rounded-2xl p-6">
              <h3 className="font-heading font-bold text-base text-neutral-900 mb-4 pb-2 border-b border-emerald-200">
                Nutritional Values (Per {product.nutrition.servingSize || 'Serving'})
              </h3>
              <div className="space-y-2 text-xs">
                {product.nutrition.calories && (
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span className="font-bold text-neutral-700">Calories</span>
                    <span className="font-mono font-semibold">{product.nutrition.calories}</span>
                  </div>
                )}
                {product.nutrition.protein && (
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span className="text-neutral-700">Protein</span>
                    <span className="font-mono font-semibold">{product.nutrition.protein}</span>
                  </div>
                )}
                {product.nutrition.fat && (
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span className="text-neutral-700">Total Fat</span>
                    <span className="font-mono font-semibold">{product.nutrition.fat}</span>
                  </div>
                )}
                {product.nutrition.carbs && (
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span className="text-neutral-700">Carbohydrates</span>
                    <span className="font-mono font-semibold">{product.nutrition.carbs}</span>
                  </div>
                )}
                {product.nutrition.sugar && (
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span className="text-neutral-700">Sugars</span>
                    <span className="font-mono font-semibold">{product.nutrition.sugar}</span>
                  </div>
                )}
                {product.nutrition.sodium && (
                  <div className="flex justify-between py-1">
                    <span className="text-neutral-700">Sodium</span>
                    <span className="font-mono font-semibold">{product.nutrition.sodium}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4">No reviews yet for this product. Be the first to review!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-neutral-900">{r.userName}</span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        {'★'.repeat(r.rating)}
                        {'☆'.repeat(5 - r.rating)}
                        {r.verifiedPurchase && (
                          <span className="ml-2 text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-700 pt-1">{r.review}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Form */}
              <div className="bg-[#F0FDF4]/50 border border-[#DCFCE7] p-6 rounded-2xl max-w-xl">
                <h4 className="font-heading font-bold text-sm text-neutral-900 mb-3">Write a Customer Review</h4>
                {reviewMessage && (
                  <div className="p-3 bg-emerald-100 text-[#166534] rounded-xl text-xs font-semibold mb-4">
                    {reviewMessage}
                  </div>
                )}
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Your Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="bg-white border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-800"
                    >
                      <option value="5">★★★★★ (5 - Excellent)</option>
                      <option value="4">★★★★☆ (4 - Very Good)</option>
                      <option value="3">★★★☆☆ (3 - Good)</option>
                      <option value="2">★★☆☆☆ (2 - Fair)</option>
                      <option value="1">★☆☆☆☆ (1 - Poor)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Your Review</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with freshness, taste, or packaging..."
                      required
                      className="w-full bg-white border border-neutral-300 rounded-xl p-3 text-xs text-neutral-800 focus:outline-hidden focus:border-[#16A34A]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="py-2.5 px-5 bg-[#16A34A] hover:bg-[#166534] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-neutral-900 tracking-tight mb-6">
              You May Also Need
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

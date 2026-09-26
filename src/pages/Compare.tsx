import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, SlidersHorizontal, ArrowLeft, Check, X } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

export const Compare: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const specRows = [
    { label: 'Category', render: (p: any) => p.subcategory || p.category },
    { label: 'Capacity', render: (p: any) => p.capacity || 'N/A' },
    { label: 'Graduation / Accuracy', render: (p: any) => p.accuracy || 'N/A' },
    { label: 'Platform Dimension', render: (p: any) => p.platformSize || 'N/A' },
    { label: 'Power Supply', render: (p: any) => p.powerSupply || 'N/A' },
    { label: 'Material', render: (p: any) => p.material || 'N/A' },
    { label: 'Unit', render: (p: any) => p.unit || 'Standard Metric' },
    {
      label: 'Price',
      render: (p: any) =>
        p.priceType === 'verified' && p.price ? (
          <span className="font-bold text-[#16706F]">PKR {p.price.toLocaleString()}</span>
        ) : (
          <span className="text-amber-700 font-semibold">Request Price</span>
        )
    },
    {
      label: 'Stock Availability',
      render: (p: any) =>
        p.stockStatus === 'in_stock' ? (
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> In Stock
          </span>
        ) : (
          <span className="text-slate-500">Call for Stock</span>
        )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
          <div>
            <div className="text-xs font-mono text-slate-500 mb-1">
              Technical Comparison · Multan Equipment Desk
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-slate-900">
              Product Technical Comparison
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalog</span>
            </Link>
            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-mono"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Comparison</span>
              </button>
            )}
          </div>
        </div>

        {compareItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-800">
              No Equipment Selected for Comparison
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              You can compare up to 4 weighing scales or power tools side by side. Browse products in the shop and click the compare icon on any item.
            </p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-[#31AAA9] hover:bg-[#16706F] rounded"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 text-left font-semibold text-slate-500 w-48">
                    Specification
                  </th>
                  {compareItems.map(product => (
                    <th key={product.id} className="p-4 text-left w-64 align-top">
                      <div className="flex flex-col justify-between h-full space-y-3">
                        <div className="relative">
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-rose-600"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="w-20 h-20 bg-[#F8FAFC] rounded border border-slate-200 p-1 mx-auto flex items-center justify-center">
                            <img
                              src={product.images[0] || '/assets/tcs_platform.svg'}
                              alt={product.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block">{product.sku}</span>
                          <Link
                            to={`/product/${product.slug}`}
                            className="font-heading font-bold text-slate-900 hover:text-[#16706F] line-clamp-2"
                          >
                            {product.name}
                          </Link>
                        </div>

                        <div>
                          {product.priceType === 'verified' ? (
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="w-full py-1.5 px-3 text-white bg-[#31AAA9] hover:bg-[#16706F] font-semibold rounded text-[11px] flex items-center justify-center gap-1"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              <span>Add to Cart</span>
                            </button>
                          ) : (
                            <Link
                              to={`/quote?product=${encodeURIComponent(product.name)}`}
                              className="w-full py-1.5 px-3 text-white bg-[#111827] hover:bg-black font-semibold rounded text-[11px] block text-center"
                            >
                              Request Quote
                            </Link>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {specRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-700 bg-slate-50/50">
                      {row.label}
                    </td>
                    {compareItems.map(product => (
                      <td key={product.id} className="p-4 text-slate-800">
                        {row.render(product)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

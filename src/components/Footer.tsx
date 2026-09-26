import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Phone, MapPin, ShieldCheck, Clock, Truck, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14532D] text-white pt-14 pb-8 border-t border-emerald-900">
      <div className="container mx-auto px-4">
        {/* Top Feature Highlights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-emerald-800/80">
          <div className="flex items-center gap-4 bg-emerald-900/50 p-4 rounded-2xl border border-emerald-700/40">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">Everyday Fresh Essentials</h4>
              <p className="text-xs text-emerald-100/70">Quality groceries, flours, oils, tea & household staples.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-emerald-900/50 p-4 rounded-2xl border border-emerald-700/40">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">Cash on Delivery</h4>
              <p className="text-xs text-emerald-100/70">Inspect your order at doorstep before paying cash.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-emerald-900/50 p-4 rounded-2xl border border-emerald-700/40">
            <div className="w-12 h-12 rounded-xl bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-white">Direct Phone Support</h4>
              <p className="text-xs text-emerald-100/70 font-mono">+92 303 0034443 • Quick assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-b border-emerald-800/80">
          {/* Column 1: Verified Business Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-[#14532D] shadow-sm">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                MULTAN MART
              </span>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Your dependable neighborhood grocery store in Multan. Providing everyday food staples, dairy, beverages, snacks, personal care, and household cleaning supplies.
            </p>
            <div className="pt-2 text-xs text-emerald-200/90 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                <span>A 31, Commercial Market, Thana Chowk, A Block, Shah Rukn E Alam Housing Scheme, Multan, Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#22C55E] shrink-0" />
                <a href="tel:+923030034443" className="hover:text-white font-mono transition-colors">
                  +92 303 0034443
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#22C55E] shrink-0" />
                <span>Store Hours: Mon - Sun (8:00 AM - 11:00 PM)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Grocery & Staples */}
          <div>
            <h3 className="font-heading font-semibold text-sm tracking-wider uppercase text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
              Food & Pantry
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <Link to="/shop?category=grocery&subcategory=Rice" className="hover:text-[#22C55E] transition-colors">
                  Basmati Rice & Grains
                </Link>
              </li>
              <li>
                <Link to="/shop?category=grocery&subcategory=Flour" className="hover:text-[#22C55E] transition-colors">
                  Chakki Atta & Fine Flour
                </Link>
              </li>
              <li>
                <Link to="/shop?category=grocery&subcategory=Pulses" className="hover:text-[#22C55E] transition-colors">
                  Daal Chana, Moong & Masoor
                </Link>
              </li>
              <li>
                <Link to="/shop?category=grocery&subcategory=Oil+%26+Ghee" className="hover:text-[#22C55E] transition-colors">
                  Cooking Oils & Banaspati Ghee
                </Link>
              </li>
              <li>
                <Link to="/shop?category=grocery&subcategory=Spices" className="hover:text-[#22C55E] transition-colors">
                  Recipe Masalas & Pure Spices
                </Link>
              </li>
              <li>
                <Link to="/shop?category=dairy-breakfast" className="hover:text-[#22C55E] transition-colors">
                  Fresh Milk, Eggs & Butter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Daily Essentials */}
          <div>
            <h3 className="font-heading font-semibold text-sm tracking-wider uppercase text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
              Everyday Needs
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <Link to="/shop?category=beverages" className="hover:text-[#22C55E] transition-colors">
                  Black Tea, Coffee & Juices
                </Link>
              </li>
              <li>
                <Link to="/shop?category=snacks-packaged" className="hover:text-[#22C55E] transition-colors">
                  Biscuits, Chips & Noodles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=household" className="hover:text-[#22C55E] transition-colors">
                  Laundry Detergents & Cleaners
                </Link>
              </li>
              <li>
                <Link to="/shop?category=personal-care" className="hover:text-[#22C55E] transition-colors">
                  Bar Soaps, Shampoos & Oral Care
                </Link>
              </li>
              <li>
                <Link to="/shop?category=baby-care" className="hover:text-[#22C55E] transition-colors">
                  Baby Diapers & Sensitive Wipes
                </Link>
              </li>
              <li>
                <Link to="/shop?deals=true" className="hover:text-[#22C55E] font-semibold transition-colors">
                  Weekly Fresh Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Help & Location */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-sm tracking-wider uppercase text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
              Customer Care
            </h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Order directly online or call our store in Thana Chowk for urgent requirements.
            </p>
            <div className="space-y-2 text-xs">
              <Link to="/contact" className="inline-flex items-center gap-1.5 text-[#22C55E] hover:underline font-semibold">
                Store Location Map & Direction <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <br />
              <Link to="/about" className="inline-flex items-center gap-1.5 text-emerald-200 hover:text-white">
                About Multan Mart
              </Link>
            </div>
            <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50 text-[11px] text-emerald-200 space-y-1">
              <p className="font-semibold text-white">Local Multan Delivery</p>
              <p>Free delivery on orders over PKR 2,500. Standard local delivery PKR 150.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Exact Business Details */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/70 gap-4">
          <p>© {new Date().getFullYear()} Multan Mart. All rights reserved.</p>
          <p className="font-mono text-center sm:text-right">
            Shah Rukn E Alam Housing Scheme • Multan, Punjab, Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
};

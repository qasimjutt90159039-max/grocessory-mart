import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, MapPin, Phone, MessageSquare, Wrench, Shield, CheckCircle } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#DDF6F5] text-[#16706F] text-xs font-mono font-semibold">
            ESTABLISHED 2011 · MULTAN
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
            AALIYAN TRADER'S SCALES
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Professional weighing solutions, power tools, and hardware products with dedicated weighing scale repair services.
          </p>
        </div>

        {/* Core Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-heading font-bold text-xl text-slate-900 mb-2">
              Business Profile &amp; Location
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Established in <strong>2011</strong>, <strong>Aaliyan Trader's Scales</strong> is located at <strong>Shop #553, Chowk Shaheedan, Akbar Road, Multan, Punjab, Pakistan</strong>. The business operates as a specialized supplier and repair facility for commercial and industrial weighing systems, hardware tools, and workshop power equipment.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-slate-900 mb-3">
              Core Operations &amp; Publicly Listed Offerings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#16706F] shrink-0 mt-0.5" />
                <span>Electric Weighing Scales &amp; Precision Balances</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#16706F] shrink-0 mt-0.5" />
                <span>TCS Industrial Platform Scales</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#16706F] shrink-0 mt-0.5" />
                <span>ACS Commercial Price Computing Scales</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#16706F] shrink-0 mt-0.5" />
                <span>Digital Crane &amp; Hanging Scales</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#16706F] shrink-0 mt-0.5" />
                <span>Weighing Scale Repair Services</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#16706F] shrink-0 mt-0.5" />
                <span>Professional Impact Drills &amp; Electric Blowers</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="text-slate-600">
              <span className="font-bold text-slate-900 block">Verified Physical Shop:</span>
              Shop #553, Chowk Shaheedan, Akbar Road, Multan
            </div>
            <div className="flex gap-2">
              <a
                href="tel:0614571748"
                className="px-4 py-2 bg-slate-900 text-white rounded font-semibold hover:bg-slate-800"
              >
                061-4571748
              </a>
              <a
                href="https://wa.me/923343064042"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#16706F] text-white rounded font-semibold hover:bg-[#31AAA9]"
              >
                0334-3064042
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

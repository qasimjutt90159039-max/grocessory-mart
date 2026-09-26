import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Shield, CheckCircle2, Phone, MessageSquare, ArrowRight, Clock, Building } from 'lucide-react';
import { api } from '../api';

export const Quote: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillProduct = searchParams.get('product') || '';
  const prefillSku = searchParams.get('sku') || '';
  const prefillQty = searchParams.get('qty') || '1';

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    productName: prefillProduct ? `${prefillProduct}${prefillSku ? ` (${prefillSku})` : ''}` : '',
    quantity: Number(prefillQty) || 1,
    requirements: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submittedQuote, setSubmittedQuote] = useState<{ quoteNumber: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.submitQuote(formData);
      setSubmittedQuote({ quoteNumber: res.quoteNumber });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit quote request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF6F5] text-[#16706F] text-xs font-mono font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>COMMERCIAL &amp; B2B QUOTATIONS</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
            Request an Equipment Quotation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Aaliyan Trader's Scales provides tailored pricing for commercial weighing scales, bulk workshop power tools, and hardware supplies in Multan and across Pakistan.
          </p>
        </div>

        {submittedQuote ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900">
              Quotation Request Received
            </h2>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-mono text-xs text-slate-700">
              Quote Reference: <span className="font-bold text-[#16706F]">{submittedQuote.quoteNumber}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thank you. Our sales desk will verify current inventory and deliver a formal quotation to your phone/WhatsApp and email.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#31AAA9] hover:bg-[#16706F] rounded"
              >
                Continue Browsing Catalog
              </Link>
              <a
                href="https://wa.me/923343064042"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#16706F]" />
                <span>Follow Up via WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded bg-rose-50 text-rose-700 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Muhammad Rizwan"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Company / Organization Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Multan Grain Traders"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Phone Number (WhatsApp preferred) *
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
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. buyer@company.com"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Product Name or Model *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.productName}
                      onChange={e => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="e.g. TCS 300kg Platform Scale / ACS Price Computing"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) || 1 })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Technical Requirements &amp; Calibration Specs
                  </label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Specify target capacity, required platform size, battery runtime needs, or environment (warehouse, flour mill, mandi)..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Additional Delivery / Procurement Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Delivery destination city, requested timeline, or payment terms..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 text-xs sm:text-sm font-bold tracking-wider text-white bg-[#31AAA9] hover:bg-[#16706F] rounded shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>{loading ? 'SUBMITTING REQUEST...' : 'SUBMIT QUOTE REQUEST'}</span>
                </button>
              </form>
            </div>

            {/* Sidebar Information */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 font-mono text-xs">
                <h3 className="font-heading font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Direct B2B Procurement
                </h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-[#16706F] shrink-0 mt-0.5" />
                    <span>Shop #553, Chowk Shaheedan, Akbar Road, Multan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#16706F] shrink-0" />
                    <span>061-4571748</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#16706F] shrink-0" />
                    <span>WhatsApp: 0334-3064042</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500">
                  • Quote turnaround typically within 2-4 shop hours.<br />
                  • Commercial bulk discounts for 3+ units.<br />
                  • Local calibration verified prior to dispatch.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

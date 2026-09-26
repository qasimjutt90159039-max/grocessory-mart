import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await api.submitContact(formData);
      setSent(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10 space-y-2">
          <div className="text-xs font-mono text-[#16706F] uppercase tracking-wider font-semibold">
            GET IN TOUCH
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
            AALIYAN TRADER'S SCALES
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Contact our sales or workshop desk at Chowk Shaheedan, Multan. We assist retail buyers and commercial procurement teams directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & Action Buttons */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs font-mono text-xs">
              <h2 className="font-heading font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
                Verified Store Coordinates
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#16706F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Physical Address:</span>
                    <span className="text-slate-600 leading-relaxed block">
                      Shop #553, Chowk Shaheedan, Akbar Road, Multan, Punjab, Pakistan
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#16706F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Primary Telephone:</span>
                    <a href="tel:0614571748" className="text-slate-800 hover:text-[#16706F] font-semibold text-sm">
                      061-4571748
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-[#16706F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Mobile / WhatsApp:</span>
                    <a
                      href="https://wa.me/923343064042"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#16706F] hover:underline font-semibold text-sm"
                    >
                      0334-3064042
                    </a>
                  </div>
                </div>
              </div>

              {/* Three Mandatory Quick Buttons */}
              <div className="pt-2 space-y-2">
                <a
                  href="tel:0614571748"
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#111827] hover:bg-black rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>CALL NOW (061-4571748)</span>
                </a>

                <a
                  href="https://wa.me/923343064042"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#16706F] hover:bg-[#31AAA9] rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WHATSAPP (0334-3064042)</span>
                </a>

                <a
                  href="https://maps.google.com/?q=Shop+553+Chowk+Shaheedan+Akbar+Road+Multan+Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>GET DIRECTIONS</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="font-heading font-bold text-lg text-slate-900 mb-1">
              Send a Message to Aaliyan Trader's Scales
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Inquiries regarding equipment availability, specifications, or repair estimates.
            </p>

            {sent ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-heading font-bold text-base text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Thank you for contacting Aaliyan Trader's Scales. Our staff will respond via phone or WhatsApp.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded hover:bg-slate-200"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded bg-rose-50 text-rose-700 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Phone / WhatsApp *</label>
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
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. contact@domain.com"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry or requirement..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 text-xs sm:text-sm font-bold tracking-wider text-white bg-[#31AAA9] hover:bg-[#16706F] rounded shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'SENDING...' : 'SEND INQUIRY'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

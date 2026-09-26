import React, { useState } from 'react';
import { Wrench, Phone, MessageSquare, CheckCircle2, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import { api } from '../api';

export const RepairServices: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    scaleType: 'TCS Platform Weighing Scale',
    problem: '',
    location: '',
    preferredContactMethod: 'phone' as 'phone' | 'whatsapp',
    additionalDetails: ''
  });

  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<{ repairNumber: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.submitRepair(formData);
      setSubmittedTicket({ repairNumber: res.repairNumber });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit repair request');
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
            <Wrench className="w-3.5 h-3.5" />
            <span>MULTAN WORKSHOP FACILITY</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900">
            WEIGHING SCALE REPAIR SERVICES
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Weighing scale repair services are offered by Aaliyan Trader's Scales. We diagnose mechanical, display, and electronic sensor faults on commercial, retail, and industrial scales at our Akbar Road workshop.
          </p>
        </div>

        {submittedTicket ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-heading font-bold text-xl text-slate-900">
              Repair Request Logged
            </h2>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-mono text-xs text-slate-700">
              Ticket Number: <span className="font-bold text-[#16706F]">{submittedTicket.repairNumber}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our technician has received your ticket details. We will contact you via {formData.preferredContactMethod.toUpperCase()} to advise whether to bring the scale into Shop #553 or arrange technical guidance.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:0614571748"
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#111827] hover:bg-black rounded flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Workshop: 061-4571748</span>
              </a>
              <a
                href="https://wa.me/923343064042"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#16706F] hover:bg-[#31AAA9] rounded flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Workshop</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
              <h2 className="font-heading font-bold text-lg text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Submit Scale Repair Ticket
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded bg-rose-50 text-rose-700 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Kashif Ali"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0321-9876543"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Scale Type *
                    </label>
                    <select
                      value={formData.scaleType}
                      onChange={e => setFormData({ ...formData, scaleType: e.target.value })}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    >
                      <option value="TCS Platform Weighing Scale">TCS Platform Weighing Scale</option>
                      <option value="ACS Commercial Price Computing Scale">ACS Commercial Price Computing Scale</option>
                      <option value="Digital Hanging / Crane Scale">Digital Hanging / Crane Scale</option>
                      <option value="Electric Tabletop Scale">Electric Tabletop Scale</option>
                      <option value="Kitchen / Gram Scale">Kitchen / Gram Scale</option>
                      <option value="Heavy Floor Platform Scale">Heavy Floor Platform Scale</option>
                      <option value="Other Weighing Scale">Other Weighing Scale</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Customer City / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Chowk Shaheedan / Cantt Multan / Shujabad"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Describe Fault or Problem in Detail *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.problem}
                    onChange={e => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="e.g. Readout flickering, inaccurate reading under load, unit not charging, error code Err-01..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:border-[#31AAA9]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-4 pt-1 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          checked={formData.preferredContactMethod === 'phone'}
                          onChange={() => setFormData({ ...formData, preferredContactMethod: 'phone' })}
                        />
                        <span>Phone Call (061-4571748)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          checked={formData.preferredContactMethod === 'whatsapp'}
                          onChange={() => setFormData({ ...formData, preferredContactMethod: 'whatsapp' })}
                        />
                        <span>WhatsApp (0334-3064042)</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@domain.com"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Additional Details
                  </label>
                  <textarea
                    rows={2}
                    value={formData.additionalDetails}
                    onChange={e => setFormData({ ...formData, additionalDetails: e.target.value })}
                    placeholder="Approximate scale capacity, brand name if known, urgency..."
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 text-xs sm:text-sm font-bold tracking-wider text-white bg-[#16706F] hover:bg-[#31AAA9] rounded shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>{loading ? 'LOGGING TICKET...' : 'REQUEST REPAIR'}</span>
                </button>
              </form>
            </div>

            {/* Sidebar Notice & Workshop Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 font-mono text-xs space-y-4">
                <h3 className="font-heading font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Workshop Intake Policy
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Weighing scale repair services are offered by our business. Scales can be brought directly to our Multan shop counter for physical inspection.
                </p>

                <div className="space-y-2 border-t border-slate-100 pt-3 text-slate-700">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#16706F] shrink-0 mt-0.5" />
                    <span>Shop #553, Chowk Shaheedan, Akbar Road, Multan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#16706F] shrink-0" />
                    <span>Tel: 061-4571748</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#16706F] shrink-0" />
                    <span>WhatsApp: 0334-3064042</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500">
                  Notice: We evaluate each scale upon receipt. Specific repair costs and part availability are confirmed following technical diagnosis.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

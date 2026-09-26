import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Phone, ArrowRight, Printer } from 'lucide-react';
import { Order } from '../types';
import { api } from '../api';

export const OrderSuccess: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>((location.state as any)?.order || null);

  useEffect(() => {
    async function loadOrder() {
      if (!order && orderNumber) {
        try {
          const data = await api.getOrder(orderNumber);
          setOrder(data);
        } catch (e) {
          console.error(e);
        }
      }
    }
    loadOrder();
  }, [order, orderNumber]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono uppercase text-[#16706F] font-bold">
              ORDER REGISTERED
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your order has been recorded in our system and is being processed for dispatch.
            </p>
          </div>

          {/* Reference badge */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg font-mono text-xs text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Order Number: <strong className="text-slate-950">{orderNumber || order?.orderNumber}</strong>
            </span>
            <span className="text-emerald-700 font-semibold">
              Payment: Cash on Delivery
            </span>
          </div>

          {order && (
            <div className="text-left border border-slate-100 rounded-lg p-4 bg-[#F8FAFC] space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-800">
                <span>Customer &amp; Destination:</span>
                <span>{order.customer.fullName} ({order.customer.phone})</span>
              </div>
              <div className="text-slate-600">
                {order.delivery.address}, {order.delivery.city} {order.delivery.postalCode}
              </div>
              <div className="divide-y divide-slate-200 pt-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between">
                    <span>{item.quantity}x {item.productName}</span>
                    <span className="font-bold">PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount Due on Delivery:</span>
                <span className="text-[#16706F]">PKR {order.total.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-[#31AAA9] hover:bg-[#16706F] rounded"
            >
              Continue Shopping
            </Link>
            <Link
              to="/account/orders"
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
            >
              Track in Customer Account
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
            Questions regarding your order? Contact our Akbar Road shop at 061-4571748 or WhatsApp 0334-3064042.
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch, MessageCircle, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import { orderService } from '../services/api';
import { useShopData } from '../context/ShopDataContext';
import { useCart } from '../context/CartContext';

const STATUS_ICONS = {
  PENDING: Clock,
  PAID: CheckCircle2,
  PROCESSING: Clock,
  SHIPPED: Truck,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle2,
  FAILED: XCircle,
  CANCELLED: XCircle,
};

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const { settings } = useShopData();
  const { clearCart } = useCart();

  const [form, setForm] = useState({ orderNumber: searchParams.get('order') || '', email: '', phone: '' });
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const lookupOrder = useCallback(async ({ orderNumber, email, phone }) => {
    setError('');
    setLoading(true);
    try {
      const data = await orderService.trackOrder({ orderNumber, email, phone });
      setOrder(data.order);
    } catch (err) {
      setOrder(null);
      setError(err.response?.data?.message || 'No matching order was found. Double-check your order number and contact details.');
    } finally {
      setLoading(false);
    }
  }, []);

  // On return from Cashfree checkout: verify payment status, then auto
  // look the order up using the contact details saved before redirecting.
  useEffect(() => {
    const orderFromUrl = searchParams.get('order');
    if (!orderFromUrl) return;

    let saved = null;
    try {
      saved = JSON.parse(sessionStorage.getItem('vetri_last_checkout') || 'null');
    } catch {
      saved = null;
    }

    async function verifyAndLookup() {
      setVerifying(true);
      try {
        await orderService.verifyPayment(orderFromUrl);
      } catch {
        // Fall through to lookup regardless — the order may already be verified
      }
      setVerifying(false);

      if (saved && saved.orderNumber === orderFromUrl) {
        setForm({ orderNumber: orderFromUrl, email: saved.email || '', phone: saved.phone || '' });
        lookupOrder({ orderNumber: orderFromUrl, email: saved.email, phone: saved.phone });
        sessionStorage.removeItem('vetri_last_checkout');
        clearCart();
      }
    }

    verifyAndLookup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    lookupOrder(form);
  };

  const cleanWhatsAppNum = (settings?.whatsapp_number || '').replace(/[^0-9]/g, '');
  const whatsappTrackUrl = order
    ? `https://wa.me/${cleanWhatsAppNum}?text=${encodeURIComponent(
        `Hello, I'd like an update on my order ${order.order_number} (Status: ${order.status_display}).`
      )}`
    : '#';

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#B8945A]/10 border border-[#B8945A] text-[#B8945A] mb-4">
          <PackageSearch className="w-5 h-5" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1C1A] mb-2">Track Your Order</h1>
        <p className="text-sm font-medium text-[#5C574F]">Enter your order number along with the email or phone used at checkout.</p>
      </div>

      {verifying && (
        <div className="mb-6 p-3 bg-[#B8945A]/10 border border-[#B8945A]/40 text-[#1E1C1A] text-sm font-semibold text-center">
          Confirming your payment with Cashfree...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FFFDF9] border border-[#E8DDCD] p-6 sm:p-8 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          name="orderNumber"
          required
          value={form.orderNumber}
          onChange={handleChange}
          placeholder="Order Number (VET-123456)"
          className="px-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-base font-medium text-[#1E1C1A] focus:outline-none focus:border-[#B8945A] sm:col-span-1"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email used at checkout"
          className="px-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-base font-medium text-[#1E1C1A] focus:outline-none focus:border-[#B8945A] sm:col-span-1"
        />
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Or phone used at checkout"
          className="px-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-base font-medium text-[#1E1C1A] focus:outline-none focus:border-[#B8945A] sm:col-span-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-3 py-3 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-sm font-bold tracking-[0.2em] uppercase transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold mb-8 text-center">{error}</div>}

      {order && (
        <div className="bg-[#FFFDF9] border border-[#E8DDCD] p-6 sm:p-8">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6 pb-6 border-b border-[#E8DDCD]">
            <div>
              <p className="font-serif text-2xl text-[#1E1C1A]">#{order.order_number}</p>
              <p className="text-sm font-medium text-[#5C574F]">Placed on {new Date(order.created_at).toLocaleDateString('en-IN')}</p>
            </div>
            <span className="text-sm uppercase tracking-wider font-bold text-white bg-[#B8945A] px-3 py-1.5">
              {order.status_display}
            </span>
          </div>

          {/* Timeline */}
          <div className="space-y-4 mb-6">
            {(order.timeline || []).map((event, idx) => {
              const Icon = STATUS_ICONS[event.status] || Clock;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-[#B8945A] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-base font-bold text-[#1E1C1A]">{event.status_display}</p>
                    {event.note && <p className="text-sm font-medium text-[#5C574F]">{event.note}</p>}
                    <p className="text-xs text-[#5C574F]/70">{new Date(event.created_at).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Items */}
          <div className="space-y-2 pt-4 border-t border-[#E8DDCD] mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm font-medium text-[#1E1C1A]">
                <span>{item.product_name} × {item.quantity}</span>
                <span className="font-bold">₹{parseFloat(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 pt-3 border-t border-[#E8DDCD] text-sm font-semibold text-[#5C574F] mb-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{parseFloat(order.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST + SGST</span>
              <span>₹{parseFloat(order.tax_amount).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold text-[#1E1C1A] pt-2 border-t border-[#E8DDCD] mb-2">
            <span>Total Paid</span>
            <span>₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</span>
          </div>

          {(order.transaction_id || order.payment_method) && (
            <div className="space-y-1 text-sm font-semibold text-[#5C574F] mb-6">
              {order.payment_method && (
                <div className="flex justify-between">
                  <span>Payment Mode</span>
                  <span className="text-[#1E1C1A] font-medium">{order.payment_method}</span>
                </div>
              )}
              {order.transaction_id && (
                <div className="flex justify-between">
                  <span>Transaction ID</span>
                  <span className="text-[#1E1C1A] font-medium">{order.transaction_id}</span>
                </div>
              )}
            </div>
          )}

          <a
            href={whatsappTrackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>GET LIVE UPDATES ON WHATSAPP</span>
          </a>
        </div>
      )}
    </section>
  );
}

import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Lock, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    city: user?.profile?.city || '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(val || 0));

  const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.price) * (item.quantity || 1), 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cart.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        notes: form.notes,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          image_url: item.image_url,
          price: item.price,
          quantity: item.quantity || 1,
        })),
      };

      const data = await orderService.createOrder(payload);

      // Remember contact details so the order-tracking page can auto-verify
      // payment and look the order up when Cashfree redirects back here.
      sessionStorage.setItem(
        'aurelia_last_checkout',
        JSON.stringify({ orderNumber: data.order_number, email: form.email, phone: form.phone })
      );

      if (!window.Cashfree) {
        throw new Error('Payment gateway failed to load. Please check your connection and try again.');
      }

      const cashfree = window.Cashfree({ mode: data.cashfree_env === 'PRODUCTION' ? 'production' : 'sandbox' });
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: '_self',
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to start checkout. Please verify Cashfree test-mode credentials are configured on the server.'
      );
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-[#5C574F] text-sm pt-24">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }

  if (cart.length === 0) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center pt-24 text-center px-4">
        <p className="font-serif text-2xl text-[#1E1C1A] mb-3">Your Shopping Bag is Empty</p>
        <Link to="/" className="px-6 py-2.5 bg-[#1E1C1A] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B8945A] transition-colors">
          Discover Collections
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20">
      <h1 className="font-serif text-3xl sm:text-4xl text-[#1E1C1A] mb-2 text-center">Secure Checkout</h1>
      <p className="text-xs text-[#5C574F] text-center mb-10 flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-[#B8945A]" /> Payments processed securely via Cashfree (Test Mode)
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* Shipping form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4 bg-[#FFFDF9] border border-[#E8DDCD] p-6 sm:p-8">
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">{error}</div>}

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Full Name *</label>
            <input
              type="text" name="name" required value={form.name} onChange={handleChange}
              className="w-full px-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Email *</label>
              <input
                type="email" name="email" required value={form.email} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Phone *</label>
              <input
                type="tel" name="phone" required value={form.phone} onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">City</label>
              <input
                type="text" name="city" value={form.city} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Delivery Address</label>
              <input
                type="text" name="address" value={form.address} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1.5">Order Notes</label>
            <textarea
              name="notes" rows="2" value={form.notes} onChange={handleChange}
              placeholder="e.g. Ring size, gift wrapping..."
              className="w-full px-3 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <Send className="w-4 h-4 text-[#E8DDCD]" />
            <span>{loading ? 'REDIRECTING TO PAYMENT...' : `PAY ${formatPrice(subtotal)} SECURELY`}</span>
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#5C574F] uppercase tracking-wider pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8945A]" />
            <span>256-bit encrypted checkout, powered by Cashfree</span>
          </div>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-[#F8F5F0] border border-[#E8DDCD] p-6 sticky top-28">
            <h2 className="font-serif text-lg text-[#1E1C1A] mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1E1C1A] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#5C574F]">Qty {item.quantity || 1}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#1E1C1A]">
                    {formatPrice(parseFloat(item.price) * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-[#5C574F] pt-3 border-t border-[#E8DDCD] mb-1.5">
              <span>Delivery</span>
              <span className="text-[#B8945A] font-semibold uppercase">Complimentary</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-[#1E1C1A] pt-2 border-t border-[#E8DDCD]">
              <span className="font-serif">Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

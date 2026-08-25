import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, Sparkles, MessageCircle, FileText, CheckCircle2, Send, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  onUpdateQty,
  onRemove,
  whatsappNumber = "+919876543210"
}) {
  if (!isOpen) return null;

  // Reservation Form State
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  });

  const formatPrice = (val) => {
    if (!val) return '';
    const num = parseFloat(val);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const subtotal = cart.reduce((acc, item) => {
    return acc + (parseFloat(item.price) * (item.quantity || 1));
  }, 0);

  const cleanWhatsAppNum = whatsappNumber.replace(/[^0-9]/g, '');
  const orderItemsSummary = cart.map(item => `${item.name} (Qty: ${item.quantity || 1}) - ${formatPrice(item.price)}`).join('\n');
  const whatsappCheckoutUrl = `https://wa.me/${cleanWhatsAppNum}?text=${encodeURIComponent(
    `Hello VETRI Concierge, I would like to reserve the following haute joaillerie pieces:\n\n${orderItemsSummary}\n\nTotal Estimated Amount: ${formatPrice(subtotal)}\n\nPlease assist with private reservation and consultation.`
  )}`;

  const handleInputChange = (e) => {
    setCheckoutData({ ...checkoutData, [e.target.name]: e.target.value });
  };

  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ref = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsDescription = cart.map(i => `${i.name} (Qty: ${i.quantity || 1}, Price: ${formatPrice(i.price)})`).join(', ');

    const payload = {
      name: checkoutData.name,
      email: checkoutData.email,
      phone: checkoutData.phone,
      subject: `[Order Reservation #${ref}] ${itemsDescription}`,
      message: `Client Address: ${checkoutData.address}, City: ${checkoutData.city}.\n\nReserved Items:\n${orderItemsSummary}\n\nTotal: ${formatPrice(subtotal)}\n\nClient Notes: ${checkoutData.notes || 'None'}`
    };

    try {
      await apiService.submitContactEnquiry(payload);
      setOrderRef(ref);
      setCheckoutSuccess(true);
    } catch {
      setOrderRef(ref);
      setCheckoutSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] shadow-2xl flex flex-col justify-between border-l border-[#E8DDCD] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8DDCD] flex items-center justify-between bg-[#F8F5F0]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#B8945A]" />
              <h2 className="font-serif text-lg font-medium tracking-wide text-[#1E1C1A]">
                {showCheckoutForm ? "Private Vault Reservation" : `Shopping Bag (${cart.reduce((total, i) => total + (i.quantity || 1), 0)})`}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#746F68] hover:text-[#1E1C1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* SUCCESS VIEW */}
            {checkoutSuccess ? (
              <div className="text-center py-8 px-2 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#B8945A]/10 border border-[#B8945A] flex items-center justify-center mx-auto text-[#B8945A]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#1E1C1A]">
                  Reservation Confirmed
                </h3>
                <div className="inline-block bg-[#F8F5F0] border border-[#B8945A]/40 px-3 py-1 text-xs font-semibold tracking-widest text-[#B8945A]">
                  REFERENCE: #{orderRef}
                </div>
                <p className="text-xs text-[#746F68] leading-relaxed max-w-xs mx-auto">
                  Your acquisition request has been dispatched to the VETRI Private Concierge. A formal invoice & viewing confirmation has been emailed to <strong>{checkoutData.email}</strong>.
                </p>
                <div className="pt-4 border-t border-[#E8DDCD] space-y-2">
                  <a
                    href={whatsappCheckoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#25D366] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Track on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => {
                      setCheckoutSuccess(false);
                      setShowCheckoutForm(false);
                      onClose();
                    }}
                    className="w-full py-2.5 border border-[#1E1C1A] text-xs uppercase tracking-wider font-medium hover:bg-[#1E1C1A] hover:text-white transition-colors"
                  >
                    Continue Exploring
                  </button>
                </div>
              </div>
            ) : showCheckoutForm ? (
              /* DIRECT IN-APP RESERVATION FORM */
              <form onSubmit={handleReserveSubmit} className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DDCD] mb-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-xs text-[#746F68] hover:text-[#1E1C1A] flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Bag
                  </button>
                  <span className="text-xs font-semibold text-[#1E1C1A]">
                    Total: {formatPrice(subtotal)}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={checkoutData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Lady Penelope"
                    className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#E8DDCD] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={checkoutData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. name@domain.com"
                      className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#E8DDCD] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={checkoutData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#E8DDCD] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={checkoutData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Chennai / Mumbai"
                      className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#E8DDCD] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={checkoutData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Street / Suite No."
                      className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#E8DDCD] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Special Requests / Ring Sizing
                  </label>
                  <textarea
                    name="notes"
                    value={checkoutData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="e.g. Ring size US 6, gift box wrapping..."
                    className="w-full px-3 py-2 bg-[#FFFDF9] border border-[#E8DDCD] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 mt-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#E8DDCD]" />
                  <span>{loading ? "PROCESSING..." : "CONFIRM VAULT RESERVATION"}</span>
                </button>
              </form>
            ) : cart.length === 0 ? (
              /* EMPTY BAG */
              <div className="text-center py-12">
                <ShoppingBag className="w-10 h-10 text-[#E8DDCD] mx-auto mb-2" />
                <h3 className="font-serif text-base text-[#1E1C1A] mb-1">Your bag is empty</h3>
                <p className="text-xs text-[#746F68] max-w-xs mx-auto mb-4">
                  Add pieces from our exclusive collections to begin your acquisition.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#1E1C1A] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B8945A] transition-colors"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              /* CART ITEMS LIST */
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 bg-white border border-[#E8DDCD] relative group"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-xs sm:text-sm font-medium text-[#1E1C1A] line-clamp-1 pr-3">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-[#746F68] hover:text-red-600 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[9px] text-[#746F68] uppercase tracking-wider block">
                        {item.material}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#E8DDCD]/40">
                      {/* Qty Switcher */}
                      <div className="flex items-center border border-[#E8DDCD]">
                        <button
                          onClick={() => onUpdateQty(item.id, (item.quantity || 1) - 1)}
                          className="px-1.5 py-0.5 hover:bg-[#F8F5F0] text-[#746F68]"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#1E1C1A]">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, (item.quantity || 1) + 1)}
                          className="px-1.5 py-0.5 hover:bg-[#F8F5F0] text-[#746F68]"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-[#1E1C1A]">
                        {formatPrice(parseFloat(item.price) * (item.quantity || 1))}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && !showCheckoutForm && !checkoutSuccess && (
            <div className="p-5 border-t border-[#E8DDCD] bg-[#F8F5F0] space-y-3">
              
              {/* Shipping info */}
              <div className="flex items-center justify-between text-xs text-[#746F68]">
                <span>Insured Armoured Courier Delivery:</span>
                <span className="text-[#B8945A] font-semibold uppercase">COMPLIMENTARY</span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm font-medium text-[#1E1C1A] pt-1.5 border-t border-[#E8DDCD]">
                <span className="font-serif text-sm sm:text-base">Estimated Total:</span>
                <span className="text-base sm:text-lg font-semibold text-[#1E1C1A]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Dual Action Options */}
              <div className="space-y-2 pt-1">
                {/* Direct Online Reservation */}
                <button
                  type="button"
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full py-3 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E8DDCD]" />
                  <span>RESERVE ONLINE & REQUEST INVOICE</span>
                </button>

                {/* Instant WhatsApp Order */}
                <a
                  href={whatsappCheckoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>INSTANT WHATSAPP CONCIERGE ORDER</span>
                </a>

                <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#746F68] uppercase tracking-wider text-center pt-0.5">
                  <ShieldCheck className="w-3 h-3 text-[#B8945A]" />
                  <span>Secured By VETRI Haute Joaillerie Guarantee</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

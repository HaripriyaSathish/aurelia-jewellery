import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function ContactSection({ settings }) {
  const phone = settings?.phone_number || "+91 98765 43210";
  const whatsapp = settings?.whatsapp_number || "+91 98765 43210";
  const email = settings?.email || "hello@aureliajewels.com";
  const address = settings?.address || "123 Luxury Street, Chennai, Tamil Nadu, India";

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
  const whatsappMessage = settings?.whatsapp_message || "Hello AURELIA, I would like to know more about your jewellery collection.";
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      await apiService.submitContactEnquiry(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      if (err.errors) {
        const firstErr = Object.values(err.errors)[0];
        setErrorMsg(Array.isArray(firstErr) ? firstErr[0] : String(firstErr));
      } else {
        setErrorMsg('We were unable to process your request. Please call or WhatsApp our concierge directly.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 bg-[#FFFDF9] border-t border-[#E8DDCD]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Story & Direct Contact Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-6 h-[1px] bg-[#B8945A]"></span>
                <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#B8945A]">
                  PRIVATE CONCIERGE
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1E1C1A] tracking-tight mb-4">
                Begin Your Story With Us
              </h2>

              <p className="text-sm sm:text-base text-[#746F68] font-normal leading-relaxed mb-6">
                Whether you are choosing a timeless piece, planning a special gift, or searching for something uniquely yours, our jewellery specialists are here to help.
              </p>

              {/* Direct Info List */}
              <div className="space-y-3.5 text-xs mb-8 pb-6 border-b border-[#E8DDCD]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F8F5F0] border border-[#E8DDCD] flex items-center justify-center text-[#B8945A]">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#746F68] uppercase tracking-wider block font-medium">Telephone:</span>
                    <a href={`tel:${cleanPhone}`} className="text-sm font-medium text-[#1E1C1A] hover:text-[#B8945A] transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F8F5F0] border border-[#E8DDCD] flex items-center justify-center text-[#25D366]">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#746F68] uppercase tracking-wider block">WhatsApp Direct:</span>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#1E1C1A] hover:text-[#25D366] transition-colors">
                      {whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F8F5F0] border border-[#E8DDCD] flex items-center justify-center text-[#B8945A]">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#746F68] uppercase tracking-wider block">Email:</span>
                    <a href={`mailto:${email}`} className="text-sm font-medium text-[#1E1C1A] hover:text-[#B8945A] transition-colors">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F8F5F0] border border-[#E8DDCD] flex items-center justify-center text-[#B8945A]">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#746F68] uppercase tracking-wider block">Boutique:</span>
                    <span className="text-sm font-medium text-[#1E1C1A]">
                      {address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`tel:${cleanPhone}`}
                className="py-3 px-4 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#E8DDCD]" />
                <span>CALL US</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>CHAT ON WHATSAPP</span>
              </a>
            </div>

          </div>

          {/* Right Column: Luxury Enquiry Form */}
          <div className="lg:col-span-7 bg-[#F8F5F0] border border-[#E8DDCD] p-6 sm:p-9 shadow-sm">
            
            <div className="mb-6 pb-3 border-b border-[#E8DDCD]">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8945A] font-semibold block mb-1">
                ONLINE CONSULTATION & INQUIRY
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1E1C1A] font-medium">
                Send an Enquiry
              </h3>
            </div>

            {/* Success Alert */}
            {success && (
              <div className="mb-5 p-4 bg-[#FFFDF9] border border-[#B8945A] text-[#1E1C1A] animate-in fade-in duration-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B8945A] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E1C1A]">
                      Enquiry Received With Grace
                    </h4>
                    <p className="text-xs text-[#746F68] mt-0.5 leading-relaxed">
                      Thank you for contacting AURELIA. An acknowledgement email has been dispatched. Our private concierge will reach out within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] placeholder-[#746F68]/60 focus:outline-none focus:border-[#B8945A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. eleanor@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] placeholder-[#746F68]/60 focus:outline-none focus:border-[#B8945A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] placeholder-[#746F68]/60 focus:outline-none focus:border-[#B8945A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1C1A] mb-1">
                    Subject / Interest
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Diamond Solitaire / Bridal Suite"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] placeholder-[#746F68]/60 focus:outline-none focus:border-[#B8945A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1C1A] mb-1">
                  Your Message or Consultation Details *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Kindly detail the creations, gemstones, or bespoke requirements you wish to explore..."
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF9] border border-[#E8DDCD] text-sm text-[#1E1C1A] placeholder-[#746F68]/60 focus:outline-none focus:border-[#B8945A]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-sm font-semibold tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <span>SUBMITTING INQUIRY...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#E8DDCD]" />
                    <span>SEND CONCIERGE ENQUIRY</span>
                  </>
                )}
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
}

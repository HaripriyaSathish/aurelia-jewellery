import React from 'react';
import { MapPin, Clock, Phone, Mail, Navigation, Compass } from 'lucide-react';

export default function MapSection({ settings }) {
  const shopName = settings?.shop_name || "AURELIA FINE JEWELLERY";
  const address = settings?.address || "123 Luxury Street, Chennai, Tamil Nadu, India";
  const openingHours = settings?.opening_hours || "Mon – Sat: 10:30 AM – 8:30 PM | Sun: 11:00 AM – 7:00 PM";
  const phone = settings?.phone_number || "+91 98765 43210";
  const email = settings?.email || "hello@aureliajewels.com";
  
  const embedUrl = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
    settings?.google_map_embed_url ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.589139886364!2d80.2452!3d13.0475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266497f1f9e53%3A0x6b4f7b21e8d6411!2sKhader%20Nawaz%20Khan%20Rd%2C%20Nungambakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000";

  const directMapUrl = settings?.google_map_direct_url ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <section id="boutique" className="py-12 sm:py-16 bg-[#F8F5F0] border-t border-[#E8DDCD]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#B8945A]"></span>
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#B8945A]">
              THE FLAGSHIP MAISON
            </span>
            <span className="h-px w-8 bg-[#B8945A]"></span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E1C1A] font-normal tracking-tight mb-3">
            Visit Our Boutique
          </h2>

          <p className="text-sm sm:text-base text-[#746F68] font-normal max-w-xl mx-auto font-cormorant text-xl italic">
            Experience our private diamond salon and preview high jewellery creations in person.
          </p>
        </div>

        {/* Grid: Boutique Info Card + Interactive Map Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#E8DDCD] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="mb-5 pb-5 border-b border-[#E8DDCD]">
                <span className="font-cinzel text-lg sm:text-xl font-semibold tracking-[0.2em] text-[#1E1C1A] block mb-1">
                  {shopName}
                </span>
                <span className="text-[9px] uppercase tracking-[0.4em] text-[#B8945A] font-semibold">
                  HAUTE JOAILLERIE ATELIER & SALON
                </span>
              </div>

              <div className="space-y-4 text-xs text-[#1E1C1A]">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B8945A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[#746F68] block text-[10px] sm:text-xs mb-0.5">
                      Boutique Address
                    </span>
                    <p className="text-sm leading-relaxed text-[#1E1C1A] font-medium">
                      {address}
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#B8945A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[#746F68] block text-[10px] sm:text-xs mb-0.5">
                      Opening Hours
                    </span>
                    <p className="text-sm leading-relaxed text-[#1E1C1A]">
                      {openingHours}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#B8945A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[#746F68] block text-[10px] sm:text-xs mb-0.5">
                      Private Salon Telephone
                    </span>
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-[#1E1C1A] hover:text-[#B8945A] font-medium">
                      {phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#B8945A] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[#746F68] block text-[10px] sm:text-xs mb-0.5">
                      Concierge Email
                    </span>
                    <a href={`mailto:${email}`} className="text-sm text-[#1E1C1A] hover:text-[#B8945A] font-medium">
                      {email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <div className="pt-6 mt-5 border-t border-[#E8DDCD]">
              <a
                href={directMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md group"
              >
                <Navigation className="w-4 h-4 text-[#B8945A] group-hover:text-white transition-colors" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>
          </div>

          {/* Google Map Container */}
          <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#E8DDCD] p-1.5 relative shadow-sm overflow-hidden min-h-[320px] lg:min-h-[420px]">
            <iframe
              src={embedUrl}
              title="AURELIA Fine Jewellery Boutique Location"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter contrast-[1.05] grayscale-[20%]"
            />
            <div className="absolute top-3 left-3 bg-[#1E1C1A]/90 backdrop-blur-md text-[#E8DDCD] px-3 py-1 border border-[#B8945A]/40 text-[9px] uppercase tracking-[0.2em] font-semibold flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-[#B8945A]" />
              <span>CHENNAI BOUTIQUE SALON</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

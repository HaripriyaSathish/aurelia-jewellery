import React from 'react';
import { Compass, ArrowUp, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ settings }) {
  const address = settings?.address || "123 Luxury Street, Chennai, Tamil Nadu, India";
  const phone = settings?.phone_number || "+91 98765 43210";
  const email = settings?.email || "hello@aureliajewels.com";
  const instagram = settings?.instagram_url || "https://instagram.com/aureliajewels";
  const facebook = settings?.facebook_url || "https://facebook.com/aureliajewels";
  const pinterest = settings?.pinterest_url || "https://pinterest.com/aureliajewels";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="site-footer" className="bg-[#1E1C1A] text-[#E8DDCD] border-t border-[#B8945A]/30 pt-12 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Header */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-8 border-b border-[#E8DDCD]/15 gap-6">
          <div className="text-center md:text-left">
            <span className="font-cinzel text-xl sm:text-2xl font-semibold tracking-[0.3em] text-white block">
              AURELIA
            </span>
            <span className="text-[9px] tracking-[0.45em] uppercase text-[#B8945A] block mt-0.5 font-light">
              FINE JEWELLERY • HAUTE JOAILLERIE
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Instagram */}
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#E8DDCD]/20 hover:border-[#B8945A] flex items-center justify-center text-[#E8DDCD] hover:text-[#B8945A] transition-colors"
              title="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#E8DDCD]/20 hover:border-[#B8945A] flex items-center justify-center text-[#E8DDCD] hover:text-[#B8945A] transition-colors"
              title="Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href={pinterest}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-[#E8DDCD]/20 hover:border-[#B8945A] flex items-center justify-center text-[#E8DDCD] hover:text-[#B8945A] transition-colors"
              title="Pinterest"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.379-.057.241-.19.291-.441.175-1.656-.77-2.69-3.19-2.69-5.137 0-4.181 3.037-8.024 8.764-8.024 4.601 0 8.177 3.28 8.177 7.662 0 4.572-2.883 8.25-6.885 8.25-1.345 0-2.61-.699-3.042-1.527l-.828 3.153c-.299 1.144-1.109 2.578-1.652 3.456 1.205.372 2.484.574 3.81.574 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
            </a>

            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full bg-[#B8945A]/20 hover:bg-[#B8945A] border border-[#B8945A] flex items-center justify-center text-white transition-all ml-2"
              title="Back to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-[#E8DDCD]/15 text-xs font-light">
          
          {/* Col 1: Shop */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-3.5">
              SHOP
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#bestsellers" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Diamonds
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Gold Creations
                </a>
              </li>
              <li>
                <a href="#bestsellers" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Bridal Suites
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: About */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-3.5">
              ABOUT
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#story" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#craftsmanship" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Atelier Craftsmanship
                </a>
              </li>
              <li>
                <a href="#campaign" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  The Maison Journal
                </a>
              </li>
              <li>
                <a href="#story" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Ethical Sourcing
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-3.5">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#contact" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Contact Concierge
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Complimentary Shipping
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Lifetime Maintenance
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#E8DDCD]/75 hover:text-[#B8945A] transition-colors">
                  Book a Consultation
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Boutique Contact */}
          <div>
            <h4 className="font-serif text-sm font-semibold tracking-wider text-white uppercase mb-3.5">
              CONTACT SALON
            </h4>
            <ul className="space-y-2.5 text-[#E8DDCD]/75">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B8945A] flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B8945A] flex-shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#B8945A]">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B8945A] flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#B8945A]">
                  {email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#E8DDCD]/50 tracking-[0.2em] uppercase gap-3">
          <div>
            © 2026 AURELIA FINE JEWELLERY. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-4 sm:gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>GIA Certification</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

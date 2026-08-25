import React, { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export default function FloatingContactButtons({ settings }) {
  const [bottomOffset, setBottomOffset] = useState(24);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const phone = settings?.phone_number || "+91 98765 43210";
  const whatsapp = settings?.whatsapp_number || "+91 98765 43210";
  const email = settings?.email || "hello@vetrijewels.com";

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
  const whatsappMessage = settings?.whatsapp_message || "Hello VETRI, I would like to know more about your jewellery collection.";
  const whatsappUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;
  const callUrl = `tel:${cleanPhone}`;
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent("Inquiry regarding VETRI Fine Jewellery")}`;

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById('site-footer');
      if (!footer) {
        setBottomOffset(24);
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const defaultGap = 24; // 24px from bottom

      // If footer has entered viewport
      if (footerRect.top < windowHeight) {
        // Distance from bottom of viewport to top of footer
        const overlap = windowHeight - footerRect.top;
        const newBottom = overlap + defaultGap;
        setBottomOffset(newBottom);
      } else {
        setBottomOffset(defaultGap);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const buttons = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Concierge',
      icon: MessageCircle,
      href: whatsappUrl,
      target: '_blank',
      rel: 'noopener noreferrer',
      bgClass: 'bg-[#25D366] text-white hover:bg-[#20ba59] border border-[#25D366]',
      iconClass: 'w-6 h-6 sm:w-6 sm:h-6',
      tooltip: 'Chat on WhatsApp',
    },
    {
      id: 'phone',
      name: 'Call Salon',
      icon: Phone,
      href: callUrl,
      bgClass: 'bg-[#B8945A] text-white hover:bg-[#a38048] border border-[#B8945A]',
      iconClass: 'w-5 h-5 sm:w-6 sm:h-6',
      tooltip: `Call Us: ${phone}`,
    },
    {
      id: 'email',
      name: 'Email Concierge',
      icon: Mail,
      href: mailtoUrl,
      bgClass: 'bg-[#1E1C1A] text-[#E8DDCD] hover:bg-[#2A2724] border border-[#B8945A]/50',
      iconClass: 'w-5 h-5 sm:w-6 sm:h-6 text-[#E8DDCD]',
      tooltip: `Email Us: ${email}`,
    },
  ];

  return (
    <div
      className="fixed right-4 sm:right-6 z-40 flex flex-col items-end gap-3 transition-[bottom] duration-150 ease-out"
      style={{ bottom: `${bottomOffset}px` }}
      aria-label="Floating Contact Channels"
    >
      {buttons.map((btn) => {
        const Icon = btn.icon;
        return (
          <div key={btn.id} className="relative flex items-center group">
            
            {/* Tooltip on Hover */}
            <div
              className={`absolute right-full mr-3.5 px-3 py-1.5 bg-[#1E1C1A] text-[#FFFDF9] text-[11px] font-medium tracking-wider uppercase whitespace-nowrap rounded-none border border-[#B8945A]/40 shadow-xl pointer-events-none transition-all duration-200 ${
                activeTooltip === btn.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {btn.tooltip}
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-[#1E1C1A]" />
            </div>

            {/* Circular Floating Action Button */}
            <a
              href={btn.href}
              target={btn.target}
              rel={btn.rel}
              onMouseEnter={() => setActiveTooltip(btn.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transform hover:scale-108 transition-all duration-300 ${btn.bgClass}`}
              aria-label={btn.name}
            >
              <Icon className={btn.iconClass} />
            </a>

          </div>
        );
      })}
    </div>
  );
}

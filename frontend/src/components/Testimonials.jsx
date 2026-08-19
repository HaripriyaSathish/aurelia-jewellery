import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials({ testimonials = [] }) {
  const defaultTestimonials = [
    {
      id: 1,
      customer_name: "Eleanor Vance",
      customer_title: "Private Collector, London & Mumbai",
      quote: "AURELIA represents the absolute pinnacle of high jewellery craftsmanship. The Celeste necklace was custom-fitted for our gala and the light reflection was simply hypnotic.",
      rating: 5,
      customer_image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 2,
      customer_name: "Rajesh & Priya Sundaram",
      customer_title: "Bridal Suite Clients, Chennai",
      quote: "Choosing our wedding suite at the Chennai boutique was an unforgettable private consultation experience. The attention to detail and diamond grading surpassed every expectation.",
      rating: 5,
      customer_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: 3,
      customer_name: "Claire Delacroix",
      customer_title: "Haute Horlogerie & Jewels Connoisseur, Paris",
      quote: "The Éternelle ring has an understated grandeur rarely found in modern jewel houses. The proportion, metal balance, and stone brilliance are unmatched.",
      rating: 5,
      customer_image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    },
  ];

  const items = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="py-12 sm:py-16 bg-[#FFFDF9] border-t border-[#E8DDCD]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#B8945A]"></span>
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#B8945A]">
              CLIENT VOICES
            </span>
            <span className="h-px w-8 bg-[#B8945A]"></span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E1C1A] font-normal tracking-tight mb-3">
            Words of Adornment
          </h2>

          <p className="text-sm sm:text-base text-[#746F68] font-light max-w-xl mx-auto font-cormorant text-lg italic">
            Reflections from patrons, connoisseurs, and collectors who have made AURELIA a part of their legacy.
          </p>
        </div>

        {/* Editorial Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <div
              key={t.id || t.customer_name}
              className="p-6 sm:p-8 bg-[#F8F5F0] border border-[#E8DDCD] hover:border-[#B8945A] transition-all duration-300 flex flex-col justify-between relative group shadow-sm hover:shadow-md"
            >
              <Quote className="w-7 h-7 text-[#B8945A]/25 absolute top-5 right-5" />

              <div>
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#B8945A] text-[#B8945A]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-cormorant text-base sm:text-lg text-[#1E1C1A] italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E8DDCD]">
                {t.customer_image_url ? (
                  <img
                    src={t.customer_image_url}
                    alt={t.customer_name}
                    className="w-10 h-10 rounded-full object-cover border border-[#B8945A]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#1E1C1A] text-[#E8DDCD] flex items-center justify-center font-serif text-sm">
                    {t.customer_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#1E1C1A]">
                    {t.customer_name}
                  </h4>
                  <span className="text-[9px] sm:text-[10px] text-[#746F68] uppercase tracking-wider block">
                    {t.customer_title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { Truck, ShieldCheck, UserCheck, HeartHandshake } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Complimentary Shipping',
      subtitle: 'Armoured & Insured Courier',
      description: 'Dispatched in discreet, temperature-guarded packaging with comprehensive transit insurance worldwide.',
      icon: Truck,
    },
    {
      title: 'Lifetime Care',
      subtitle: 'Complimentary Cleaning & Servicing',
      description: 'Annual ultrasonic cleaning, prong tightening, and rhodium re-plating for all AURELIA fine jewellery pieces.',
      icon: ShieldCheck,
    },
    {
      title: 'Private Consultation',
      subtitle: 'Boutique or Virtual Suite',
      description: 'Personalized appointments with our certified gemologists to select, style, or commission bespoke creations.',
      icon: UserCheck,
    },
    {
      title: 'Bespoke Commissions',
      subtitle: 'One-of-a-Kind Creations',
      description: 'Collaborate directly with our master designers from 3D gouache rendering to final gemstone setting.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F8F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#B8945A]"></span>
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#B8945A]">
              THE MAISON PROMISE
            </span>
            <span className="h-px w-8 bg-[#B8945A]"></span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E1C1A] font-normal tracking-tight mb-3">
            A World of Extraordinary Service
          </h2>

          <p className="text-sm text-[#746F68] font-normal max-w-xl mx-auto font-cormorant text-xl italic">
            Your journey with AURELIA extends far beyond the moment of acquisition.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 bg-[#FFFDF9] border border-[#E8DDCD] hover:border-[#B8945A] transition-all duration-300 text-center flex flex-col items-center justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#F8F5F0] border border-[#E8DDCD] flex items-center justify-center mb-4 group-hover:bg-[#B8945A] group-hover:border-[#B8945A] transition-colors">
                    <Icon className="w-5 h-5 text-[#B8945A] group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-medium text-[#1E1C1A] mb-1">
                    {service.title}
                  </h3>

                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8945A] mb-2">
                    {service.subtitle}
                  </div>

                  <p className="text-sm text-[#746F68] font-normal leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Clock } from 'lucide-react';
import heroDoctorImg from '../../assets/hero-doctor.jpg';

interface HeroSectionProps {
  onShopNow: () => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopNow, onLearnMore }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/20 to-cyan-50/30 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold tracking-wide border border-teal-200">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              Centralized Healthcare Restocking Network
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Trusted Partner <br className="hidden sm:inline" />
              <span className="text-slate-900">in Healthcare Supply</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Quality medicines, medical supplies and healthcare essentials for hospitals, pharmacies, clinics and individuals.
            </p>

            {/* CTAs matching Project.png */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-teal-600/25 hover:shadow-teal-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLearnMore}
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-300 shadow-sm transition-all hover:border-slate-400"
              >
                Learn More
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>100% Genuine DGHS Verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Truck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Cold-Chain Express Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                <span>24/7 Hospital Supply Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Doctor Visual matching Project.png */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Subtle background glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-teal-400/20 to-cyan-300/30 rounded-3xl blur-2xl -z-10 transform rotate-1"></div>

              {/* Main Doctor Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src={heroDoctorImg}
                  alt="Doctor with Stethoscope - Healthcare Supply Partner"
                  className="w-full h-[380px] sm:h-[440px] object-cover object-top hover:scale-102 transition-transform duration-500"
                />

                {/* Floating pill badge on the image */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-white/60 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-sm">
                      +
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Hospital Restocking Network</p>
                      <p className="text-[11px] text-teal-600 font-medium">Direct Manufacturer Sourcing</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


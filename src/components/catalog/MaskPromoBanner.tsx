import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface MaskPromoBannerProps {
  onShopMasks: () => void;
}

export const MaskPromoBanner: React.FC<MaskPromoBannerProps> = ({ onShopMasks }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-100 via-teal-100/70 to-sky-100 border border-cyan-200/80 p-6 sm:p-8 shadow-xs mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        
        {/* Left Text matching Project.png */}
        <div className="sm:col-span-7 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-200/60 text-cyan-900 text-xs font-bold tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-800" />
            Certified Medical Protective Supplies
          </div>

          <div className="space-y-0.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Stay Safe
            </h2>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-teal-700 tracking-tight leading-tight">
              Stay Healthy
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Quality masks for your protection
          </p>

          <div className="pt-2">
            <button
              onClick={onShopMasks}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 group"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Mask Graphic matching Project.png */}
        <div className="sm:col-span-5 flex justify-center sm:justify-end">
          <div className="relative">
            <div className="w-40 h-32 sm:w-56 sm:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-white/80 bg-white/40 backdrop-blur-xs flex items-center justify-center p-2">
              <img
                src="https://images.unsplash.com/photo-1586942593568-29361efcd571?w=600&auto=format&fit=crop&q=80"
                alt="Quality Surgical Mask Protection"
                className="w-full h-full object-cover rounded-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-2 -left-2 bg-white px-2.5 py-1 rounded-lg text-[10px] font-bold text-teal-700 border border-teal-200 shadow-xs">
              95%+ Filtration
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};


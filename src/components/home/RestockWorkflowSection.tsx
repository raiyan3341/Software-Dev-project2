import React from 'react';
import { UserCheck, Search, ShoppingBag, Truck } from 'lucide-react';

interface RestockWorkflowSectionProps {
  onRegisterOrg: () => void;
}

export const RestockWorkflowSection: React.FC<RestockWorkflowSectionProps> = ({ onRegisterOrg }) => {
  const steps = [
    {
      step: '01',
      title: 'Register & Verify',
      desc: 'Submit hospital license, pharmacy trade registration or clinic credentials for official approval.',
      icon: UserCheck,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
    },
    {
      step: '02',
      title: 'Browse Catalog',
      desc: 'Explore authentic medicines with full batch numbers, expiry dates, and bulk institutional pricing.',
      icon: Search,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      step: '03',
      title: 'Submit Restock Order',
      desc: 'Configure item quantities and submit restock requests with instant stock reservation.',
      icon: ShoppingBag,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      step: '04',
      title: 'Delivery & Invoice',
      desc: 'Fast delivery to your medical facility with compliant downloadable invoices and full traceability.',
      icon: Truck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Streamlined Supply Chain
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            How Hospitals & Pharmacies Restock
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            MediStock eliminates fragmented middle-men, offering direct verified supplier procurement for healthcare facilities nationwide.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                className="relative bg-slate-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 border border-slate-200/80 hover:border-teal-500 transition-all hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-5">
                    <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center border ${item.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-lg sm:text-2xl font-black text-slate-300 font-mono">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm text-slate-600 mt-1 sm:mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onRegisterOrg}
            className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all hover:-translate-y-0.5"
          >
            Register Your Medical Organization Now →
          </button>
        </div>
      </div>
    </section>
  );
};


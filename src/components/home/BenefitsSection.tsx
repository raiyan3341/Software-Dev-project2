import React from 'react';
import { ShieldCheck, Database, FileText, CheckCircle2, Award } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: 'DGHS Compliant & Batch-Tracked',
      desc: 'Full visibility on manufacturing lot numbers, national drug administration approvals, and expiry timelines.',
      icon: ShieldCheck,
    },
    {
      title: 'Institutional Bulk Volume Pricing',
      desc: 'Transparent pricing tiers for hospitals, clinics, and retail pharmacies without hidden agent fees.',
      icon: Award,
    },
    {
      title: 'Automated Stock Reservation',
      desc: 'No ghost inventory or unexpected stockouts. Real-time warehouse synchronization prevents duplicate orders.',
      icon: Database,
    },
    {
      title: 'Printable Official Invoices',
      desc: 'Instant compliant tax and audit summaries with complete delivery status histories and order tracking.',
      icon: FileText,
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-100/60 px-3 py-1 rounded-full border border-teal-200">
              Why Healthcare Leaders Choose MediStock
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Modern Infrastructure Built for Healthcare Reliability
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Unlike generic retail marketplaces, MediStock is purpose-engineered to address the critical regulatory, supply chain, and restocking challenges faced by medical institutions in Bangladesh.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                'Strict organization vetting & verification protocols',
                'Emergency medical supply demand priority',
                'Cold-chain temperature sensitive medicine logistics',
                'Separate segregated dashboards for hospitals, clinics & admin',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-400 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};


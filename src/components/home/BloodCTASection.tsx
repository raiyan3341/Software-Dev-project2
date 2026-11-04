import React from 'react';
import { HeartHandshake, Droplet, Search, ShieldCheck } from 'lucide-react';

interface BloodCTASectionProps {
  onFindDonors: () => void;
  onRegisterDonor: () => void;
}

export const BloodCTASection: React.FC<BloodCTASectionProps> = ({
  onFindDonors,
  onRegisterDonor,
}) => {
  return (
    <section className="py-14 bg-gradient-to-r from-rose-50 via-red-50/60 to-pink-50 border-y border-rose-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-200 shadow-xl shadow-rose-900/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold tracking-wide">
              <Droplet className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              Public Humanitarian Initiative
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Donate Blood, Save Lives — <br className="hidden sm:inline" />
              Be a Hero in Your Community
            </h2>

            <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
              Every day, thousands of patients in hospitals need emergency blood transfusions. MediStock connects voluntary blood donors with verified emergency hospital requests across Dhaka, Chittagong, Sylhet, and all divisions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onFindDonors}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-600/25 transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Find Blood Donors
              </button>

              <button
                onClick={onRegisterDonor}
                className="px-6 py-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-semibold text-sm border border-rose-300 shadow-sm transition-all flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-rose-600" />
                Register as a Donor
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-rose-500 to-red-400 p-1 flex items-center justify-center shadow-2xl shadow-rose-600/30 animate-pulse">
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-2">
                  <Droplet className="w-10 h-10 fill-rose-600" />
                </div>
                <span className="text-2xl font-black text-rose-600">1 Bag</span>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Saves Up To 3 Lives</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


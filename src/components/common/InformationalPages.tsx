import React, { useState } from 'react';
import { ShieldCheck, Truck, Clock, Award, Building2, Phone, Mail, MapPin, CheckCircle2, Send } from 'lucide-react';

interface InfoPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<InfoPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            About MediStock
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Centralized Healthcare Supply & Inventory Infrastructure
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MediStock was founded to solve critical supply chain fragmentation across hospitals, clinics, and pharmacies in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Verified Authenticity</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every medical supply item is sourced directly from DGHS-licensed pharmaceutical manufacturers with batch tracking.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Cold-Chain Assurance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Temperature-controlled pharmaceutical logistics maintaining strict cold-chain stability from warehouse to clinic.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Humanitarian Network</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connecting ordinary citizens with emergency volunteer blood donors across all divisional districts.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">National Healthcare Commitment</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike retail e-commerce shops, MediStock provides institutional B2B procurement: batch tracking, expiry date monitoring, computerized inventory synchronization, printable tax invoices, and segregated role access for hospitals, pharmacies, administrators, and super admin owners.
          </p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => onNavigate('register-org')}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs"
            >
              Register Your Hospital / Pharmacy
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              Browse Catalog
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export const ContactPage: React.FC<InfoPageProps> = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
            24/7 Support Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact MediStock Headquarters
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            For emergency supply dispatch, hospital onboarding, and technical assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold">Contact Details</h3>
            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Level 7, Health Tech Tower, Panthapath, Dhaka-1205, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Hotline: +880 9612 000 999 (24/7)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>support@medistock.com.bd</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              <p>Government Directorate General of Health Services (DGHS) verified digital vendor.</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Inquiry Dispatched!</h4>
                <p className="text-xs text-slate-500">Our medical logistics representative will reply within 2 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input type="text" required placeholder="Dr. / Representative Name" className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input type="email" required placeholder="name@organization.com" className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hospital / Establishment Name</label>
                  <input type="text" placeholder="e.g. Popular Diagnostic Centre" className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message / Inquiry *</label>
                  <textarea rows={3} required placeholder="Describe your restocking needs or questions" className="w-full px-3 py-2 bg-slate-50 border rounded-xl" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};


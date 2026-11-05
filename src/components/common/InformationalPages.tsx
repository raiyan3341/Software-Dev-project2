import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  Award,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Send,
  Heart,
  Droplet,
  Users,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Store,
  Crown,
  FileCheck,
  Check,
  Lock,
} from 'lucide-react';

interface InfoPageProps {
  onNavigate: (view: string, categoryFilter?: string) => void;
}

export const AboutPage: React.FC<InfoPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>National Healthcare Digital Infrastructure • Bangladesh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Centralized Medical Supply & Inventory Ecosystem
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            MediStock was engineered to solve critical supply chain fragmentation across hospitals, community pharmacies, and patients in Bangladesh. We connect genuine pharmaceutical manufacturing directly with clinical care.
          </p>
        </div>

        {/* Live Performance & Impact Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-teal-600 tracking-tight">100%</span>
            <p className="text-xs font-bold text-slate-800">DGHS Compliant</p>
            <p className="text-[11px] text-slate-400">Direct licensed manufacturer sourcing</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-teal-600 tracking-tight">64</span>
            <p className="text-xs font-bold text-slate-800">Districts Connected</p>
            <p className="text-[11px] text-slate-400">National coverage across Bangladesh</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-teal-600 tracking-tight">2°–8°C</span>
            <p className="text-xs font-bold text-slate-800">Cold-Chain Monitored</p>
            <p className="text-[11px] text-slate-400">Strict temperature logistics logs</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">24/7</span>
            <p className="text-xs font-bold text-slate-800">Community Blood Support</p>
            <p className="text-[11px] text-slate-400">Zero-cost humanitarian coordination</p>
          </div>
        </div>

        {/* Mission & Vision Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Our Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To eliminate pharmaceutical stockouts, abolish counterfeit medication hazards, and provide transparent institutional pricing for every hospital, clinic, and patient in Bangladesh through modern digital inventory synchronization.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Zero counterfeit tolerance with batch & expiry tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Automated institutional tax invoices and official challans</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Dynamic demand submission for rare and oncology medications</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Our Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We envision a modern, resilient healthcare ecosystem where no hospital bed lacks emergency medicines, no patient suffers from supply chain price gouging, and emergency blood transfusions are fulfilled swiftly by verified volunteers.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Unifying public and private healthcare facilities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Real-time hospital inventory visibility across divisions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Humanitarian voluntary network free from commercial trade</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Pillars of Medical Governance */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Clinical Integrity & Regulatory Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Built in strict adherence with Bangladesh Directorate General of Health Services (DGHS) guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-2 sm:space-y-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Verified Authenticity</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every pharmaceutical batch is sourced directly from licensed national manufacturers with verified batch records.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-2 sm:space-y-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Cold-Chain Assurance</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Insulated thermal packaging with ice packs and calibrated temperature sensors to guarantee biologic potency.
              </p>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-2 sm:space-y-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Humanitarian Blood Network</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Free community-driven blood network connecting verified volunteer donors with hospitalized attendants.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Tier Role-Based Security Architecture */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
              Security Architecture
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Segregated Multi-Role Access Control
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              MediStock enforces strict enterprise role-based authorization (RBAC) so each healthcare stakeholder accesses only their authorized dashboard:
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
            <div className="p-3.5 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-amber-800 font-bold text-xs sm:text-sm">
                <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Super Admin</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Platform governance, macro financial revenue, universal user moderation, and 1-click database controls.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-purple-800 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">Admin Operations</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Hospital/Pharmacy license approvals, batch updates, inventory dispatch, and demand request reviews.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-blue-800 font-bold text-xs sm:text-sm">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate">Hospitals & Clinics</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Wholesale institutional catalog ordering, printable tax invoices, delivery challans, and custom demands.
              </p>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Users & Donors</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                Personal genuine health orders, live status tracking, emergency blood requests, and volunteer donor profiles.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Banner & CTAs */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-black">Join Bangladesh's Premier Healthcare Network</h3>
            <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
              Whether you are a hospital purchasing director, a community pharmacist, or a volunteer blood donor, MediStock provides the verified tools you need.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('register-org')}
              className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Register Organization
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Browse Catalog
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Contact Support
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
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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

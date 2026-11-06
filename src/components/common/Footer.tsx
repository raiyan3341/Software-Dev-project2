import React from 'react';
import { Plus, Phone, Mail, MapPin, Heart, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, categoryFilter?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Medical Disclaimer Banner */}
      <div className="bg-slate-950 py-3 border-b border-slate-800 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-center">
          <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong>Healthcare Advisory:</strong> MediStock is a centralized supply and inventory management platform. Medical products must be dispensed by licensed practitioners.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-teal-500/20">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                MediStock
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Professional healthcare supply and inventory management platform for pharmacies, hospitals, clinics, and voluntary blood donors.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>Level 7, Health Tech Tower, Panthapath, Dhaka-1205</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>Hotline: +880 9612 000 999 (24/7 Supply Dispatch)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span>support@medistock.com.bd</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-teal-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-teal-400 transition-colors">
                  Product Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blood')} className="hover:text-teal-400 transition-colors">
                  Blood Donation & Donors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register-org')} className="hover:text-teal-400 transition-colors">
                  Hospital & Pharmacy Registration
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  About MediStock
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-teal-400 transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Top Supply Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Supply Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('products', 'cold-cough')} className="hover:text-teal-400 transition-colors">
                  Cold, Cough & Fever
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', 'masks')} className="hover:text-teal-400 transition-colors">
                  Masks & Protective PPE
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', 'medical-equipment')} className="hover:text-teal-400 transition-colors">
                  Diagnostic Devices
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', 'first-aid')} className="hover:text-teal-400 transition-colors">
                  First Aid & Wound Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products', 'gloves')} className="hover:text-teal-400 transition-colors">
                  Surgical & Clinical Gloves
                </button>
              </li>
            </ul>
          </div>

          {/* Portal Dashboards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Role Dashboards</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('user-dashboard')} className="hover:text-teal-400 transition-colors">
                  Normal User Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('org-dashboard')} className="hover:text-teal-400 transition-colors">
                  Hospital / Pharmacy Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-teal-400 transition-colors">
                  Admin Control Panel
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('owner-dashboard')} className="hover:text-teal-400 transition-colors">
                  Owner & Governance Portal
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MediStock Platform Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/80 rounded-full border border-slate-800">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">Supabase PostgreSQL Cloud: Live Connected</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Healthcare Service</span>
            <span className="hover:text-slate-400 cursor-pointer">DGHS License #MED-8891-BD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


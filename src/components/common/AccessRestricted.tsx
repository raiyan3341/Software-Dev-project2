import React from 'react';
import { ShieldAlert, Lock, ArrowRight, Home, LogIn } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { UserRole } from '../../types';

interface AccessRestrictedProps {
  requiredRole: UserRole;
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({
  requiredRole,
  onNavigate,
  onOpenLogin,
}) => {
  const { currentUser, activeRole } = useMediStockStore();

  const roleInfo: Record<UserRole, { title: string; subtitle: string; color: string; badge: string }> = {
    owner: {
      title: 'Platform Owner / Super Admin',
      subtitle: 'সুপার অ্যাডমিনের জন্য সংরক্ষিত এলাকা',
      color: 'amber',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    admin: {
      title: 'Platform Administrator',
      subtitle: 'অ্যাডমিন প্যানেল শুধুমাত্র অনুমোদিত অ্যাডমিনদের জন্য',
      color: 'purple',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    organization: {
      title: 'Healthcare Institution (Hospital / Pharmacy)',
      subtitle: 'হাসপাতাল ও ফার্মেসি প্রাতিষ্ঠানিক পোর্টাল',
      color: 'blue',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    normal_user: {
      title: 'Registered User',
      subtitle: 'ব্যক্তিগত ইউজার ড্যাশবোর্ড',
      color: 'emerald',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
  };

  const getDashboardViewForRole = (role: UserRole): string => {
    switch (role) {
      case 'owner':
        return 'owner-dashboard';
      case 'admin':
        return 'admin-dashboard';
      case 'organization':
        return 'org-dashboard';
      case 'normal_user':
      default:
        return 'user-dashboard';
    }
  };

  const target = roleInfo[requiredRole];

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Shield / Lock Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
          <ShieldAlert className="w-10 h-10 stroke-[2]" />
        </div>

        {/* Heading & Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border bg-rose-50 text-rose-700 border-rose-200">
            <Lock className="w-3.5 h-3.5" />
            <span>অ্যাক্সেস সংরক্ষিত / Access Restricted</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            অনুমতি নেই (Unauthorized Access)
          </h2>

          <p className="text-xs text-slate-500 leading-relaxed">
            এই ড্যাশবোর্ডটি শুধুমাত্র <span className="font-bold text-slate-700">{target.title}</span> অ্যাকাউন্টের জন্য নির্দিষ্ট করা। প্রতিটি অ্যাকাউন্টের শুধুমাত্র তার নিজস্ব পোর্টালে প্রবেশের অনুমতি রয়েছে।
          </p>
        </div>

        {/* Current Identity Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
            <span>প্রয়োজনীয় রোল (Required)</span>
            <span className={`px-2 py-0.5 rounded-md font-bold uppercase border ${target.badge}`}>
              {requiredRole.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <span className="text-slate-500">বর্তমান লগইন (Current):</span>
            <span className="font-bold text-slate-800">
              {currentUser ? `${currentUser.name} (${activeRole.replace('_', ' ')})` : 'লগইন করা নেই (Guest)'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {currentUser ? (
            <button
              onClick={() => onNavigate(getDashboardViewForRole(currentUser.role))}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>আমার নিজস্ব ড্যাশবোর্ডে যান ({roleInfo[currentUser.role]?.title || 'Dashboard'})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন করুন / Sign In</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>হোমপেজে ফিরে যান (Return Home)</span>
          </button>
        </div>

      </div>
    </div>
  );
};


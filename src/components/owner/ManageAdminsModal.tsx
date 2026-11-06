import React, { useState } from 'react';
import { X, Crown, UserCheck, UserX, AlertTriangle, CheckCircle2, Search, ShieldCheck } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { UserRole } from '../../types';

interface ManageAdminsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageAdminsModal: React.FC<ManageAdminsModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, updateUserRole, logActivity } = useMediStockStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter users based on search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const admins = filteredUsers.filter(u => u.role === 'admin');
  const candidates = filteredUsers.filter(u => u.role !== 'admin' && u.role !== 'owner');

  const handlePromote = (userId: string, name: string) => {
    updateUserRole(userId, 'admin');
    logActivity('Promoted User to Admin Role', `${name} promoted by Platform Owner`, 'user');
    setFeedback(`Promoted ${name} to Administrator with full system management privileges.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDemote = (userId: string, name: string) => {
    updateUserRole(userId, 'normal_user');
    logActivity('Demoted Admin to Normal User', `${name} demoted by Platform Owner`, 'user');
    setFeedback(`Revoked administrative privileges from ${name}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Admin Governance & Roles</h3>
              <p className="text-xs text-slate-500">Super Admin authority to assign and revoke administrative privileges dynamically</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {feedback && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Security Protocol:</strong> Administrators have full authority to approve hospitals, manage medicine inventory, and update order statuses.
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platform users by name or email..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Current Administrators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Active Administrators ({admins.length})
              </h4>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {admins.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No active administrators matching search criteria.
                </div>
              ) : (
                admins.map((user) => (
                  <div key={user.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/20" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{user.name}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            Administrator
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDemote(user.id, user.name)}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" /> Demote
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Eligible Candidates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-teal-600" />
                Eligible Users & Registered Candidates ({candidates.length})
              </h4>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {candidates.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No registered users available to promote.
                </div>
              ) : (
                candidates.map((user) => (
                  <div key={user.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{user.name}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                            {user.role === 'organization' ? 'Organization' : 'Normal User'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePromote(user.id, user.name)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Make Admin
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
          >
            Close Governance Window
          </button>
        </div>
      </div>
    </div>
  );
};

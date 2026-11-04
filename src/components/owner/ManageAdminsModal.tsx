import React, { useState } from 'react';
import { X, ShieldCheck, Crown, UserCheck, UserX, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMediStockStore } from '../../data/store';

interface ManageAdminsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageAdminsModal: React.FC<ManageAdminsModalProps> = ({ isOpen, onClose }) => {
  const { logActivity } = useMediStockStore();

  const [staffUsers, setStaffUsers] = useState([
    { id: 'usr-admin-1', name: 'Dr. Kamal Hossain', email: 'kamal@medistock.gov', role: 'admin', assignedAt: '2025-01-15' },
    { id: 'usr-admin-2', name: 'Nusrat Jahan (Ops)', email: 'nusrat.ops@medistock.gov', role: 'admin', assignedAt: '2025-02-10' },
    { id: 'usr-normal-2', name: 'Sadia Sultana', email: 'sadia@health.gov.bd', role: 'normal_user', assignedAt: '2025-03-01' },
    { id: 'usr-normal-3', name: 'Engr. Masud Karim', email: 'masud@healthtech.bd', role: 'normal_user', assignedAt: '2025-03-20' },
  ]);

  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePromote = (userId: string, name: string) => {
    setStaffUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'admin' } : u));
    logActivity('Promoted User to Admin Role', `${name} by Platform Owner`, 'user');
    setFeedback(`Promoted ${name} to Administrator with inventory access.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDemote = (userId: string, name: string) => {
    setStaffUsers(prev => prev.map(u => u.id === userId ? { ...u, role: 'normal_user' } : u));
    logActivity('Demoted Admin to Normal User', `${name} by Platform Owner`, 'user');
    setFeedback(`Revoked administrative access from ${name}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Admin Governance & Roles</h3>
              <p className="text-xs text-slate-500">Super Admin authority to assign and revoke administrative privileges</p>
            </div>
          </div>

          {feedback && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Security Protocol:</strong> Administrators have full access to approve hospitals, manage medicine inventory, and update order statuses.
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Staff & Eligible Candidates
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {staffUsers.map((user) => (
                <div key={user.id} className="p-3.5 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">{user.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role === 'admin' ? 'Administrator' : 'Normal User'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>

                  <div>
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => handleDemote(user.id, user.name)}
                        className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <UserX className="w-3.5 h-3.5" /> Demote
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePromote(user.id, user.name)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Make Admin
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              Close Governance Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


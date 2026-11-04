import React, { useState } from 'react';
import { X, Check, FileText, Building2, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';
import { Organization } from '../../types';
import { useMediStockStore } from '../../data/store';

interface OrganizationVerificationModalProps {
  org: Organization | null;
  onClose: () => void;
}

export const OrganizationVerificationModal: React.FC<OrganizationVerificationModalProps> = ({ org, onClose }) => {
  const { verifyOrganization } = useMediStockStore();
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!org) return null;

  const handleApprove = () => {
    verifyOrganization(org.id, 'Approved');
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setIsRejecting(true);
      return;
    }
    verifyOrganization(org.id, 'Rejected', rejectionReason);
    onClose();
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
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">{org.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {org.verificationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500">{org.type} • Application Review</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block">Authorized Representative:</span>
                <strong className="text-slate-800">{org.representative}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Contact Phone:</span>
                <strong className="text-slate-800">{org.phone}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Business Email:</span>
                <strong className="text-slate-800">{org.email}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Location:</span>
                <strong className="text-slate-800">{org.city}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Physical Address:</span>
                <span className="text-slate-700">{org.address}</span>
              </div>
            </div>
          </div>

          {/* Submitted Documents */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Submitted Legal Documents ({org.documents?.length || 0})
            </h4>
            <div className="space-y-2">
              {org.documents && org.documents.length > 0 ? (
                org.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-slate-800">{doc.name}</span>
                      <span className="text-[10px] text-slate-400">({doc.type} • {doc.size || '1.5MB'})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-bold">
                      Verified Authenticity
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No documents uploaded.</p>
              )}
            </div>
          </div>

          {isRejecting && (
            <div className="space-y-2 pt-2 border-t">
              <label className="block text-xs font-bold text-rose-700">Reason for Rejection *</label>
              <textarea
                rows={2}
                placeholder="State reason (e.g. Incomplete drug license copy, mismatched hospital trade name)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-rose-300 rounded-xl outline-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t flex items-center justify-between gap-3">
            {!isRejecting ? (
              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
              >
                Reject Application
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            )}

            <button
              type="button"
              onClick={handleApprove}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md hover:shadow-teal-600/25 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Approve & Authorize B2B Restocking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


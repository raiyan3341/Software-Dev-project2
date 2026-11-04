import React, { useState } from 'react';
import { X, HeartHandshake, Phone, Building2, Send, ShieldCheck, Check } from 'lucide-react';
import { BloodDonor } from '../../types';

interface RequestDonorModalProps {
  donor: BloodDonor | null;
  onClose: () => void;
}

export const RequestDonorModal: React.FC<RequestDonorModalProps> = ({ donor, onClose }) => {
  const [patientHospital, setPatientHospital] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!donor) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-5 p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
            <img
              src={donor.avatar}
              alt={donor.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm">{donor.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                  {donor.bloodGroup}
                </span>
              </div>
              <p className="text-xs text-slate-500">{donor.location} Division • Volunteer Donor</p>
            </div>
          </div>

          {isSent ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Request Dispatched!</h4>
              <p className="text-xs text-slate-500">
                {donor.name} has received an alert with your contact details. If available, they will call you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hospital / Admission Ward *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Hospital, ICU Bed 4"
                  value={patientHospital}
                  onChange={(e) => setPatientHospital(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Emergency Contact Phone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +880 1718 XXXXXX"
                  value={patientContact}
                  onChange={(e) => setPatientContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Donor Privacy Protection:</strong> We notify the donor with your hospital information directly so they can respond securely without spam.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Emergency Donation Request</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};


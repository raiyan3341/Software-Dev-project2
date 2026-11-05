import React, { useState } from 'react';
import { X, Heart, Phone, Building2, Droplet, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { BloodRequest } from '../../types';

interface AcceptBloodRequestModalProps {
  request: BloodRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const AcceptBloodRequestModal: React.FC<AcceptBloodRequestModalProps> = ({
  request,
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { acceptBloodRequest, currentUser } = useMediStockStore();

  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [message, setMessage] = useState('I am ready to volunteer and donate blood for this patient. I will be in touch shortly.');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser?.phone) {
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isOpen || !request) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in to volunteer for this blood donation request.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide your contact phone number so the patient attendant can call you.');
      return;
    }

    try {
      acceptBloodRequest(request.id, phone.trim(), message.trim());
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while confirming your commitment.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Header */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Heart className="w-7 h-7 fill-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Volunteer to Donate Blood</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your commitment can save a life. Your contact details will be shared directly with the patient's attendant.
            </p>
          </div>

          {/* Request Info Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-extrabold text-sm flex items-center gap-1.5">
                <Droplet className="w-4 h-4 fill-rose-600" />
                {request.bloodGroup} ({request.unitsNeeded} {request.unitsNeeded === 1 ? 'Bag' : 'Bags'})
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold uppercase text-[10px]">
                {request.urgency}
              </span>
            </div>

            <div className="pt-1">
              <p className="font-bold text-slate-900 text-sm">{request.hospital}</p>
              <p className="text-slate-500">{request.location} • Needed: {request.dateNeeded}</p>
            </div>

            {request.notes && (
              <p className="text-slate-600 italic bg-white p-2 rounded-xl border border-slate-200/60">
                "{request.notes}"
              </p>
            )}

            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
              <span>Requester: <strong className="text-slate-700">{request.requesterName}</strong></span>
              <span>Attendant Phone: <strong className="text-slate-700">{request.contactPhone}</strong></span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="py-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-base">Commitment Successfully Registered!</h4>
              <p className="text-xs text-emerald-700">
                The patient attendant has received your name and phone number. They will contact you shortly to coordinate arrival.
              </p>
            </div>
          ) : !currentUser ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
              <p className="text-xs text-amber-900 font-semibold">
                You must be signed in to volunteer for a blood donation request.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin?.();
                }}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Contact Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="+880 17XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  The attendant will call this phone number to coordinate arrival time and clinical procedures.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message for Patient / Attendant (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. I am leaving now and will reach the hospital within 2 hours."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm & Volunteer to Donate</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

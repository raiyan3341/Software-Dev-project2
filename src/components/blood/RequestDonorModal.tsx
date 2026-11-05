import React, { useState } from 'react';
import { X, HeartHandshake, Phone, Building2, Send, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { BloodDonor } from '../../types';

interface RequestDonorModalProps {
  donor: BloodDonor | null;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const RequestDonorModal: React.FC<RequestDonorModalProps> = ({ donor, onClose, onOpenLogin }) => {
  const { sendDonorDirectRequest, currentUser } = useMediStockStore();

  const [patientHospital, setPatientHospital] = useState('');
  const [patientLocation, setPatientLocation] = useState(donor?.location || 'Dhaka');
  const [unitsNeeded, setUnitsNeeded] = useState(1);
  const [dateNeeded, setDateNeeded] = useState(new Date().toISOString().split('T')[0]);
  const [patientContact, setPatientContact] = useState(currentUser?.phone || '');
  const [notes, setNotes] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (donor) {
      setPatientLocation(donor.location);
    }
    if (currentUser?.phone) {
      setPatientContact(currentUser.phone);
    }
  }, [donor, currentUser]);

  if (!donor) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in to send a direct blood request to this donor.');
      return;
    }
    if (!patientContact.trim()) {
      setError('Please provide your emergency contact phone number.');
      return;
    }

    try {
      sendDonorDirectRequest({
        donorId: donor.id,
        donorName: donor.name,
        donorUserId: donor.userId,
        hospital: patientHospital.trim(),
        location: patientLocation,
        bloodGroup: donor.bloodGroup,
        unitsNeeded,
        dateNeeded,
        requesterPhone: patientContact.trim(),
        notes: notes.trim(),
      });
      setIsSent(true);
      setError(null);
      setTimeout(() => {
        setIsSent(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch blood request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Donor Card Header */}
          <div className="flex items-center gap-3 mb-5 p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100">
            <img
              src={donor.avatar}
              alt={donor.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-slate-900 text-sm truncate">{donor.name}</h4>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black shrink-0">
                  {donor.bloodGroup}
                </span>
              </div>
              <p className="text-xs text-slate-500">{donor.location} Division • Voluntary Blood Donor</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSent ? (
            <div className="py-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-bold text-emerald-900 text-base">Request Dispatched!</h4>
              <p className="text-xs text-emerald-700">
                {donor.name} has received an alert with your hospital and contact details. They will call you directly.
              </p>
            </div>
          ) : !currentUser ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
              <p className="text-xs text-amber-900 font-semibold">
                You must be signed in to send an emergency request to this donor.
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
            <form onSubmit={handleSend} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hospital / Admission Ward *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Medical College Hospital, ICU Bed 4"
                  value={patientHospital}
                  onChange={(e) => setPatientHospital(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Units (Bags) Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date Needed</label>
                  <input
                    type="date"
                    value={dateNeeded}
                    onChange={(e) => setDateNeeded(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Emergency Attendant Mobile Phone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+880 17XXXXXXXX"
                  value={patientContact}
                  onChange={(e) => setPatientContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Patient Condition / Message (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Patient diagnosis, urgent surgery timing, blood requisition notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Donor Notification:</strong> Sending this request sends an instant alert to the donor's dashboard so they can call you immediately.
                </span>
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
                  <span>Send Blood Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

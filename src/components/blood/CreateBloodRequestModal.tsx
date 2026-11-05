import React, { useState } from 'react';
import { X, Droplet, Send, AlertTriangle, Building2, Phone, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { BloodGroup } from '../../types';

interface CreateBloodRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const CreateBloodRequestModal: React.FC<CreateBloodRequestModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { createBloodRequest, currentUser } = useMediStockStore();

  const [requesterName, setRequesterName] = useState(currentUser?.name || '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [hospital, setHospital] = useState('');
  const [location, setLocation] = useState('Dhaka');
  const [unitsNeeded, setUnitsNeeded] = useState(1);
  const [dateNeeded, setDateNeeded] = useState(new Date().toISOString().split('T')[0]);
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Critical'>('Urgent');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      setRequesterName(currentUser.name);
      if (currentUser.phone) setContactPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospital.trim()) {
      setError('Please specify the hospital or medical facility name.');
      return;
    }
    if (!contactPhone.trim()) {
      setError('Please provide an emergency contact phone number.');
      return;
    }

    try {
      createBloodRequest({
        requesterName: requesterName.trim() || currentUser?.name || 'Patient Attendant',
        bloodGroup,
        hospital: hospital.trim(),
        location,
        unitsNeeded,
        dateNeeded: dateNeeded || new Date().toISOString().split('T')[0],
        contactPhone: contactPhone.trim(),
        urgency,
        notes: notes.trim(),
      });

      setSuccess(true);
      setError(null);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to broadcast blood request.');
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

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Droplet className="w-7 h-7 fill-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Post Emergency Blood Request</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Broadcast your clinical requirement live across our voluntary donor network
            </p>
          </div>

          {!currentUser && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 flex items-center justify-between">
              <span>Sign in to track real-time responses and call donors directly.</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin?.();
                }}
                className="font-bold underline text-amber-800 ml-2 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 fill-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Blood Request Broadcasted!</h4>
              <p className="text-xs text-slate-600">
                Matching voluntary blood donors in {location} and nearby areas have been notified.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e: any) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-700 outline-none focus:bg-white cursor-pointer"
                  >
                    {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Units (Bags) Needed *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:bg-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Hospital / Medical Center *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka Medical College Hospital, Ward 5"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City / Division *</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white cursor-pointer"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                    <option value="Comilla">Comilla</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={(e: any) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-amber-700 outline-none focus:bg-white cursor-pointer"
                  >
                    <option value="Critical">Critical (Immediate Emergency)</option>
                    <option value="Urgent">Urgent (Within 24 Hours)</option>
                    <option value="Normal">Normal (Scheduled Care)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Emergency Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+880 17XXXXXXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20"
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

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Clinical Notes / Surgery Reason (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Patient undergoing emergency surgery, B+ blood required urgently."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                </div>
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
                  className="flex-2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast Blood Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Droplet, UserCheck, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { BloodGroup } from '../../types';

interface RegisterDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
}

export const RegisterDonorModal: React.FC<RegisterDonorModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const { registerAsDonor, currentUser, donors } = useMediStockStore();

  const userExistingDonor = donors.find(d => d.userId === currentUser?.id || d.email === currentUser?.email);

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(userExistingDonor?.bloodGroup || 'B+');
  const [location, setLocation] = useState(userExistingDonor?.location || 'Dhaka');
  const [phone, setPhone] = useState(userExistingDonor?.phone || currentUser?.phone || '');
  const [notes, setNotes] = useState(userExistingDonor?.notes || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (userExistingDonor) {
      setBloodGroup(userExistingDonor.bloodGroup);
      setLocation(userExistingDonor.location);
      setPhone(userExistingDonor.phone);
      setNotes(userExistingDonor.notes || '');
    } else if (currentUser?.phone) {
      setPhone(currentUser.phone);
    }
  }, [userExistingDonor, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in to register as a voluntary blood donor.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }

    try {
      registerAsDonor({
        bloodGroup,
        location,
        phone: phone.trim(),
        notes: notes.trim(),
      });
      setSuccess(true);
      setError(null);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to save donor profile.');
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

        <div className="p-6 sm:p-8 space-y-5">
          {/* Header */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
              <UserCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {userExistingDonor ? 'Update Blood Donor Profile' : 'Register as Voluntary Donor'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              List yourself as an active voluntary blood donor to help hospitalized patients in emergency need.
            </p>
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
              <h4 className="font-bold text-emerald-900 text-base">Donor Profile Successfully Saved!</h4>
              <p className="text-xs text-emerald-700">
                Your blood group ({bloodGroup}) and location ({location}) are now live on the Available Donors feed.
              </p>
            </div>
          ) : !currentUser ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
              <p className="text-xs text-amber-900 font-semibold">
                You must be signed in to register as an active voluntary donor.
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
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                {/* Blood Group */}
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

                {/* City */}
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
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Mobile Number *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="+880 17XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Availability Note */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Availability Note / Proximity (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Available on weekends or near Dhanmondi & Mirpur hospital zones."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
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
                  className="flex-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{userExistingDonor ? 'Update Donor Profile' : 'Save as Active Donor'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

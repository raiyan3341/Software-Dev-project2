import React, { useState } from 'react';
import { X, Droplet, Send, AlertTriangle, Building2, Phone, Calendar, Heart } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { BloodGroup } from '../../types';

interface CreateBloodRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBloodRequestModal: React.FC<CreateBloodRequestModalProps> = ({ isOpen, onClose }) => {
  const { createBloodRequest, currentUser } = useMediStockStore();

  const [requesterName, setRequesterName] = useState(currentUser?.name || 'Rahim Ahmed');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [hospital, setHospital] = useState('');
  const [location, setLocation] = useState('Dhaka');
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [dateNeeded, setDateNeeded] = useState('');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+880 1718 223344');
  const [urgency, setUrgency] = useState<'Normal' | 'Urgent' | 'Critical'>('Urgent');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBloodRequest({
      requesterName,
      bloodGroup,
      hospital,
      location,
      unitsNeeded,
      dateNeeded: dateNeeded || new Date().toISOString().split('T')[0],
      contactPhone,
      urgency,
      notes,
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Droplet className="w-6 h-6 fill-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Post Emergency Blood Request</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Broadcast your requirement to registered volunteer donors
            </p>
          </div>

          {success ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 fill-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Request Broadcasted!</h4>
              <p className="text-xs text-slate-500">
                Matching volunteer donors in {location} have been notified.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Blood Group *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e: any) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-rose-700 outline-none"
                  >
                    {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Units Needed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hospital / Medical Center *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka Medical College Hospital"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Division *</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barisal">Barisal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e: any) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical (Immediate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date Needed</label>
                  <input
                    type="date"
                    value={dateNeeded}
                    onChange={(e) => setDateNeeded(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Medical Reason / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Patient condition, surgery details, attendant instructions"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Post Emergency Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


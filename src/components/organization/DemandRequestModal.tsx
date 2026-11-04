import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, Send, Building2, Package } from 'lucide-react';
import { useMediStockStore } from '../../data/store';

interface DemandRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  orgName: string;
}

export const DemandRequestModal: React.FC<DemandRequestModalProps> = ({
  isOpen,
  onClose,
  orgId,
  orgName,
}) => {
  const { submitProductDemand } = useMediStockStore();

  const [itemName, setItemName] = useState('');
  const [requestedQuantity, setRequestedQuantity] = useState(100);
  const [explanation, setExplanation] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProductDemand({
      orgId,
      orgName,
      itemName,
      requestedQuantity,
      explanation,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
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
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto mb-2">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Request Missing Product</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit a supply demand for items not currently listed in our catalog
            </p>
          </div>

          {isSuccess ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Demand Request Submitted!</h4>
              <p className="text-xs text-slate-500">
                Our central pharmaceutical sourcing team will review availability and notify {orgName}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requested Medicine or Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meropenem 1g Injection / Pediatric Nebulizer Mask"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Quantity Required *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Explanation / Urgency Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why this medicine is needed (e.g. ICU patient spike, seasonal surge, specific brand required)"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-teal-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Demand Request to Admin</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};


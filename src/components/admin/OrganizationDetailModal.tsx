import React from 'react';
import { X, Building2, Package, TrendingUp, Clock, CheckCircle2, FileText, Phone, Mail, MapPin, Eye } from 'lucide-react';
import { Organization, Order } from '../../types';

interface OrganizationDetailModalProps {
  org: Organization | null;
  orgOrders: Order[];
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
}

export const OrganizationDetailModal: React.FC<OrganizationDetailModalProps> = ({
  org,
  orgOrders,
  onClose,
  onViewInvoice,
}) => {
  if (!org) return null;

  // Frequently ordered products calculation
  const productFrequency: Record<string, { name: string; count: number; totalQty: number }> = {};
  orgOrders.forEach(ord => {
    ord.items.forEach(item => {
      if (!productFrequency[item.productId]) {
        productFrequency[item.productId] = { name: item.productName, count: 0, totalQty: 0 };
      }
      productFrequency[item.productId].count += 1;
      productFrequency[item.productId].totalQty += item.quantity;
    });
  });

  const frequentProducts = Object.values(productFrequency)
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 border-b pb-5">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900">{org.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  {org.type}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  org.verificationStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {org.verificationStatus}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Representative: {org.representative} • Onboarded: {org.createdAt}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border text-xs">
              <span className="text-slate-400 block font-medium">Total Orders Placed</span>
              <strong className="text-2xl text-slate-900 block mt-1">{orgOrders.length}</strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border text-xs">
              <span className="text-slate-400 block font-medium">Pending Supply Dispatches</span>
              <strong className="text-2xl text-amber-700 block mt-1">
                {orgOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length}
              </strong>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border text-xs">
              <span className="text-slate-400 block font-medium">Cumulative Procurement Spend</span>
              <strong className="text-2xl text-teal-700 block mt-1">
                ৳ {orgOrders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-slate-50 rounded-2xl p-4 border text-xs text-slate-600 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{org.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{org.email}</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{org.address}, {org.city}</span>
            </div>
          </div>

          {/* Frequently Ordered Products */}
          {frequentProducts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Most Frequently Restocked Products
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {frequentProducts.map((p, idx) => (
                  <div key={idx} className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs">
                    <p className="font-bold text-slate-900 truncate">{p.name}</p>
                    <span className="text-[11px] text-teal-700 font-semibold">{p.totalQty} units ordered</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Historical Order List matching Section 5 of Requirments.md */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Organization Order History ({orgOrders.length})
            </h4>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b font-bold text-slate-500 uppercase">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Total</th>
                    <th className="p-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orgOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400">
                        No orders placed yet by this organization.
                      </td>
                    </tr>
                  ) : (
                    orgOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{ord.id}</td>
                        <td className="p-3 text-slate-500">{ord.date}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">৳ {ord.total.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              onClose();
                              onViewInvoice(ord);
                            }}
                            className="text-teal-600 hover:underline font-bold text-xs inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Invoice
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Printer, Download, ArrowLeft, CheckCircle2, Clock, Truck, Package, ShieldCheck, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { Order } from '../../types';

interface InvoiceViewProps {
  order: Order;
  onBack: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ order, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const statusColors: Record<string, string> = {
    Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Processing: 'bg-amber-100 text-amber-800 border-amber-200',
    Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    Pending: 'bg-slate-100 text-slate-800 border-slate-200',
    Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Action Bar matching Project.png Screen 9 */}
        <div className="flex items-center justify-between no-print">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Invoice Container matching Project.png Screen 9 */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Order {order.id}
                </h1>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${statusColors[order.status] || 'bg-slate-100'}`}>
                  {order.status}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>
                  Order Date: <strong className="text-slate-800">{order.date}</strong>
                </p>
                <p>
                  Organization: <strong className="text-slate-800">{order.organizationName}</strong>
                </p>
              </div>
            </div>

            {/* Organization Details Box matching Screen 9 */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-600 max-w-xs w-full space-y-1">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                Organization Details
              </h4>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                {order.organizationName}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {order.organizationAddress || '123 Medical Road, Dhaka-1200'}
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {order.organizationPhone || '+880 1712 345678'}
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {order.organizationEmail || 'cityhospital@health.com'}
              </p>
            </div>
          </div>

          {/* Items Table matching Project.png Screen 9 */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Items
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-5">Product</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-5">
                        <p className="font-bold text-slate-900">{item.productName}</p>
                        <span className="text-[11px] text-slate-400">{item.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-600">
                        ৳ {item.unitPrice}
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-slate-900">
                        ৳ {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/80 border-t-2 border-slate-200">
                    <td colSpan={3} className="py-4 px-5 text-right font-extrabold text-slate-700 text-sm">
                      Total
                    </td>
                    <td className="py-4 px-5 text-right font-black text-slate-900 text-base sm:text-lg">
                      ৳ {order.total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Order Timeline matching Project.png Screen 9 */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Order Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{step.status}</h4>
                      <p className="text-xs text-slate-500">{step.timestamp}</p>
                      {step.note && <p className="text-xs text-slate-600 mt-0.5 italic">{step.note}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Order Placed</h4>
                      <p className="text-xs text-slate-500">Apr 24, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Confirmed</h4>
                      <p className="text-xs text-slate-500">Apr 24, 11:15 AM</p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Shipped</h4>
                      <p className="text-xs text-slate-500">Apr 24, 02:45 PM</p>
                    </div>
                  </div>
                  <div className="relative flex items-start gap-3">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Delivered</h4>
                      <p className="text-xs text-slate-500">Apr 25, 11:20 AM</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Official Stamp / Footer */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Electronically verified healthcare supply requisition bill • DGHS Compliant</span>
            </div>
            <span>Authorized Signature: MediStock Central Dispatch</span>
          </div>

        </div>

      </div>
    </div>
  );
};


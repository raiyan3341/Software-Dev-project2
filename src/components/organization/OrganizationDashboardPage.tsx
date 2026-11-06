import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  User,
  Bell,
  LogOut,
  Building2,
  Clock,
  CheckCircle2,
  FileText,
  PlusCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { Order, OrderStatus } from '../../types';
import { InvoiceView } from '../invoice/InvoiceView';
import { DemandRequestModal } from './DemandRequestModal';

interface OrganizationDashboardPageProps {
  onNavigate: (view: string) => void;
  onOpenProductModal?: (product: any) => void;
}

export const OrganizationDashboardPage: React.FC<OrganizationDashboardPageProps> = ({
  onNavigate,
}) => {
  const { organizations, orders, demandRequests, getDynamicOrgStats, currentUser } = useMediStockStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'demand' | 'profile'>('overview');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fallback organization representation when testing with clean database
  const fallbackOrg = {
    id: currentUser?.organizationId || 'org-facility-1',
    name: currentUser?.name || 'Healthcare Facility',
    type: 'Hospital' as const,
    representative: currentUser?.name || 'Representative',
    email: currentUser?.email || 'facility@medistock.com',
    phone: currentUser?.phone || '+880 1712 000000',
    address: currentUser?.address || 'Dhaka, Bangladesh',
    city: currentUser?.city || 'Dhaka',
    verificationStatus: 'Pending' as const,
    documents: [],
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };

  // Find the active organization
  const currentOrg = (currentUser?.organizationId ? organizations.find(o => o.id === currentUser.organizationId) : null) || organizations[0] || fallbackOrg;

  // Dynamic statistics calculated directly from the database orders
  const { totalOrders, pendingOrders, totalSpent } = getDynamicOrgStats(currentOrg.id);

  // Orders for this organization
  const orgOrders = orders.filter(ord => ord.organizationId === currentOrg.id || ord.organizationName.toLowerCase().includes(currentOrg.name.toLowerCase()));

  // Filtered orders
  const filteredOrders = orgOrders.filter(ord => {
    if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      return ord.id.toLowerCase().includes(q) || ord.items.some(i => i.productName.toLowerCase().includes(q));
    }
    return true;
  });

  // Recent 5 orders matching Screen 5
  const recentOrders = orgOrders.slice(0, 5);

  const statusBadges: Record<OrderStatus, { bg: string; text: string }> = {
    Delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    Shipped: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    Processing: { bg: 'bg-amber-100', text: 'text-amber-800' },
    Confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    Pending: { bg: 'bg-slate-100', text: 'text-slate-800' },
    Cancelled: { bg: 'bg-rose-100', text: 'text-rose-800' },
  };

  // If user clicked an order, show Screen 9: Order Details / Invoice (Example)
  if (selectedOrderForInvoice) {
    return (
      <InvoiceView
        order={selectedOrderForInvoice}
        onBack={() => setSelectedOrderForInvoice(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">
        
        {/* Left Sidebar matching Project.png Screen 5 */}
        <aside className="w-full lg:w-64 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm shrink-0 space-y-6">
          
          {/* Organization Badge matching Screen 5 */}
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm truncate">
                {currentOrg.name}
              </h3>
              <span className="text-[11px] font-semibold text-teal-600 block">
                {currentOrg.type} Portal
              </span>
            </div>
          </div>

          {/* Navigation Links matching Screen 5 */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-slate-400" />
                <span>Orders</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                {orgOrders.length}
              </span>
            </button>

            <button
              onClick={() => onNavigate('products')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              <span>Products Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('demand')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'demand'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-slate-400" />
              <span>Request Product</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile & License</span>
            </button>
          </nav>

          {/* Verification Status Pill */}
          <div className="pt-4 border-t border-slate-100">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>DGHS Approved</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Institutional B2B supply purchasing authorized.
              </p>
            </div>
          </div>

          {/* Logout matching Screen 5 */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigate('home')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

        </aside>

        {/* Right Main Content matching Project.png Screen 5 */}
        <main className="flex-1 w-full space-y-8">
          
          {/* Header Greeting matching Screen 5 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, {currentOrg.name} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Here's your overview
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDemandModalOpen(true)}
                className="px-4 py-2.5 rounded-xl border border-teal-600 text-teal-700 hover:bg-teal-50 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Special Supply Demand</span>
              </button>

              <button
                onClick={() => onNavigate('products')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Restock Catalog</span>
              </button>
            </div>
          </div>

          {/* Organization Verification Status Banner */}
          {currentOrg.verificationStatus === 'Pending' && (
            <div className="p-4 sm:p-5 bg-amber-50 rounded-3xl border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm sm:text-base">Facility Verification Status: PENDING DGHS REVIEW</h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold uppercase">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    Your institutional license documents have been submitted. MediStock Compliance Administrators are verifying your credentials. Wholesale medicine restock ordering will unlock automatically upon verification.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
              >
                Browse Medicines
              </button>
            </div>
          )}

          {currentOrg.verificationStatus === 'Rejected' && (
            <div className="p-4 sm:p-5 bg-rose-50 rounded-3xl border border-rose-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-rose-900">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">Facility Registration Rejected</h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    Reason: {currentOrg.rejectionReason || 'Uploaded licenses could not be verified by DGHS.'} Please re-apply with valid trade license.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('register-org')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
              >
                Re-Apply License
              </button>
            </div>
          )}

          {currentOrg.verificationStatus === 'Approved' && (
            <div className="p-3.5 px-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Verified Healthcare Institution: {currentOrg.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  DGHS Authorized
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold hidden sm:inline">Restock Ordering Enabled</span>
            </div>
          )}

          {/* 3 Stat Cards matching Project.png Screen 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Stat 1: Total Orders (12) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Total Orders
                </span>
                <span className="text-3xl font-black text-slate-900 mt-0.5 block">
                  {totalOrders}
                </span>
                <span className="text-[11px] font-semibold text-cyan-700 mt-1 block">
                  Live from database
                </span>
              </div>
            </div>

            {/* Stat 2: Pending Orders */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Pending Orders
                </span>
                <span className="text-3xl font-black text-slate-900 mt-0.5 block">
                  {pendingOrders}
                </span>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-[11px] font-semibold text-amber-700 hover:underline mt-1 block"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Stat 3: Total Spent */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Total Spent
                </span>
                <span className="text-3xl font-black text-slate-900 mt-0.5 block">
                  ৳ {totalSpent.toLocaleString()}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 mt-1 block">
                  Cumulative Procurement
                </span>
              </div>
            </div>

          </div>

          {/* Tab Content: Overview (Default) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Recent Orders Section matching Project.png Screen 5 */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                      Recent Orders
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Supply shipments and restocking order history
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    View All
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-6">Order No</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-6 text-right">Amount</th>
                        <th className="py-3.5 px-4 text-center">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                            No restock orders placed yet. Click "Browse Products" to place an order.
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((ord) => {
                          const badge = statusBadges[ord.status] || { bg: 'bg-slate-100', text: 'text-slate-800' };
                          return (
                            <tr
                              key={ord.id}
                              onClick={() => setSelectedOrderForInvoice(ord)}
                              className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                            >
                              <td className="py-4 px-6 font-bold text-slate-900 group-hover:text-teal-700">
                                {ord.id}
                              </td>
                              <td className="py-4 px-4 text-slate-500 font-medium">
                                {ord.date}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${badge.bg} ${badge.text}`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right font-extrabold text-slate-900">
                                ৳ {ord.total.toLocaleString()}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="p-1.5 rounded-lg text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50 inline-flex transition-colors">
                                  <Eye className="w-4 h-4" />
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Special Supply Requests Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Need an emergency or unlisted medicine?</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submit a direct special demand request to our central procurement warehouse.
                  </p>
                </div>
                <button
                  onClick={() => setIsDemandModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Submit Demand Request
                </button>
              </div>

            </div>
          )}

          {/* Tab Content: All Orders */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-extrabold text-slate-900 text-lg">Complete Restock Order History</h3>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by Order ID..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border rounded-xl outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-50 border rounded-xl outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4 text-center">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                          No orders recorded yet.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr
                          key={ord.id}
                          onClick={() => setSelectedOrderForInvoice(ord)}
                          className="hover:bg-slate-50 cursor-pointer"
                        >
                          <td className="py-3 px-4 font-bold text-slate-900">{ord.id}</td>
                          <td className="py-3 px-4 text-slate-500">{ord.date}</td>
                          <td className="py-3 px-4 text-slate-600">
                            {ord.items.length} item(s) ({ord.items[0]?.productName}...)
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadges[ord.status]?.bg} ${statusBadges[ord.status]?.text}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900">৳ {ord.total.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">
                            <button className="text-teal-600 hover:underline text-xs font-bold">
                              View / Print
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content: Demand Requests */}
          {activeTab === 'demand' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Special Product Demand Requests</h3>
                  <p className="text-xs text-slate-500">Track sourcing progress of unlisted pharmaceuticals</p>
                </div>
                <button
                  onClick={() => setIsDemandModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  + New Demand Request
                </button>
              </div>

              <div className="space-y-3">
                {demandRequests.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-medium space-y-2">
                    <Package className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">No Demand Requests Submitted</p>
                    <p className="text-xs text-slate-400">Click "+ New Demand Request" to request medicines not currently in stock.</p>
                  </div>
                ) : (
                  demandRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{req.itemName}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                            Qty: {req.requestedQuantity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">"{req.explanation}"</p>
                        {req.adminNotes && (
                          <p className="text-xs text-teal-800 font-medium mt-1 bg-teal-50 p-1.5 rounded-lg border border-teal-200">
                            Admin Note: {req.adminNotes}
                          </p>
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        {req.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab Content: Profile & License */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs max-w-2xl space-y-4">
              <h3 className="font-extrabold text-slate-900 text-lg">Organization Profile & DGHS Registration</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Organization Name:</span>
                  <strong className="text-slate-900 text-sm">{currentOrg.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Institutional Type:</span>
                  <strong className="text-teal-700 text-sm">{currentOrg.type}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Authorized Representative:</span>
                  <span className="text-slate-800 font-semibold">{currentOrg.representative}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Phone:</span>
                  <span className="text-slate-800 font-semibold">{currentOrg.phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Hospital Address:</span>
                  <span className="text-slate-800">{currentOrg.address}, {currentOrg.city}</span>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Demand Request Modal */}
      <DemandRequestModal
        isOpen={isDemandModalOpen}
        onClose={() => setIsDemandModalOpen(false)}
        orgId={currentOrg.id}
        orgName={currentOrg.name}
      />
    </div>
  );
};


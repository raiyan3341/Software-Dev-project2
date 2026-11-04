import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Building2,
  Boxes,
  Users,
  FileBarChart,
  Bell,
  LogOut,
  ShieldCheck,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calendar,
  Filter,
  Download,
  Check,
  X,
  Eye,
} from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { Order, OrderStatus, Organization, Product } from '../../types';
import { AddProductModal } from './AddProductModal';
import { OrganizationVerificationModal } from './OrganizationVerificationModal';
import { OrganizationDetailModal } from './OrganizationDetailModal';
import { InvoiceView } from '../invoice/InvoiceView';

interface AdminDashboardPageProps {
  onNavigate: (view: string) => void;
  onOpenProductModal?: (product: Product) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const {
    products,
    setProducts,
    organizations,
    orders,
    updateOrderStatus,
    demandRequests,
    setDemandRequests,
    logActivity,
    dynamicAdminStats,
  } = useMediStockStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'organizations' | 'products' | 'demand' | 'reports'>('overview');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedOrgForVerification, setSelectedOrgForVerification] = useState<Organization | null>(null);
  const [selectedOrgForDetail, setSelectedOrgForDetail] = useState<Organization | null>(null);

  // Search & Filter state
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Pending organizations
  const pendingOrgs = organizations.filter(o => o.verificationStatus === 'Pending');

  // Low stock products alert
  const lowStockProducts = products.filter(p => p.stock <= p.minStockThreshold);

  // Recent 5 orders matching Screen 6
  const recentOrders = orders.slice(0, 5);

  const statusBadges: Record<OrderStatus, { bg: string; text: string }> = {
    Delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    Shipped: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    Processing: { bg: 'bg-amber-100', text: 'text-amber-800' },
    Confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    Pending: { bg: 'bg-slate-100', text: 'text-slate-800' },
    Cancelled: { bg: 'bg-rose-100', text: 'text-rose-800' },
  };

  // Adjust stock inline
  const handleStockAdjust = (productId: string, newStock: number) => {
    const updated = products.map(p => p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p);
    setProducts(updated);
    logActivity('Stock Quantity Adjusted', `Product ID: ${productId} -> ${newStock}`, 'product');
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = 'Order ID,Organization,Date,Status,Total (BDT)\n';
    const rows = orders.map(o => `"${o.id}","${o.organizationName}","${o.date}","${o.status}",${o.total}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MediStock_Orders_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        
        {/* Left Sidebar matching Project.png Screen 6 */}
        <aside className="w-full lg:w-64 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm shrink-0 space-y-6">
          
          {/* Admin Panel Badge matching Screen 6 */}
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm truncate">
                Admin Panel
              </h3>
              <span className="text-[11px] font-semibold text-purple-700 block">
                Central Operations
              </span>
            </div>
          </div>

          {/* Navigation Links matching Screen 6 */}
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
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('organizations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'organizations'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Organizations</span>
              </div>
              {pendingOrgs.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  {pendingOrgs.length} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4 text-slate-400" />
                <span>Products</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('demand')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'demand'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-slate-400" />
                <span>Demand Requests</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 font-bold">
                {demandRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'reports'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileBarChart className="w-4 h-4 text-slate-400" />
              <span>Reports</span>
            </button>
          </nav>

          {/* Low Stock Warning Pill */}
          {lowStockProducts.length > 0 && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{lowStockProducts.length} Items Low Stock</span>
              </div>
              <p className="text-[11px] text-amber-700">
                Replenish batch quantities to prevent order delays.
              </p>
            </div>
          )}

          {/* Logout matching Screen 6 */}
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

        {/* Right Main Content matching Project.png Screen 6 */}
        <main className="flex-1 w-full space-y-8">
          
          {/* Header Title matching Screen 6 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Centralized medical supply fulfillment and inventory supervision
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Cards matching Project.png Screen 6 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* 1. Total Organizations */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Total Organizations
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                {dynamicAdminStats.totalOrganizations}
              </span>
              <span className="text-[11px] font-semibold text-blue-700 mt-1 block">
                {pendingOrgs.length > 0 ? `${pendingOrgs.length} awaiting approval` : 'All accounts verified'}
              </span>
            </div>

            {/* 2. Total Orders */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Total Orders
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                {dynamicAdminStats.totalOrders}
              </span>
              <span className="text-[11px] font-semibold text-amber-700 mt-1 block">
                {orders.filter(o => o.status === 'Pending').length} pending dispatch
              </span>
            </div>

            {/* 3. Pending Approvals */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Pending Approvals
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                {dynamicAdminStats.pendingApprovals}
              </span>
              <button
                onClick={() => setActiveTab('organizations')}
                className="text-[11px] font-semibold text-emerald-700 hover:underline mt-1 block"
              >
                View All
              </button>
            </div>

            {/* 4. Product Requests */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
                <Boxes className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Product Requests
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                {dynamicAdminStats.productRequests}
              </span>
              <button
                onClick={() => setActiveTab('demand')}
                className="text-[11px] font-semibold text-cyan-700 hover:underline mt-1 block"
              >
                View All
              </button>
            </div>

          </div>

          {/* Tab Content: Overview (Default matching Screen 6) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Recent Orders Section matching Project.png Screen 6 */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
                      Recent Orders
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Incoming supply shipments from verified medical facilities
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
                        <th className="py-3.5 px-4">Organization</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-6 text-right">Amount</th>
                        <th className="py-3.5 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                            No orders received yet. Restock orders placed by organizations will appear here.
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((ord) => {
                          const badge = statusBadges[ord.status] || { bg: 'bg-slate-100', text: 'text-slate-800' };
                          return (
                            <tr
                              key={ord.id}
                              className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                              onClick={() => setSelectedOrderForInvoice(ord)}
                            >
                              {/* Order No */}
                              <td className="py-4 px-6 font-bold text-slate-900 group-hover:text-teal-700">
                                {ord.id}
                              </td>

                              {/* Organization matching Screen 6 */}
                              <td className="py-4 px-4 font-semibold text-slate-800">
                                {ord.organizationName}
                              </td>

                              {/* Date */}
                              <td className="py-4 px-4 text-slate-500 font-medium">
                                {ord.date}
                              </td>

                              {/* Status matching Screen 6 */}
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${badge.bg} ${badge.text}`}>
                                  {ord.status}
                                </span>
                              </td>

                              {/* Amount */}
                              <td className="py-4 px-6 text-right font-extrabold text-slate-900">
                                ৳ {ord.total.toLocaleString()}
                              </td>

                              <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <select
                                  value={ord.status}
                                  onChange={(e: any) => updateOrderStatus(ord.id, e.target.value)}
                                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg border border-transparent font-medium cursor-pointer"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Organization Verification Queue Teaser */}
              {pendingOrgs.length > 0 && (
                <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {pendingOrgs.length} Medical Establishment Applications Awaiting Review
                      </h4>
                      <p className="text-xs text-slate-500">
                        {pendingOrgs[0]?.name} submitted DGHS regulatory verification documents.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('organizations')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Review Application
                  </button>
                </div>
              )}

            </div>
          )}

          {/* Tab Content: All Orders Management */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-extrabold text-slate-900 text-lg">Central Order Management</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search by order ID or hospital..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-slate-50 border rounded-xl outline-none"
                  />
                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-1.5 rounded-xl border border-teal-600 text-teal-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-teal-50"
                  >
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-500 uppercase font-bold text-xs">
                      <th className="p-3">Order No</th>
                      <th className="p-3">Organization</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total (৳)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                          No orders in the database. Place an order from the product catalog to test.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td 
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            className="p-3 font-bold text-teal-700 cursor-pointer hover:underline"
                          >
                            {ord.id}
                          </td>
                          <td className="p-3 font-semibold">{ord.organizationName}</td>
                          <td className="p-3 text-slate-500">{ord.items.length} items</td>
                          <td className="p-3 font-bold">৳ {ord.total.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadges[ord.status]?.bg} ${statusBadges[ord.status]?.text}`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <select
                              value={ord.status}
                              onChange={(e: any) => updateOrderStatus(ord.id, e.target.value)}
                              className="px-2 py-1 text-xs bg-slate-100 rounded-lg cursor-pointer font-medium"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content: Organizations Directory & Verification Queue */}
          {activeTab === 'organizations' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Hospital & Pharmacy Directory</h3>
                  <p className="text-xs text-slate-500">Review submitted trade licenses and authorize B2B restocking</p>
                </div>
              </div>

              <div className="space-y-3">
                {organizations.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 font-medium space-y-2">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">No Organizations Registered Yet</p>
                    <p className="text-xs text-slate-400">Pharmacies and hospitals that apply for B2B procurement will appear here for verification.</p>
                  </div>
                ) : (
                  organizations.map((org) => (
                    <div
                      key={org.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-bold text-slate-900 text-base">{org.name}</h4>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 font-semibold text-slate-700">
                            {org.type}
                          </span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            org.verificationStatus === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : org.verificationStatus === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {org.verificationStatus}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Rep: {org.representative} • {org.phone} • {org.address}, {org.city}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Total Orders Placed: <strong>{org.totalOrders}</strong> | Total Spent: <strong>৳{org.totalSpent.toLocaleString()}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => setSelectedOrgForDetail(org)}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                        >
                          Order History
                        </button>
                        <button
                          onClick={() => setSelectedOrgForVerification(org)}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                        >
                          {org.verificationStatus === 'Pending' ? 'Review & Verify' : 'View Documents'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab Content: Products & Inventory Management */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Central Inventory & Expiry Tracking</h3>
                  <p className="text-xs text-slate-500">Live batch quantities and low stock thresholds</p>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                >
                  + Add New Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-500 uppercase font-bold text-xs">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price (৳)</th>
                      <th className="p-3">Batch & Expiry</th>
                      <th className="p-3">Available Stock</th>
                      <th className="p-3 text-right">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">
                          {prod.name}
                          {prod.isPrescriptionRequired && (
                            <span className="ml-1 text-[10px] text-rose-600 font-bold">Rx</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-500">{prod.sku}</td>
                        <td className="p-3">{prod.category}</td>
                        <td className="p-3 font-bold text-teal-700">৳ {prod.price}</td>
                        <td className="p-3">
                          <span className="font-mono text-[11px] block text-slate-600">{prod.batchNumber}</span>
                          <span className="text-[11px] text-slate-400">Exp: {prod.expiryDate}</span>
                        </td>
                        <td className="p-3">
                          <span className={`font-bold ${prod.stock <= prod.minStockThreshold ? 'text-amber-600' : 'text-slate-800'}`}>
                            {prod.stock} units
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleStockAdjust(prod.id, prod.stock - 50)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold"
                            >
                              -50
                            </button>
                            <button
                              onClick={() => handleStockAdjust(prod.id, prod.stock + 100)}
                              className="px-2 py-0.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded text-xs font-bold"
                            >
                              +100
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content: Demand Requests Review */}
          {activeTab === 'demand' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-lg">Hospital Restock Demand Requests</h3>
              <div className="space-y-3">
                {demandRequests.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 font-medium space-y-2">
                    <Package className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">No Demand Requests Yet</p>
                    <p className="text-xs text-slate-400">Institutional product sourcing requests will appear here for review.</p>
                  </div>
                ) : (
                  demandRequests.map((req) => (
                    <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{req.itemName}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                            Qty: {req.requestedQuantity}
                          </span>
                          <span className="text-xs text-slate-500">Requested by <strong>{req.organizationName}</strong></span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">"{req.explanation}"</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const updated = demandRequests.map(r => r.id === req.id ? { ...r, status: 'Approved' as const, adminNotes: 'Sourced and added to catalog' } : r);
                            setDemandRequests(updated);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                        >
                          Approve Sourcing
                        </button>
                        <button
                          onClick={() => {
                            const updated = demandRequests.map(r => r.id === req.id ? { ...r, status: 'Rejected' as const, adminNotes: 'Supplier out of production' } : r);
                            setDemandRequests(updated);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab Content: Reports */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-lg">Supply & Financial Reports</h3>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download Complete CSV Report
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border text-xs">
                  <span className="text-slate-400 block font-medium">Delivered Orders</span>
                  <strong className="text-xl text-slate-900 block mt-1">
                    {orders.filter(o => o.status === 'Delivered').length}
                  </strong>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border text-xs">
                  <span className="text-slate-400 block font-medium">In-Transit Shipments</span>
                  <strong className="text-xl text-teal-700 block mt-1">
                    {orders.filter(o => o.status === 'Shipped' || o.status === 'Processing').length}
                  </strong>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border text-xs">
                  <span className="text-slate-400 block font-medium">Cumulative Gross Volume</span>
                  <strong className="text-xl text-slate-900 block mt-1">
                    ৳ {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />

      {/* Organization Verification Modal */}
      <OrganizationVerificationModal
        org={selectedOrgForVerification}
        onClose={() => setSelectedOrgForVerification(null)}
      />

      {/* Organization Detailed History & Profile Modal */}
      <OrganizationDetailModal
        org={selectedOrgForDetail}
        orgOrders={orders.filter(o => o.organizationId === selectedOrgForDetail?.id || o.organizationName.toLowerCase().includes(selectedOrgForDetail?.name.toLowerCase() || ''))}
        onClose={() => setSelectedOrgForDetail(null)}
        onViewInvoice={(ord) => setSelectedOrderForInvoice(ord)}
      />
    </div>
  );
};


import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Crown,
  Boxes,
  Package,
  Settings,
  History,
  LogOut,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Search,
  ExternalLink,
  Sliders,
  CheckCircle2,
  Activity,
  FileText,
  Filter,
  AlertCircle,
  Eye,
  RefreshCw,
  UserCheck,
  Trash2,
} from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { PlatformStatsChart } from './PlatformStatsChart';
import { ManageAdminsModal } from './ManageAdminsModal';
import { Order, OrderStatus, Product, UserProfile, UserRole, OrganizationType } from '../../types';
import { InvoiceView } from '../invoice/InvoiceView';

interface OwnerDashboardPageProps {
  onNavigate: (view: string) => void;
}

type OwnerTab = 'overview' | 'users' | 'organizations' | 'admins' | 'products' | 'orders' | 'logs' | 'settings';

export const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({ onNavigate }) => {
  const {
    activityLogs,
    organizations,
    orders,
    products,
    users,
    dynamicOwnerStats,
    categories,
    logout,
    deleteProduct,
    deleteUser,
  } = useMediStockStore();

  const [activeTab, setActiveTab] = useState<OwnerTab>('overview');
  const [isManageAdminsOpen, setIsManageAdminsOpen] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  // Users Tab Filters
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | UserRole>('all');

  // Organizations Tab Filters
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [orgTypeFilter, setOrgTypeFilter] = useState<'all' | OrganizationType>('all');

  // Products Tab Filters
  const [prodSearchQuery, setProdSearchQuery] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState('all');

  // Orders Tab Filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');

  // Platform Settings State
  const [supplyMargin, setSupplyMargin] = useState(3.5);
  const [isVatExempt, setIsVatExempt] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Organizations
  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
      org.city.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
      org.representative.toLowerCase().includes(orgSearchQuery.toLowerCase());
    const matchesType = orgTypeFilter === 'all' || org.type === orgTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered Products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(prodSearchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(prodSearchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(prodSearchQuery.toLowerCase()) ||
      prod.manufacturer.toLowerCase().includes(prodSearchQuery.toLowerCase());
    const matchesCategory =
      prodCategoryFilter === 'all' || prod.category === prodCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      ord.organizationName.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus =
      orderStatusFilter === 'all' || ord.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveSettings = () => {
    setSettingsFeedback('Platform preferences successfully saved.');
    setTimeout(() => setSettingsFeedback(null), 3000);
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
        
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm shrink-0 space-y-6">
          
          {/* Owner Panel Badge */}
          <div className="flex items-center gap-3 p-2.5 bg-amber-50/60 rounded-2xl border border-amber-200/60">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm truncate">
                Owner Panel
              </h3>
              <span className="text-[11px] font-semibold text-amber-700 block">
                Super Administrator
              </span>
            </div>
          </div>

          {/* Navigation Links - All self-contained in Owner Dashboard */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 ${activeTab === 'users' ? 'text-white' : 'text-slate-400'}`} />
                <span>Users</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === 'users' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {dynamicOwnerStats.totalUsers}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('organizations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'organizations'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`w-4 h-4 ${activeTab === 'organizations' ? 'text-white' : 'text-slate-400'}`} />
                <span>Organizations</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === 'organizations' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {dynamicOwnerStats.totalOrganizations}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admins')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'admins'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Crown className={`w-4 h-4 ${activeTab === 'admins' ? 'text-white' : 'text-amber-600'}`} />
              <span>Admins</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes className={`w-4 h-4 ${activeTab === 'products' ? 'text-white' : 'text-slate-400'}`} />
                <span>Products</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === 'products' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-slate-400'}`} />
                <span>Orders</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === 'orders' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400'}`} />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'logs'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <History className={`w-4 h-4 ${activeTab === 'logs' ? 'text-white' : 'text-slate-400'}`} />
                <span>Activity Logs</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === 'logs' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {activityLogs.length}
              </span>
            </button>
          </nav>

          {/* Super Admin Key Status */}
          <div className="pt-4 border-t border-slate-100">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-900 block">Governance Level</span>
              <p className="text-[11px] text-amber-700 leading-tight">
                Root authority over RBAC roles, product catalog, institutional oversight & audit trails.
              </p>
            </div>
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                logout();
                onNavigate('home');
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

        </aside>

        {/* Right Main Content */}
        <main className="flex-1 w-full space-y-8">
          
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-extrabold uppercase tracking-wider">
                  Super Admin Console
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 capitalize">{activeTab} View</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Owner Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Executive platform supervision, revenue insights and administrative governance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsManageAdminsOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>Manage Admins</span>
              </button>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* 1. Total Users */}
            <div 
              onClick={() => setActiveTab('users')}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:border-amber-400 cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Total Users
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                {dynamicOwnerStats.totalUsers}
              </span>
              <span className="text-[11px] font-semibold text-blue-700 mt-1 block">
                Active registered accounts →
              </span>
            </div>

            {/* 2. Total Organizations */}
            <div 
              onClick={() => setActiveTab('organizations')}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:border-amber-400 cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Total Organizations
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                {dynamicOwnerStats.totalOrganizations}
              </span>
              <span className="text-[11px] font-semibold text-teal-700 mt-1 block">
                Pharmacies & Hospitals →
              </span>
            </div>

            {/* 3. Total Orders */}
            <div 
              onClick={() => setActiveTab('orders')}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:border-amber-400 cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
                <Package className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Total Orders
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                {dynamicOwnerStats.totalOrders}
              </span>
              <span className="text-[11px] font-semibold text-rose-700 mt-1 block">
                Institutional restock tracking →
              </span>
            </div>

            {/* 4. Platform Revenue */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Platform Revenue
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5 block">
                ৳ {dynamicOwnerStats.platformRevenue.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 mt-1 block">
                Cumulative Gross Volume
              </span>
            </div>

          </div>

          {/* Quick Actions Bar */}
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight mb-3">
              Quick Governance Actions
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <button
                onClick={() => setActiveTab('users')}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-amber-700">
                    Manage Users
                  </h4>
                  <p className="text-[11px] text-slate-400">View registered accounts</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('admins')}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-amber-700">
                    Manage Admins
                  </h4>
                  <p className="text-[11px] text-slate-400">Promote & demote staff</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-rose-700">
                    View All Orders
                  </h4>
                  <p className="text-[11px] text-slate-400">Restock tracking</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-slate-900">
                    System Settings
                  </h4>
                  <p className="text-[11px] text-slate-400">Platform preferences</p>
                </div>
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <PlatformStatsChart customData={dynamicOwnerStats.chartPoints.length >= 2 ? dynamicOwnerStats.chartPoints : undefined} />

              {/* Activity Audit Log Preview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-600" />
                    <h3 className="font-extrabold text-slate-900 text-base">Recent Platform Audit Trail</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('logs')}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 cursor-pointer"
                  >
                    View All Logs →
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {activityLogs.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      No system events recorded yet. Platform actions will generate audit trails automatically.
                    </div>
                  ) : (
                    activityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                        <div>
                          <span className="font-bold text-slate-900">{log.action}:</span>{' '}
                          <span className="text-slate-600">{log.target}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px] shrink-0">
                          {log.timestamp}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Platform Users Directory</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                      {filteredUsers.length} Users
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete registry of all registered accounts across all MediStock roles
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search users..."
                      className="w-48 sm:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Role Filter */}
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value as any)}
                    className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="normal_user">Normal Users</option>
                    <option value="organization">Organizations</option>
                    <option value="admin">Admins</option>
                    <option value="owner">Owners</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Registered Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No users found matching your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const roleBadges: Record<UserRole, string> = {
                          owner: 'bg-amber-100 text-amber-800 border-amber-300',
                          admin: 'bg-purple-100 text-purple-800 border-purple-300',
                          organization: 'bg-blue-100 text-blue-800 border-blue-300',
                          normal_user: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                        };

                        return (
                          <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                                />
                                <div>
                                  <p className="font-bold text-slate-900 leading-tight">{u.name}</p>
                                  <span className="text-[10px] text-slate-400 font-mono">{u.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-slate-600 font-medium">{u.email}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${roleBadges[u.role] || 'bg-slate-100'}`}>
                                {u.role.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {u.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">
                              {u.createdAt}
                            </td>
                            <td className="p-3 text-right">
                              {u.role !== 'owner' ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setIsManageAdminsOpen(true)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 font-bold text-[11px] transition-colors"
                                  >
                                    Manage Role
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to permanently delete user "${u.name}" (${u.email})?`)) {
                                        deleteUser(u.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors inline-flex items-center"
                                    title="Delete User"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] font-semibold text-amber-700">Root Owner</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORGANIZATIONS */}
          {activeTab === 'organizations' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-600" />
                    <span>Institutional Health Partners</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
                      {filteredOrgs.length} Institutions
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Licensed hospitals and pharmacies procuring bulk medical inventory
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={orgSearchQuery}
                      onChange={(e) => setOrgSearchQuery(e.target.value)}
                      placeholder="Search institutions..."
                      className="w-48 sm:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Type Filter */}
                  <select
                    value={orgTypeFilter}
                    onChange={(e) => setOrgTypeFilter(e.target.value as any)}
                    className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="Hospital">Hospitals</option>
                    <option value="Pharmacy">Pharmacies</option>
                    <option value="Clinic">Clinics</option>
                  </select>
                </div>
              </div>

              {/* Organizations Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <th className="p-3">Organization</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">ID / Reg No.</th>
                      <th className="p-3">Representative & Contact</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Orders & Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrgs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-slate-400">
                          <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-600">No registered organizations found.</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Hospitals and pharmacies registering via the Institutional Portal will be listed here automatically.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrgs.map((org) => (
                        <tr key={org.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3">
                            <p className="font-bold text-slate-900 leading-tight">{org.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">{org.city || org.address || 'Bangladesh'}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              org.type === 'Hospital'
                                ? 'bg-blue-100 text-blue-800'
                                : org.type === 'Pharmacy'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-teal-100 text-teal-800'
                            }`}>
                              {org.type}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 font-mono text-[11px]">{org.id}</td>
                          <td className="p-3">
                            <p className="font-semibold text-slate-800">{org.representative}</p>
                            <span className="text-[11px] text-slate-400">{org.email} • {org.phone}</span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              org.verificationStatus === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700'
                                : org.verificationStatus === 'Pending'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                org.verificationStatus === 'Approved' ? 'bg-emerald-500' : org.verificationStatus === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                              }`} />
                              {org.verificationStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <p className="font-bold text-slate-900">{org.totalOrders} Orders</p>
                            <span className="text-[11px] font-semibold text-emerald-700">৳ {org.totalSpent.toLocaleString()}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ADMINS GOVERNANCE */}
          {activeTab === 'admins' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-600" />
                    <span>Platform Administrators & Staff Governance</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Super Admin authority to assign, monitor and revoke administrative credentials
                  </p>
                </div>

                <button
                  onClick={() => setIsManageAdminsOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Assign / Revoke Roles</span>
                </button>
              </div>

              {/* Admins Overview List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users
                  .filter((u) => u.role === 'admin' || u.role === 'owner')
                  .map((admin) => (
                    <div
                      key={admin.id}
                      className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={admin.avatar}
                          alt={admin.name}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-500/30"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{admin.name}</h4>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              admin.role === 'owner' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {admin.role === 'owner' ? 'Super Admin' : 'Admin'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{admin.email}</p>
                          <span className="text-[10px] text-slate-400">Created: {admin.createdAt}</span>
                        </div>
                      </div>

                      <div>
                        {admin.role !== 'owner' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsManageAdminsOpen(true)}
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-700 font-bold text-xs shadow-2xs"
                            >
                              Manage
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete admin "${admin.name}" (${admin.email})?`)) {
                                  deleteUser(admin.id);
                                }
                              }}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Delete Admin Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-amber-700 px-3 py-1 bg-amber-100/60 rounded-xl">
                            Master Owner
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-indigo-600" />
                    <span>National Medicine & Healthcare Inventory</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                      {filteredProducts.length} Items
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Central pharmaceutical catalog active across MediStock platform
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={prodSearchQuery}
                      onChange={(e) => setProdSearchQuery(e.target.value)}
                      placeholder="Search medicines, SKU..."
                      className="w-48 sm:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={prodCategoryFilter}
                    onChange={(e) => setProdCategoryFilter(e.target.value)}
                    className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Manufacturer</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3 text-right">Price (৳)</th>
                      <th className="p-3 text-right">Stock Level</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 rounded-xl object-cover bg-slate-100 border border-slate-200"
                              />
                              <div>
                                <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
                                <span className="text-[10px] text-slate-400">SKU: {p.sku} • {p.batchNumber}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">{p.manufacturer}</td>
                          <td className="p-3 text-slate-500">{p.unit}</td>
                          <td className="p-3 text-right font-bold text-slate-900">৳ {p.price}</td>
                          <td className="p-3 text-right">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stock > 10
                                ? 'bg-emerald-50 text-emerald-700'
                                : p.stock > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {p.stock} in stock
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to permanently delete "${p.name}" (SKU: ${p.sku})?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
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

          {/* TAB 6: RESTOCK ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-rose-600" />
                    <span>Institutional Restock & Procurement Orders</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                      {filteredOrders.length} Orders
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Central restock tracking for hospital and pharmacy wholesale procurement
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Search orders..."
                      className="w-48 sm:w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Institution</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Items</th>
                      <th className="p-3 text-right">Total (৳)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-400">
                          <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="font-semibold text-slate-600">No restock orders found.</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Orders placed by hospitals and pharmacies will appear here with live tracking.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const statusColors: Record<OrderStatus, string> = {
                          Pending: 'bg-amber-50 text-amber-700 border-amber-200',
                          Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
                          Processing: 'bg-purple-50 text-purple-700 border-purple-200',
                          Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                          Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
                        };

                        return (
                          <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">{ord.id}</td>
                            <td className="p-3">
                              <p className="font-bold text-slate-800 leading-tight">{ord.organizationName}</p>
                              <span className="text-[10px] text-slate-400">{ord.organizationAddress || 'Bangladesh'}</span>
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">{ord.date}</td>
                            <td className="p-3 text-slate-600">
                              {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                            </td>
                            <td className="p-3 text-right font-black text-slate-900">
                              ৳ {ord.total.toLocaleString()}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[ord.status] || 'bg-slate-100'}`}>
                                {ord.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => setSelectedOrderForInvoice(ord)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Invoice</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <History className="w-5 h-5 text-amber-600" />
                    <span>System Audit & Security Logs</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Immutable event log capturing authentication, inventory adjustments, and status changes
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold">
                  {activityLogs.length} Events
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Actor & Role</th>
                      <th className="p-3">Action Performed</th>
                      <th className="p-3">Target Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activityLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400">
                          Audit trail is clean. No activity recorded yet.
                        </td>
                      </tr>
                    ) : (
                      activityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-400">{log.timestamp}</td>
                          <td className="p-3 font-bold text-slate-900">{log.actorName} ({log.actorRole})</td>
                          <td className="p-3 font-semibold text-amber-700">{log.action}</td>
                          <td className="p-3 text-slate-600">{log.target}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: SYSTEM SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 max-w-2xl space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-700" />
                  <span>Platform & Institutional Configuration</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage global margin structures, health policy tax exemptions, and warehouse maintenance
                </p>
              </div>

              {settingsFeedback && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settingsFeedback}</span>
                </div>
              )}
              
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Central Sourcing Margin (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={supplyMargin}
                    onChange={(e) => setSupplyMargin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Applied to institutional B2B bulk orders.</p>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVatExempt}
                      onChange={(e) => setIsVatExempt(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-bold text-slate-800">Healthcare Drug VAT Exemption (National Health Policy)</span>
                  </label>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-bold text-rose-700">Enable Warehouse Maintenance Window</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                >
                  Save Platform Preferences
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Manage Admins Modal */}
      <ManageAdminsModal
        isOpen={isManageAdminsOpen}
        onClose={() => setIsManageAdminsOpen(false)}
      />
    </div>
  );
};

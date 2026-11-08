import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  HeartHandshake,
  Package,
  Bell,
  User,
  Settings,
  LogOut,
  ArrowRight,
  Droplet,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Save,
  Check,
  Key,
  Smartphone,
  Mail,
  MapPin,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { Product, BloodGroup } from '../../types';

interface UserDashboardPageProps {
  onNavigate: (view: string, categoryFilter?: string) => void;
  onOpenProductModal: (product: Product) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onNavigate,
  onOpenProductModal,
}) => {
  const {
    currentUser,
    products,
    logout,
    updateUserProfile,
    updateUserSettings,
    changePassword,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    orders,
    bloodRequests,
  } = useMediStockStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'blood' | 'notifications' | 'profile' | 'settings'>('dashboard');

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>((currentUser?.bloodGroup as BloodGroup) || 'B+');
  const [city, setCity] = useState(currentUser?.city || 'Dhaka');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Settings State
  const [emailAlerts, setEmailAlerts] = useState(currentUser?.settings?.emailAlerts ?? true);
  const [smsAlerts, setSmsAlerts] = useState(currentUser?.settings?.smsAlerts ?? true);
  const [twoFactor, setTwoFactor] = useState(currentUser?.settings?.twoFactor ?? false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sync profile fields dynamically whenever currentUser changes or updates
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAvatar(currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80');
      setBloodGroup((currentUser.bloodGroup as BloodGroup) || 'B+');
      setCity(currentUser.city || 'Dhaka');
      setAddress(currentUser.address || '');
      if (currentUser.settings) {
        setEmailAlerts(currentUser.settings.emailAlerts);
        setSmsAlerts(currentUser.settings.smsAlerts);
        setTwoFactor(currentUser.settings.twoFactor);
      }
    }
  }, [currentUser]);

  const recentProducts = products.slice(0, 4);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      avatar,
      bloodGroup,
      city,
      address,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSaveSettings = (newSettings: { emailAlerts?: boolean; smsAlerts?: boolean; twoFactor?: boolean }) => {
    const updated = {
      emailAlerts: newSettings.emailAlerts ?? emailAlerts,
      smsAlerts: newSettings.smsAlerts ?? smsAlerts,
      twoFactor: newSettings.twoFactor ?? twoFactor,
    };
    updateUserSettings(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    try {
      await changePassword(newPassword);
      setPasswordSaved(true);
      setNewPassword('');
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">
        
        {/* Left Sidebar matching Project.png Screen 3 */}
        <aside className="w-full lg:w-64 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm shrink-0 space-y-6">
          
          {/* User Profile Snippet */}
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={currentUser?.avatar || avatar}
              alt={currentUser?.name || name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500/20"
            />
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm truncate">
                {currentUser?.name || name}
              </h3>
              <span className="text-[11px] font-semibold text-teal-600 block">
                Normal User
              </span>
            </div>
          </div>

          {/* Nav Items matching Project.png Screen 3 with functional Tabs */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('products')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-slate-400" />
              <span>Browse Products</span>
            </button>

            <button
              onClick={() => onNavigate('blood')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
            >
              <HeartHandshake className="w-4 h-4 text-rose-500" />
              <span>Blood Donation</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'notifications'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-slate-400" />
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                  {unreadCount}
                </span>
              )}
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
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-teal-50 text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Organization Registration Prompt */}
          <div className="pt-4 border-t border-slate-100">
            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-xs">
              <p className="font-bold text-teal-900">Are you a Pharmacy or Hospital?</p>
              <p className="text-[11px] text-teal-700 mt-0.5">Apply for institutional B2B bulk supply access.</p>
              <button
                onClick={() => onNavigate('register-org')}
                className="mt-2 text-xs font-bold text-teal-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Register Organization →
              </button>
            </div>
          </div>

          {/* Logout matching Project.png */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

        </aside>

        {/* Right Main Content area displaying dynamic Tab */}
        <main className="flex-1 w-full space-y-8">
          
          {/* TAB 1: DASHBOARD OVERVIEW (Screen 3) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Header Greeting matching Project.png */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  Hello, {currentUser?.name || name} 👋
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Welcome to MediStock — Centralized Healthcare Supply Portal
                </p>
              </div>

              {/* 3 Quick Action Tiles matching Project.png Screen 3 */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6">
                
                {/* 1. Browse Products */}
                <div
                  onClick={() => onNavigate('products')}
                  className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-4"
                >
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-base group-hover:text-emerald-700 transition-colors leading-tight">
                      Browse Products
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-500 mt-1">
                      Shop essential healthcare products & supplies
                    </p>
                  </div>
                </div>

                {/* 2. Blood Donation */}
                <div
                  onClick={() => onNavigate('blood')}
                  className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-4"
                >
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <HeartHandshake className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-base group-hover:text-rose-700 transition-colors leading-tight">
                      Blood Donation
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-500 mt-1">
                      Donate blood or request emergency donors
                    </p>
                  </div>
                </div>

                {/* 3. My Orders / Tracking */}
                <div
                  onClick={() => onNavigate('products')}
                  className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-4"
                >
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Package className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-base group-hover:text-teal-700 transition-colors leading-tight">
                      Supply Catalog
                    </h3>
                    <p className="hidden sm:block text-xs text-slate-500 mt-1">
                      Browse 42 verified medicines across 14 categories
                    </p>
                  </div>
                </div>

              </div>

              {/* Recent Products Row matching Project.png Screen 3 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    Recent Products
                  </h3>
                  <button
                    onClick={() => onNavigate('products')}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    View All ({products.length})
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
                  {recentProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onOpenProductModal(prod)}
                      className="bg-slate-50/60 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-slate-100 hover:border-teal-200 hover:bg-white hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-white mb-2 border border-slate-100">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs truncate group-hover:text-teal-700">
                          {prod.name}
                        </h4>
                        <span className="text-xs font-extrabold text-teal-700 mt-1 block">
                          ৳ {prod.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* "Donate Blood Save Lives" Banner matching Project.png Screen 3 */}
              <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-rose-50 via-red-50 to-pink-50 border border-rose-200 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-100 px-3 py-1 rounded-full">
                      Voluntary Blood Network
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Donate Blood <br className="hidden sm:inline" />
                      <span className="text-rose-600">Save Lives</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm">
                      Be a hero. Donate blood. Thousands of emergency patients await compatible donors.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => onNavigate('blood')}
                        className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                      >
                        Donate Now
                      </button>
                    </div>
                  </div>

                  {/* Graphic container matching Project.png */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white shadow-md border border-rose-100 flex items-center justify-center p-4">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-2">
                        <Droplet className="w-10 h-10 fill-rose-600" />
                      </div>
                      <span className="text-xs font-extrabold text-rose-600">MediStock Blood Care</span>
                      <span className="text-[10px] text-slate-400">Emergency 24/7 Match</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: NOTIFICATIONS VIEW (Now 100% Functional!) */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Bell className="w-6 h-6 text-teal-600" />
                    <span>Notifications & Alerts</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Stay updated with real-time supply dispatches and medical emergency notices
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllNotificationsRead}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Mark All as Read
                  </button>
                  <button
                    onClick={clearNotifications}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Clear All Notifications"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Bell className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-semibold text-sm">No new notifications</p>
                  <p className="text-xs text-slate-400">You're all caught up!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`py-4 flex items-start gap-4 transition-colors cursor-pointer ${
                        !n.read ? 'bg-teal-50/40 -mx-6 px-6 rounded-2xl' : ''
                      }`}
                      title={!n.read ? 'Click to mark as read' : undefined}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        n.type === 'blood'
                          ? 'bg-rose-100 text-rose-600'
                          : n.type === 'stock'
                          ? 'bg-cyan-100 text-cyan-700'
                          : n.type === 'security'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        {n.type === 'blood' ? <Droplet className="w-5 h-5 fill-rose-600" /> : <Bell className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-sm font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {n.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROFILE MANAGER (Now 100% Functional!) */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <User className="w-6 h-6 text-teal-600" />
                  <span>My Profile</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your personal information, contact numbers and donor registration details
                </p>
              </div>

              {profileSaved && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">Profile updated successfully and synced with MediStock database!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Avatar Row */}
                <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-sm"
                  />
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-bold text-slate-700 block">Avatar Image URL</label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={currentUser?.email || 'user@medistock.com'}
                      className="w-full px-3.5 py-2.5 bg-slate-100 text-slate-500 text-xs sm:text-sm rounded-xl border border-slate-200 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1712 000000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e: any) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none cursor-pointer"
                    >
                      <option value="A+">A Positive (A+)</option>
                      <option value="A-">A Negative (A-)</option>
                      <option value="B+">B Positive (B+)</option>
                      <option value="B-">B Negative (B-)</option>
                      <option value="AB+">AB Positive (AB+)</option>
                      <option value="AB-">AB Negative (AB-)</option>
                      <option value="O+">O Positive (O+)</option>
                      <option value="O-">O Negative (O-)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Division / City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none cursor-pointer"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Home / Delivery Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, area, postal code"
                      className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SETTINGS & SECURITY (Now 100% Functional!) */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-8 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Settings className="w-6 h-6 text-teal-600" />
                  <span>Account Settings & Security</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage login credentials, password, and notification preferences
                </p>
              </div>

              {passwordSaved && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">Password successfully updated!</span>
                </div>
              )}

              {settingsSaved && (
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span className="font-bold">Settings updated and synced with database!</span>
                </div>
              )}

              {/* Password Change Form */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Key className="w-4 h-4 text-teal-600" />
                  <span>Change Password</span>
                </h3>

                <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Notification Preferences */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4 text-teal-600" />
                  <span>Notification Preferences</span>
                </h3>

                <div className="space-y-3 max-w-xl">
                  <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Email Notifications</p>
                      <p className="text-[11px] text-slate-500">Receive restock confirmations and order receipts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setEmailAlerts(val);
                        handleSaveSettings({ emailAlerts: val });
                      }}
                      className="w-4 h-4 accent-teal-600 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-slate-800">SMS Emergency Blood Alerts</p>
                      <p className="text-[11px] text-slate-500">Get notified when compatible urgent blood requests are made</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsAlerts}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setSmsAlerts(val);
                        handleSaveSettings({ smsAlerts: val });
                      }}
                      className="w-4 h-4 accent-teal-600 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
                      <p className="text-[11px] text-slate-500">Enhance your security during sign-in verification</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactor}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setTwoFactor(val);
                        handleSaveSettings({ twoFactor: val });
                      }}
                      className="w-4 h-4 accent-teal-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-slate-100">
                <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-rose-900 text-xs sm:text-sm">Sign Out Session</h4>
                    <p className="text-[11px] text-rose-700 mt-0.5">End your current session across this browser.</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                  >
                    Sign Out Now
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>
    </div>
  );
};

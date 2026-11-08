import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Plus, 
  Menu, 
  X, 
  Heart, 
  Building2, 
  ShieldCheck, 
  Crown,
  ChevronDown,
  LogOut,
  Bell
} from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { UserRole } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, categoryFilter?: string) => void;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCart,
  onOpenLogin,
  onOpenNotifications,
}) => {
  const { activeRole, currentUser, logout, cart, products, notifications } = useMediStockStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Filter products for quick search dropdown
  const searchResults = searchQuery.trim() === ''
    ? []
    : products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('products');
      setIsSearchFocused(false);
    }
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Products', view: 'products' },
    { label: 'Blood Donation', view: 'blood' },
    { label: 'How It Works', view: 'how-it-works' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  const roleLabels: Record<UserRole, { title: string; color: string; icon: any; dashboardView: string }> = {
    normal_user: { title: 'Normal User', color: 'bg-emerald-100 text-emerald-800', icon: User, dashboardView: 'user-dashboard' },
    organization: { title: 'Hospital/Pharmacy', color: 'bg-blue-100 text-blue-800', icon: Building2, dashboardView: 'org-dashboard' },
    admin: { title: 'Admin Panel', color: 'bg-purple-100 text-purple-800', icon: ShieldCheck, dashboardView: 'admin-dashboard' },
    owner: { title: 'Owner / Super Admin', color: 'bg-amber-100 text-amber-800', icon: Crown, dashboardView: 'owner-dashboard' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs transition-all w-full overflow-x-clip">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4 py-2 sm:py-3 w-full">
        {/* Brand Logo matching Project.png */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition-colors shrink-0">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          </div>
          <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
            MediStock
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => onNavigate(link.view)}
              className={`text-sm font-medium transition-colors hover:text-teal-600 ${
                currentView === link.view
                  ? 'text-teal-600 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Search Bar in Navbar matching Project.png */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="Search for medicines, masks, or more..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-lg border border-transparent focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </form>

          {/* Quick Search Dropdown Preview */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
                Medicines & Medical Supplies
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onNavigate('products');
                      setIsSearchFocused(false);
                    }}
                    className="p-2.5 hover:bg-teal-50/50 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-800 leading-tight">{item.name}</p>
                        <span className="text-xs text-slate-500">{item.category} • {item.unit}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-teal-700 whitespace-nowrap">৳ {item.price}</span>
                  </div>
                ))}
              </div>
              <div 
                onClick={() => onNavigate('products')}
                className="p-2 text-center text-xs font-semibold text-teal-600 bg-slate-50 hover:bg-teal-50 cursor-pointer transition-colors border-t border-slate-100"
              >
                View all results in Product Catalog →
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons & Login */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Notifications Button */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              aria-label="Notifications"
              className="relative p-1.5 sm:p-2.5 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Shopping Cart"
            className="relative p-1.5 sm:p-2.5 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-100 transition-colors shrink-0"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-teal-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Account / Role Badge */}
          {currentUser ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 pl-1.5 sm:pl-2 rounded-lg border border-slate-200 hover:border-teal-500 bg-white transition-all text-left shrink-0"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-teal-500/30 shrink-0"
                />
                <div className="hidden sm:block text-xs">
                  <p className="font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                  <span className="text-[10px] text-teal-600 font-medium uppercase tracking-wider">
                    {roleLabels[activeRole].title}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Role Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        onNavigate(roleLabels[activeRole].dashboardView);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium flex items-center gap-2 transition-colors"
                    >
                      {React.createElement(roleLabels[activeRole].icon, { className: 'w-4 h-4 text-teal-600' })}
                      Open {roleLabels[activeRole].title}
                    </button>
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        onNavigate('register-org');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium flex items-center gap-2 transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-teal-600" />
                      Register New Organization
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        logout();
                        onNavigate('home');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login Button matching Project.png */
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow-teal-600/20 active:scale-95 shrink-0"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0 ml-0.5"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, masks..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 text-sm rounded-lg"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  onNavigate(link.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentView === link.view ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate(roleLabels[activeRole].dashboardView);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Go to {roleLabels[activeRole].title}
              </button>
              <button
                onClick={() => {
                  onNavigate('register-org');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 border border-teal-600 text-teal-700 text-xs font-semibold rounded-lg"
              >
                Register Your Hospital / Pharmacy
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


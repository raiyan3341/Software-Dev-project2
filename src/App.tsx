import React, { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { ProductCatalogPage } from './components/catalog/ProductCatalogPage';
import { OrganizationRegisterPage } from './components/organization/OrganizationRegisterPage';
import { UserDashboardPage } from './components/dashboard/UserDashboardPage';
import { BloodDonationPage } from './components/blood/BloodDonationPage';
import { OrganizationDashboardPage } from './components/organization/OrganizationDashboardPage';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';
import { OwnerDashboardPage } from './components/owner/OwnerDashboardPage';
import { AboutPage, ContactPage } from './components/common/InformationalPages';
import { HowItWorksPage } from './components/common/HowItWorksPage';
import { CartDrawer } from './components/common/CartDrawer';
import { LoginModal } from './components/common/LoginModal';
import { ProductDetailModal } from './components/common/ProductDetailModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AccessRestricted } from './components/common/AccessRestricted';
import { Product } from './types';
import { useMediStockStore } from './data/store';

const VALID_VIEWS = [
  'home',
  'products',
  'register-org',
  'user-dashboard',
  'blood',
  'org-dashboard',
  'admin-dashboard',
  'owner-dashboard',
  'how-it-works',
  'about',
  'contact',
];

const getInitialView = (): string => {
  try {
    // 1. Check URL hash first (e.g. #products, #blood, #about, #how-it-works)
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash && VALID_VIEWS.includes(hash)) {
      return hash;
    }

    // 2. Check localStorage
    const saved = localStorage.getItem('medistock_current_view');
    if (saved && VALID_VIEWS.includes(saved)) {
      return saved;
    }
  } catch (e) {
    // ignore
  }
  return 'home';
};

export default function App() {
  const { currentUser, activeRole } = useMediStockStore();
  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem('medistock_category_filter') || undefined;
    } catch (e) {
      return undefined;
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'signin' | 'signup'>('signin');
  const [loginPostRedirect, setLoginPostRedirect] = useState<string | null>(null);

  const handleOpenLogin = (mode: 'signin' | 'signup' = 'signin', redirect?: string) => {
    setLoginModalMode(mode);
    setLoginPostRedirect(redirect || null);
    setIsLoginOpen(true);
  };
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRlsNotice, setShowRlsNotice] = useState(false);

  useEffect(() => {
    const onRlsBlocked = () => setShowRlsNotice(true);
    window.addEventListener('supabase_rls_detected', onRlsBlocked);
    return () => window.removeEventListener('supabase_rls_detected', onRlsBlocked);
  }, []);

  // Auto-detect return from Google OAuth
  React.useEffect(() => {
    if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
      handleNavigate('user-dashboard');
      setTimeout(() => {
        window.history.replaceState(null, '', window.location.pathname + '#user-dashboard');
      }, 500);
    }
  }, []);

  // Listen to browser Back / Forward buttons and Hash changes
  React.useEffect(() => {
    // Set initial hash if not set
    const currentHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!currentHash && currentView) {
      window.location.hash = currentView;
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash && VALID_VIEWS.includes(hash) && hash !== currentView) {
        setCurrentView(hash);
        try {
          localStorage.setItem('medistock_current_view', hash);
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  const handleNavigate = (view: string, category?: string) => {
    setCurrentView(view);
    setCategoryFilter(category);
    try {
      localStorage.setItem('medistock_current_view', view);
      if (category) {
        localStorage.setItem('medistock_category_filter', category);
      } else {
        localStorage.removeItem('medistock_category_filter');
      }
      if (window.location.hash !== `#${view}`) {
        window.location.hash = view;
      }
    } catch (e) {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-800">
      {/* Universal MediStock Navbar matching Project.png */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLogin={() => handleOpenLogin('signin')}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* Supabase PostgreSQL RLS Notice Banner */}
      {showRlsNotice && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-md z-50 animate-in fade-in">
          <div className="flex items-center gap-2 max-w-4xl">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-200" />
            <span>
              <strong>Supabase Database Lock:</strong> PostgreSQL Row-Level Security (RLS) is currently preventing table writes. Run the 1-click script in Supabase SQL Editor to unlock full real-time database synchronization.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://supabase.com/dashboard/project/zzsudxjzrsoyhnpwlqeb/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-white text-amber-900 font-bold text-xs rounded-lg hover:bg-amber-50 flex items-center gap-1 transition-colors"
            >
              <span>Open SQL Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setShowRlsNotice(false)}
              className="p-1 hover:bg-amber-700 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1">
        {/* Screen 1: Homepage (Public) */}
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenProductModal={(product) => setSelectedProduct(product)}
          />
        )}

        {/* Screen 2: Product Catalog / Search & Filter */}
        {currentView === 'products' && (
          <ProductCatalogPage
            initialCategory={categoryFilter}
            onOpenProductModal={(product) => setSelectedProduct(product)}
            onNavigateDemandRequest={() => handleNavigate('org-dashboard')}
          />
        )}

        {/* Screen 4: Organization Registration (Hospital / Pharmacy) */}
        {currentView === 'register-org' && (
          <OrganizationRegisterPage
            onNavigate={handleNavigate}
            onOpenLogin={handleOpenLogin}
          />
        )}

        {/* Screen 3: User Dashboard (Normal User) */}
        {currentView === 'user-dashboard' && (
          currentUser ? (
            <UserDashboardPage
              onNavigate={handleNavigate}
              onOpenProductModal={(product) => setSelectedProduct(product)}
            />
          ) : (
            <AccessRestricted
              requiredRole="normal_user"
              onNavigate={handleNavigate}
              onOpenLogin={() => setIsLoginOpen(true)}
            />
          )
        )}

        {/* Screen 8: Blood Donation & Donor Finder */}
        {currentView === 'blood' && (
          <BloodDonationPage
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {/* Screen 5 & Screen 9: Organization Dashboard & Invoice View */}
        {currentView === 'org-dashboard' && (
          currentUser && (activeRole === 'organization' || currentUser.organizationId) ? (
            <OrganizationDashboardPage
              onNavigate={handleNavigate}
              onOpenProductModal={(product) => setSelectedProduct(product)}
            />
          ) : (
            <AccessRestricted
              requiredRole="organization"
              onNavigate={handleNavigate}
              onOpenLogin={() => handleOpenLogin('signin')}
            />
          )
        )}

        {/* Screen 6: Admin Dashboard */}
        {currentView === 'admin-dashboard' && (
          currentUser && activeRole === 'admin' ? (
            <AdminDashboardPage
              onNavigate={handleNavigate}
              onOpenProductModal={(product) => setSelectedProduct(product)}
            />
          ) : (
            <AccessRestricted
              requiredRole="admin"
              onNavigate={handleNavigate}
              onOpenLogin={() => setIsLoginOpen(true)}
            />
          )
        )}

        {/* Screen 7: Owner Dashboard */}
        {currentView === 'owner-dashboard' && (
          currentUser && activeRole === 'owner' ? (
            <OwnerDashboardPage
              onNavigate={handleNavigate}
            />
          ) : (
            <AccessRestricted
              requiredRole="owner"
              onNavigate={handleNavigate}
              onOpenLogin={() => setIsLoginOpen(true)}
            />
          )
        )}

        {/* Informative Pages */}
        {currentView === 'how-it-works' && (
          <HowItWorksPage
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage
            onNavigate={handleNavigate}
          />
        )}

        {/* Fallback */}
        {currentView !== 'home' && currentView !== 'products' && currentView !== 'register-org' && currentView !== 'user-dashboard' && currentView !== 'blood' && currentView !== 'org-dashboard' && currentView !== 'admin-dashboard' && currentView !== 'owner-dashboard' && currentView !== 'about' && currentView !== 'how-it-works' && currentView !== 'contact' && (
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-4">
              Step Transition
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              View: <span className="capitalize text-teal-600">{currentView.replace('-', ' ')}</span>
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              This module is scheduled in the upcoming implementation steps. Click Home or Products to continue browsing.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => handleNavigate('home')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs hover:bg-slate-800 transition-all"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => handleNavigate('products')}
                className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold shadow-xs hover:bg-teal-700 transition-all"
              >
                Open Product Catalog
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Universal Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={handleNavigate}
        onOpenLogin={handleOpenLogin}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setLoginPostRedirect(null);
        }}
        onNavigate={handleNavigate}
        initialMode={loginModalMode}
        postAuthRedirect={loginPostRedirect}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

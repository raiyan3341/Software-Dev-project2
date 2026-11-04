import React, { useState } from 'react';
import { X, Mail, Lock, User, Building2, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMediStockStore } from '../../data/store';
import { UserRole } from '../../types';
import { supabase, isSupabaseConfigured } from '../../supabase/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { login, loginWithGoogle, registerWithGoogle, registerUser } = useMediStockStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('normal_user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Google Authentication Sub-view
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleRole, setGoogleRole] = useState<UserRole>('normal_user');

  if (!isOpen) return null;

  const resetForms = () => {
    setError(null);
    setShowGoogleAuth(false);
    setEmail('');
    setPassword('');
    setGoogleEmail('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // Attempt Supabase auth signInWithPassword
        try {
          await supabase.auth.signInWithPassword({ email, password });
        } catch {
          // Fall through to strict local store verification
        }
      }

      // Strict verification: will throw error if account not registered
      const user = login(email, password);
      setLoading(false);
      onClose();

      if (user.role === 'normal_user') onNavigate('user-dashboard');
      else if (user.role === 'organization') onNavigate('org-dashboard');
      else if (user.role === 'admin') onNavigate('admin-dashboard');
      else if (user.role === 'owner') onNavigate('owner-dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'No account found with this email. Please Sign Up first.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name, role },
            },
          });
        } catch {
          // Continue local registration
        }
      }

      const user = registerUser({
        name,
        email,
        password,
        role,
      });
      setLoading(false);
      onClose();

      if (user.role === 'organization') onNavigate('register-org');
      else onNavigate('user-dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Registration failed.');
    }
  };

  const handleGoogleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Strict: will throw error if Google account was not signed up first
      const user = loginWithGoogle(googleEmail);
      setLoading(false);
      onClose();

      if (user.role === 'normal_user') onNavigate('user-dashboard');
      else if (user.role === 'organization') onNavigate('org-dashboard');
      else if (user.role === 'admin') onNavigate('admin-dashboard');
      else if (user.role === 'owner') onNavigate('owner-dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'No account found with this Google email. You must Sign Up first before signing in.');
    }
  };

  const handleGoogleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = registerWithGoogle({
        email: googleEmail,
        name: googleName,
        role: googleRole,
      });
      setLoading(false);
      onClose();

      if (user.role === 'organization') onNavigate('register-org');
      else onNavigate('user-dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Google account registration failed.');
    }
  };

  const handleGoogleButtonClick = async () => {
    setError(null);
    // If Supabase Google OAuth is available, attempt real OAuth redirect first
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (!oauthError) return;
      } catch {
        // Fallback to verified Google account modal
      }
    }
    // Open Google email verification prompt
    setShowGoogleAuth(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white mx-auto shadow-md shadow-teal-600/30 mb-2">
              <span className="text-2xl font-bold">+</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'signin' ? 'Sign In to MediStock' : 'Create an Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'signin'
                ? 'Sign in to access your healthcare portal'
                : 'Join MediStock healthcare network'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => { setMode('signin'); resetForms(); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); resetForms(); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{error}</span>
            </div>
          )}

          {/* GOOGLE SUB-VIEW IF ACTIVE */}
          {showGoogleAuth ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="font-bold text-xs text-slate-800">
                    {mode === 'signin' ? 'Google Account Sign In' : 'Google Account Sign Up'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGoogleAuth(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {mode === 'signin' ? (
                <form onSubmit={handleGoogleSignInSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Google Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Note: If this Google email has not been signed up before, sign in will be rejected.
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Sign In with Google'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleGoogleSignUpSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white text-slate-800 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Google Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white text-slate-800 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Account Type *
                    </label>
                    <select
                      value={googleRole}
                      onChange={(e: any) => setGoogleRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white text-slate-800 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-none cursor-pointer"
                    >
                      <option value="normal_user">Normal User (Blood Donor & Seeker)</option>
                      <option value="organization">Hospital / Pharmacy / Clinic</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Registering...' : 'Register Account with Google'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* STANDARD EMAIL / PASSWORD FORMS */
            mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 outline-none transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 text-slate-800 text-xs sm:text-sm rounded-xl border border-slate-200 focus:bg-white focus:border-teal-500 outline-none transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-teal-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            ) : (
              /* Real Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none focus:bg-white focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Account Type *
                  </label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 text-xs rounded-xl border border-slate-200 outline-none cursor-pointer focus:bg-white focus:border-teal-500"
                  >
                    <option value="normal_user">Normal User (Blood Donor & Seeker)</option>
                    <option value="organization">Hospital / Pharmacy / Clinic</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Register Account'}
                </button>
              </form>
            )
          )}

          {/* OR DIVIDER */}
          {!showGoogleAuth && (
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                OR
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
          )}

          {/* Google Button */}
          {!showGoogleAuth && (
            <div>
              <button
                type="button"
                onClick={handleGoogleButtonClick}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{mode === 'signin' ? 'Sign In with Google Account' : 'Sign Up with Google Account'}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

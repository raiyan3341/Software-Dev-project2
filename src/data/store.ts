import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { dbService } from '../supabase/dbService';
import { isSupabaseConfigured, supabase } from '../supabase/client';
import {
  Product,
  Category,
  Organization,
  Order,
  OrderStatus,
  BloodDonor,
  BloodRequest,
  DonorDirectRequest,
  BloodGroup,
  ProductDemandRequest,
  ActivityLog,
  UserProfile,
  UserRole,
  CartItem,
  UserNotification,
  UserSettings
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORGANIZATIONS,
  INITIAL_ORDERS,
  INITIAL_DONORS,
  INITIAL_BLOOD_REQUESTS,
  INITIAL_DEMAND_REQUESTS,
  INITIAL_ACTIVITY_LOGS,
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'medistock_users_clean_v7',
  CURRENT_USER: 'medistock_current_user_clean_v7',
  PRODUCTS: 'medistock_products_clean_v7',
  CATEGORIES: 'medistock_categories_clean_v7',
  ORGANIZATIONS: 'medistock_orgs_clean_v7',
  ORDERS: 'medistock_orders_clean_v7',
  DONORS: 'medistock_donors_clean_v7',
  BLOOD_REQUESTS: 'medistock_blood_requests_clean_v7',
  DONOR_REQUESTS: 'medistock_donor_requests_clean_v7',
  DEMAND_REQUESTS: 'medistock_demand_requests_clean_v7',
  ACTIVITY_LOGS: 'medistock_activity_logs_clean_v7',
  CART: 'medistock_cart_clean_v7',
  NOTIFICATIONS: 'medistock_notifications_clean_v7',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') {
      return fallback;
    }
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn(`Error writing to ${key}:`, e);
  }
}

// Instant 0ms Cross-tab BroadcastChannel
const SYNC_CHANNEL_NAME = 'medistock_broadcast_sync_v7';
let syncBroadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncBroadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  } catch {
    // ignore
  }
}

export const broadcastSyncMessage = (type: string, payload?: any) => {
  try {
    syncBroadcastChannel?.postMessage({ type, payload, timestamp: Date.now() });
  } catch {
    // ignore
  }
};

export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

function useMediStockStoreInternal() {
  // 1. Core State with Storage Cache (instant hydration on load)
  const [users, setUsersState] = useState<UserProfile[]>(() =>
    loadFromStorage<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS)
  );

  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() =>
    loadFromStorage<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null)
  );

  const [products, setProductsState] = useState<Product[]>(() =>
    loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );

  const [categories, setCategoriesState] = useState<Category[]>(() =>
    loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );

  const [organizations, setOrganizationsState] = useState<Organization[]>(() =>
    loadFromStorage<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS)
  );

  const [orders, setOrdersState] = useState<Order[]>(() =>
    loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );

  const [bloodRequests, setBloodRequestsState] = useState<BloodRequest[]>(() =>
    loadFromStorage<BloodRequest[]>(STORAGE_KEYS.BLOOD_REQUESTS, INITIAL_BLOOD_REQUESTS)
  );

  const [donors, setDonorsState] = useState<BloodDonor[]>(() =>
    loadFromStorage<BloodDonor[]>(STORAGE_KEYS.DONORS, INITIAL_DONORS)
  );

  const [donorRequests, setDonorRequestsState] = useState<DonorDirectRequest[]>(() =>
    loadFromStorage<DonorDirectRequest[]>(STORAGE_KEYS.DONOR_REQUESTS, [])
  );

  const [demandRequests, setDemandRequestsState] = useState<ProductDemandRequest[]>(() =>
    loadFromStorage<ProductDemandRequest[]>(STORAGE_KEYS.DEMAND_REQUESTS, INITIAL_DEMAND_REQUESTS)
  );

  const [activityLogs, setActivityLogsState] = useState<ActivityLog[]>(() =>
    loadFromStorage<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS)
  );

  const [cart, setCartState] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>(STORAGE_KEYS.CART, [])
  );

  const [notifications, setNotificationsState] = useState<UserNotification[]>(() =>
    loadFromStorage<UserNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [])
  );

  // Storage Sync Helpers
  const setUsers = (u: UserProfile[]) => {
    setUsersState(u);
    saveToStorage(STORAGE_KEYS.USERS, u);
  };

  const setCurrentUser = (u: UserProfile | null) => {
    setCurrentUserState(u);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, u);
  };

  const setProducts = (p: Product[]) => {
    setProductsState(p);
    saveToStorage(STORAGE_KEYS.PRODUCTS, p);
  };

  const setCategories = (c: Category[]) => {
    setCategoriesState(c);
    saveToStorage(STORAGE_KEYS.CATEGORIES, c);
  };

  const setOrganizations = (o: Organization[]) => {
    setOrganizationsState(o);
    saveToStorage(STORAGE_KEYS.ORGANIZATIONS, o);
  };

  const setOrders = (o: Order[]) => {
    setOrdersState(o);
    saveToStorage(STORAGE_KEYS.ORDERS, o);
  };

  const setBloodRequests = (r: BloodRequest[]) => {
    setBloodRequestsState(r);
    saveToStorage(STORAGE_KEYS.BLOOD_REQUESTS, r);
  };

  const setDonors = (d: BloodDonor[]) => {
    setDonorsState(d);
    saveToStorage(STORAGE_KEYS.DONORS, d);
  };

  const setDonorRequests = (dr: DonorDirectRequest[]) => {
    setDonorRequestsState(dr);
    saveToStorage(STORAGE_KEYS.DONOR_REQUESTS, dr);
  };

  const setDemandRequests = (dr: ProductDemandRequest[]) => {
    setDemandRequestsState(dr);
    saveToStorage(STORAGE_KEYS.DEMAND_REQUESTS, dr);
  };

  const setCart = (action: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    setCartState(prev => {
      const updated = typeof action === 'function' ? action(prev) : action;
      saveToStorage(STORAGE_KEYS.CART, updated);
      return updated;
    });
  };

  const setNotifications = (n: UserNotification[]) => {
    setNotificationsState(n);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, n);
  };

  // ============================================================================
  // DATABASE SYNCHRONIZATION ENGINE
  // ============================================================================
  const syncFromDatabase = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    try {
      // 1. Fetch Products
      const dbProducts = await dbService.fetchProducts();
      if (dbProducts !== null) {
        setProducts(dbProducts.length > 0 ? dbProducts : INITIAL_PRODUCTS);
      }

      // 2. Fetch Profiles (Users)
      const dbProfiles = await dbService.fetchProfiles();
      if (dbProfiles !== null) {
        setUsers(dbProfiles.length > 0 ? dbProfiles : INITIAL_USERS);
      }

      // 3. Fetch Organizations
      const dbOrgs = await dbService.fetchOrganizations();
      if (dbOrgs !== null) {
        setOrganizations(dbOrgs);
      }

      // 4. Fetch Orders
      const dbOrders = await dbService.fetchOrders();
      if (dbOrders !== null) {
        setOrders(dbOrders);
      }

      // 5. Fetch Blood Requests
      const dbReqs = await dbService.fetchBloodRequests();
      if (dbReqs !== null) {
        setBloodRequests(dbReqs);
      }

      // 6. Fetch Blood Donors
      const dbDonors = await dbService.fetchBloodDonors();
      if (dbDonors !== null) {
        setDonors(dbDonors);
      }

      // 7. Fetch Product Demand Requests
      const dbDemands = await dbService.fetchDemandRequests();
      if (dbDemands !== null) {
        setDemandRequests(dbDemands);
      }

      // 8. Fetch Activity Logs
      const dbLogs = await dbService.fetchActivityLogs();
      if (dbLogs !== null) {
        setActivityLogsState(dbLogs);
        saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, dbLogs);
      }
    } catch (e) {
      console.warn('Sync from database notice:', e);
    }
  }, []);

  // Initial Fetch & Real-time Subscriptions
  useEffect(() => {
    // Initial fetch on mount
    syncFromDatabase();

    let realtimeChannel: any = null;
    if (isSupabaseConfigured && supabase) {
      try {
        // Listen to all PostgreSQL table events on public schema
        realtimeChannel = supabase
          .channel('medistock-realtime-master')
          .on('postgres_changes', { event: '*', schema: 'public' }, () => {
            syncFromDatabase();
          })
          .subscribe();
      } catch (err) {
        console.warn('Supabase realtime subscription notice:', err);
      }
    }

    // Continuous 3-second polling to guarantee updates across devices even without websockets
    const pollTimer = setInterval(() => {
      syncFromDatabase();
    }, 3000);

    return () => {
      if (realtimeChannel && supabase) {
        supabase.removeChannel(realtimeChannel);
      }
      clearInterval(pollTimer);
    };
  }, [syncFromDatabase]);

  // Listen for Supabase Google OAuth session and user profile synchronization
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const sb = supabase;

    const syncSessionUser = async (sessionUser: any) => {
      if (!sessionUser?.email) return;
      const email = sessionUser.email.toLowerCase();

      // If already logged in as this user, avoid duplicate work
      if (currentUser?.email?.toLowerCase() === email) return;

      try {
        // Query profiles to see if already registered
        const { data: profile } = await sb
          .from('profiles')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (profile) {
          // Resolve role if approved organization
          const linkedOrg = organizations.find(
            o => (o.userId && o.userId === profile.id) ||
                 o.id === profile.organization_id ||
                 (o.email && o.email.toLowerCase() === email)
          );
          let resolvedRole = (profile.role || 'normal_user') as UserRole;
          if (resolvedRole !== 'owner' && resolvedRole !== 'admin') {
            if (linkedOrg && linkedOrg.verificationStatus === 'Approved') {
              resolvedRole = 'organization';
            } else {
              resolvedRole = 'normal_user';
            }
          }

          const existingUser: UserProfile = {
            id: profile.id,
            name: profile.full_name,
            email: profile.email,
            password: profile.password || 'password123',
            avatar: profile.avatar_url || sessionUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            role: resolvedRole,
            status: (profile.status || 'active') as 'active' | 'suspended',
            organizationId: linkedOrg?.id || profile.organization_id || undefined,
            phone: profile.phone || undefined,
            createdAt: profile.created_at ? profile.created_at.split('T')[0] : '2025-01-01',
          };
          setCurrentUser(existingUser);
          setUsersState(prev => [...prev.filter(u => u.email.toLowerCase() !== email), existingUser]);
          saveToStorage(STORAGE_KEYS.USERS, [...users.filter(u => u.email.toLowerCase() !== email), existingUser]);
          logActivity('Google Sign In', `${existingUser.name} (${existingUser.role})`, 'user');
        } else {
          // New Google account: auto-create in profiles table
          const fullName = sessionUser.user_metadata?.full_name || 
                           sessionUser.user_metadata?.name || 
                           email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
          const avatarUrl = sessionUser.user_metadata?.avatar_url || 
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80';

          const newProfile: UserProfile = {
            id: sessionUser.id || generateUUID(),
            name: fullName,
            email: email,
            password: 'google_oauth_user',
            avatar: avatarUrl,
            role: 'normal_user',
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
          };

          await dbService.saveProfile(newProfile);
          setCurrentUser(newProfile);
          setUsersState(prev => [...prev.filter(u => u.email.toLowerCase() !== email), newProfile]);
          saveToStorage(STORAGE_KEYS.USERS, [...users.filter(u => u.email.toLowerCase() !== email), newProfile]);
          broadcastSyncMessage('USER_REGISTERED');
          logActivity('Google Account Registered', `${newProfile.name} (${newProfile.role})`, 'user');
        }
      } catch (err) {
        console.warn('Google OAuth session sync notice:', err);
      }
    };

    // Check existing session on mount
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        syncSessionUser(session.user);
      }
    });

    // Listen to Supabase auth events (e.g. after redirect back from Google account selector)
    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') && session?.user) {
        syncSessionUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [organizations]);

  // Multi-tab instant storage and BroadcastChannel synchronizer
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.USERS && e.newValue) {
        try { setUsersState(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === STORAGE_KEYS.CURRENT_USER) {
        try { setCurrentUserState(e.newValue ? JSON.parse(e.newValue) : null); } catch {}
      }
      if (e.key === STORAGE_KEYS.PRODUCTS && e.newValue) {
        try { setProductsState(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === STORAGE_KEYS.ORGANIZATIONS && e.newValue) {
        try { setOrganizationsState(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === STORAGE_KEYS.ORDERS && e.newValue) {
        try { setOrdersState(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === STORAGE_KEYS.BLOOD_REQUESTS && e.newValue) {
        try { setBloodRequestsState(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === STORAGE_KEYS.DONORS && e.newValue) {
        try { setDonorsState(JSON.parse(e.newValue)); } catch {}
      }
    };

    const handleBroadcast = (event: MessageEvent) => {
      const { type } = event.data || {};
      if (type) {
        syncFromDatabase();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    syncBroadcastChannel?.addEventListener('message', handleBroadcast);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      syncBroadcastChannel?.removeEventListener('message', handleBroadcast);
    };
  }, [syncFromDatabase]);

  // ============================================================================
  // AUTHENTICATION & USER MANAGEMENT
  // ============================================================================
  const login = async (email: string, password?: string): Promise<UserProfile> => {
    if (!email || !email.trim()) {
      throw new Error('Please enter your email address.');
    }
    const cleanEmail = email.trim().toLowerCase();
    let found = users.find(u => u.email.toLowerCase() === cleanEmail);

    // If not found in memory, query database directly to ensure freshest state
    if (!found && isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (data) {
          found = {
            id: data.id,
            name: data.full_name,
            email: data.email,
            password: data.password || 'password123',
            avatar: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            role: (data.role || 'normal_user') as UserRole,
            status: (data.status || 'active') as 'active' | 'suspended',
            organizationId: data.organization_id || undefined,
            phone: data.phone || undefined,
            createdAt: data.created_at ? data.created_at.split('T')[0] : '2025-01-01',
          };
          setUsers([...users.filter(u => u.email.toLowerCase() !== cleanEmail), found]);
        }
      } catch (err) {
        console.warn('Profile direct check error:', err);
      }
    }

    // STRICT: Do not auto-create an account. User must register first!
    if (!found) {
      throw new Error('No account found with this email. Please Sign Up first before signing in.');
    }

    if (found.status === 'suspended') {
      throw new Error('Your account has been suspended. Please contact platform support.');
    }

    if (password && found.password && found.password !== password) {
      throw new Error('Incorrect password. Please verify your credentials and try again.');
    }

    // Role Resolution: check if user has approved organization
    const linkedOrg = organizations.find(
      o => (o.userId && o.userId === found!.id) ||
           o.id === found!.organizationId ||
           (o.email && o.email.toLowerCase() === cleanEmail)
    );
    let resolvedRole = found.role;
    if (resolvedRole !== 'owner' && resolvedRole !== 'admin') {
      if (linkedOrg && linkedOrg.verificationStatus === 'Approved') {
        resolvedRole = 'organization';
      } else {
        resolvedRole = 'normal_user';
      }
    }

    const userToSet: UserProfile = {
      ...found,
      role: resolvedRole,
      organizationId: linkedOrg?.id || found.organizationId,
    };

    setCurrentUser(userToSet);
    logActivity('User Signed In', `${userToSet.name} (${userToSet.role})`, 'user');
    return userToSet;
  };

  const loginWithGoogle = async (email: string): Promise<UserProfile> => {
    if (!email || !email.trim()) {
      throw new Error('Please provide your Google email address.');
    }
    const cleanEmail = email.trim().toLowerCase();
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);

    // If not found in local memory, check database directly
    if (!user && isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (data) {
          user = {
            id: data.id,
            name: data.full_name,
            email: data.email,
            password: data.password || 'password123',
            avatar: data.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            role: (data.role || 'normal_user') as UserRole,
            status: (data.status || 'active') as 'active' | 'suspended',
            organizationId: data.organization_id || undefined,
            phone: data.phone || undefined,
            createdAt: data.created_at ? data.created_at.split('T')[0] : '2025-01-01',
          };
          setUsers([...users.filter(u => u.email.toLowerCase() !== cleanEmail), user]);
        }
      } catch (err) {
        console.warn('Google profile lookup error:', err);
      }
    }

    // STRICT: Must have signed up first!
    if (!user) {
      throw new Error('No account found with this Google email. You must Sign Up first before signing in.');
    }

    if (user.status === 'suspended') {
      throw new Error('Your account has been suspended. Please contact platform support.');
    }

    const linkedOrg = organizations.find(
      o => (o.userId && o.userId === user!.id) ||
           o.id === user!.organizationId ||
           (o.email && o.email.toLowerCase() === cleanEmail)
    );
    let resolvedRole = user.role;
    if (resolvedRole !== 'owner' && resolvedRole !== 'admin') {
      if (linkedOrg && linkedOrg.verificationStatus === 'Approved') {
        resolvedRole = 'organization';
      } else {
        resolvedRole = 'normal_user';
      }
    }

    const userToSet: UserProfile = {
      ...user,
      role: resolvedRole,
      organizationId: linkedOrg?.id || user.organizationId,
    };

    setCurrentUser(userToSet);
    logActivity('Google Authentication Signed In', `${userToSet.name} (${userToSet.role})`, 'user');
    return userToSet;
  };

  const registerWithGoogle = async (data: { email: string; name?: string; role?: UserRole }): Promise<UserProfile> => {
    if (!data.email || !data.email.trim()) {
      throw new Error('Please enter a valid Google email address.');
    }
    const cleanEmail = data.email.trim().toLowerCase();

    // Check if account already exists
    let existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!existing && isSupabaseConfigured && supabase) {
      try {
        const { data: dbData } = await supabase.from('profiles').select('id, email').eq('email', cleanEmail).maybeSingle();
        if (dbData) {
          existing = { id: dbData.id, email: dbData.email } as any;
        }
      } catch {}
    }

    if (existing) {
      throw new Error('An account with this Google email already exists. Please switch to Sign In.');
    }

    const defaultName = (data.name && data.name.trim()) || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const newUser: UserProfile = {
      id: generateUUID(),
      name: defaultName,
      email: cleanEmail,
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: data.role || 'normal_user',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...users, newUser];
    setUsers(updated);
    setCurrentUser(newUser);

    if (isSupabaseConfigured) {
      await dbService.saveProfile(newUser);
    }
    broadcastSyncMessage('USER_REGISTERED');
    logActivity('Google Account Registered', `${newUser.name} (${newUser.role})`, 'user');
    return newUser;
  };

  const registerUser = async (data: { name: string; email: string; password?: string; role?: UserRole; phone?: string }): Promise<UserProfile> => {
    if (!data.email || !data.email.trim()) {
      throw new Error('Please enter a valid email address.');
    }
    const cleanEmail = data.email.trim().toLowerCase();
    
    // Check if account already exists
    let existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!existing && isSupabaseConfigured && supabase) {
      try {
        const { data: dbData } = await supabase.from('profiles').select('id, email').eq('email', cleanEmail).maybeSingle();
        if (dbData) {
          existing = { id: dbData.id, email: dbData.email } as any;
        }
      } catch {}
    }

    if (existing) {
      throw new Error('An account with this email already exists. Please switch to Sign In.');
    }

    const newUser: UserProfile = {
      id: generateUUID(),
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password || 'password123',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: data.role || 'normal_user',
      status: 'active',
      phone: data.phone,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...users, newUser];
    setUsers(updated);
    setCurrentUser(newUser);

    if (isSupabaseConfigured) {
      await dbService.saveProfile(newUser);
    }
    broadcastSyncMessage('USER_REGISTERED');
    logActivity('New User Registered', `${newUser.name} (${newUser.role})`, 'user');
    return newUser;
  };

  const logout = () => {
    if (currentUser) {
      logActivity('User Signed Out', currentUser.name, 'user');
    }
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentUserState(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const updateUserProfile = (updatedData: Partial<UserProfile>) => {
    if (!currentUser) return null;
    const updatedUser: UserProfile = {
      ...currentUser,
      ...updatedData,
    };
    setCurrentUser(updatedUser);
    const updated = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updated);

    if (isSupabaseConfigured) {
      dbService.saveProfile(updatedUser);
    }
    broadcastSyncMessage('USER_UPDATED');
    logActivity('Updated Profile Details', updatedUser.name, 'user');
    return updatedUser;
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const target = users.find(u => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
    if (!target) return;

    if (target.email.toLowerCase() === 'owner@medistock.com' && newRole !== 'owner') {
      alert('The root platform owner role cannot be modified.');
      return;
    }

    const updated = users.map(u => {
      if (u.id === target.id || u.email.toLowerCase() === target.email.toLowerCase()) {
        return { ...u, role: newRole };
      }
      return u;
    });
    setUsers(updated);

    if (currentUser && (currentUser.id === target.id || currentUser.email.toLowerCase() === target.email.toLowerCase())) {
      const updatedCurrent: UserProfile = { ...currentUser, role: newRole };
      setCurrentUser(updatedCurrent);
    }

    if (isSupabaseConfigured) {
      dbService.updateUserRoleInDb(target.id, newRole);
    }
    broadcastSyncMessage('USER_UPDATED');
    logActivity('User Role Changed', `${target.name} (${target.email}) -> ${newRole}`, 'user');
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    if (!currentUser) return null;
    const currentSettings = currentUser.settings || {
      emailAlerts: true,
      smsAlerts: true,
      twoFactor: false,
      orderDispatchAlerts: true,
    };
    const updatedUser: UserProfile = {
      ...currentUser,
      settings: { ...currentSettings, ...settings },
    };
    setCurrentUser(updatedUser);
    const updated = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updated);

    if (isSupabaseConfigured) {
      dbService.saveProfile(updatedUser);
    }
    return updatedUser;
  };

  const changePassword = async (newPass: string) => {
    if (!currentUser) throw new Error('No user logged in');
    const updatedUser: UserProfile = { ...currentUser, password: newPass };
    setCurrentUser(updatedUser);
    const updated = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updated);

    if (isSupabaseConfigured) {
      dbService.saveProfile(updatedUser);
    }
    logActivity('Password Changed', currentUser.name, 'user');
    return true;
  };

  const deleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    if (target.role === 'owner') {
      alert('The root platform owner account cannot be deleted.');
      return;
    }
    if (target.id === currentUser?.id) {
      alert('You cannot delete your own logged-in account.');
      return;
    }

    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);

    if (isSupabaseConfigured) {
      dbService.deleteProfile(userId);
    }
    broadcastSyncMessage('USER_DELETED');
    logActivity('User Account Removed', `${target.name} (${target.email})`, 'system');
  };

  // ============================================================================
  // PRODUCTS MANAGEMENT
  // ============================================================================
  const addProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    const id = productData.id || generateUUID();
    const newProduct: Product = {
      ...productData,
      id,
    };

    const updated = [newProduct, ...products.filter(p => p.id !== id && p.sku !== newProduct.sku)];
    setProducts(updated);

    if (isSupabaseConfigured) {
      dbService.saveProduct(newProduct);
    }
    broadcastSyncMessage('PRODUCT_UPDATED');

    addNotification({
      title: 'New Product Added',
      message: `${newProduct.name} (${newProduct.sku}) added to catalog.`,
      type: 'stock',
    });

    logActivity('Added Product to Catalog', `${newProduct.name} (${newProduct.sku})`, 'product');
    return newProduct;
  };

  const deleteProduct = (productId: string) => {
    const target = products.find(p => p.id === productId);
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    removeFromCart(productId);

    if (isSupabaseConfigured) {
      dbService.deleteProduct(productId);
    }
    broadcastSyncMessage('PRODUCT_DELETED');

    addNotification({
      title: 'Product Removed',
      message: `${target?.name || 'Product'} has been deleted from the catalog.`,
      type: 'stock',
    });

    logActivity('Product Deleted', `${target?.name || productId}`, 'product');
  };

  // ============================================================================
  // CART OPERATIONS
  // ============================================================================
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // ============================================================================
  // ORDERS MANAGEMENT
  // ============================================================================
  const placeOrder = (orgOrId: Organization | string, customItems?: CartItem[]): Order => {
    const activeCart = customItems || cart;
    if (activeCart.length === 0) {
      throw new Error('Your cart is empty. Please add medical supplies before placing an order.');
    }

    const org: Organization = typeof orgOrId === 'string'
      ? organizations.find(o => o.id === orgOrId) || {
          id: orgOrId,
          name: currentUser?.name || 'Partner Facility',
          type: 'Pharmacy',
          representative: currentUser?.name || 'Representative',
          email: currentUser?.email || 'org@medistock.com',
          phone: currentUser?.phone || '+880 1712 000000',
          address: currentUser?.address || 'Dhaka, Bangladesh',
          city: currentUser?.city || 'Dhaka',
          verificationStatus: 'Approved',
          documents: [],
          totalOrders: 0,
          pendingOrders: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString().split('T')[0],
        }
      : orgOrId;

    if (org.verificationStatus !== 'Approved') {
      throw new Error(`Cannot place order: Organization "${org.name}" is ${org.verificationStatus.toLowerCase()} approval by DGHS Admin.`);
    }

    const subtotal = activeCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const orderNum = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderNum,
      organizationId: org.id,
      organizationName: org.name,
      organizationAddress: org.address,
      organizationPhone: org.phone,
      organizationEmail: org.email,
      items: activeCart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        unit: item.product.unit,
        quantity: item.quantity,
        unitPrice: item.product.price,
        total: item.product.price * item.quantity,
        batchNumber: item.product.batchNumber,
      })),
      subtotal,
      tax: 0,
      total: subtotal,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeline: [
        {
          status: 'Pending',
          timestamp: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          note: `Restock order submitted by ${org.name}`,
        },
      ],
    };

    // Deduct stock
    const updatedProducts = products.map(prod => {
      const inCart = activeCart.find(c => c.product.id === prod.id);
      if (inCart) {
        const remaining = Math.max(0, prod.stock - inCart.quantity);
        const updatedP = { ...prod, stock: remaining };
        if (isSupabaseConfigured) dbService.saveProduct(updatedP);
        return updatedP;
      }
      return prod;
    });
    setProducts(updatedProducts);

    // Update organization counters
    const updatedOrgs = organizations.map(o =>
      o.id === org.id
        ? {
            ...o,
            totalOrders: o.totalOrders + 1,
            pendingOrders: o.pendingOrders + 1,
            totalSpent: o.totalSpent + subtotal,
          }
        : o
    );
    setOrganizations(updatedOrgs);

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    clearCart();

    if (isSupabaseConfigured) {
      dbService.saveOrder(newOrder);
      const matchedOrg = updatedOrgs.find(o => o.id === org.id);
      if (matchedOrg) dbService.saveOrganization(matchedOrg);
    }
    broadcastSyncMessage('ORDER_PLACED');

    addNotification({
      title: 'Restock Order Submitted',
      message: `${orderNum} for ${org.name} (৳${subtotal.toLocaleString()}) has been queued.`,
      type: 'order',
    });

    logActivity('Placed New Order', `${orderNum} (${org.name}) - ৳${subtotal.toLocaleString()}`, 'order');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    let orderToUpdate: Order | undefined;

    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        orderToUpdate = ord;
        const newTimelineStep = {
          status: newStatus,
          timestamp: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          note: note || `Status updated to ${newStatus}`,
        };
        return {
          ...ord,
          status: newStatus,
          timeline: [...ord.timeline, newTimelineStep],
        };
      }
      return ord;
    });

    setOrders(updatedOrders);

    // If cancelled, restore stock
    if (newStatus === 'Cancelled' && orderToUpdate) {
      const updatedProducts = products.map(prod => {
        const item = orderToUpdate?.items.find(i => i.productId === prod.id);
        if (item) {
          const restored = { ...prod, stock: prod.stock + item.quantity };
          if (isSupabaseConfigured) dbService.saveProduct(restored);
          return restored;
        }
        return prod;
      });
      setProducts(updatedProducts);
    }

    if (isSupabaseConfigured && orderToUpdate) {
      const targetOrd = updatedOrders.find(o => o.id === orderId);
      if (targetOrd) {
        dbService.updateOrderStatusInDb(orderId, newStatus, targetOrd.timeline);
      }
    }
    broadcastSyncMessage('ORDER_UPDATED');
    logActivity(`Order ${orderId} Status Updated`, `New status: ${newStatus}`, 'order');
  };

  // ============================================================================
  // ORGANIZATIONS & VERIFICATION
  // ============================================================================
  const registerOrganization = (data: {
    name: string;
    type: Organization['type'];
    representative: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    documents: Array<{ name: string; type: string; url?: string; size?: string }>;
  }) => {
    const newOrgId = generateUUID();
    const newOrg: Organization = {
      id: newOrgId,
      userId: currentUser?.id,
      name: data.name,
      type: data.type,
      representative: data.representative,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      verificationStatus: 'Pending',
      documents: (data.documents || []).map((d, index) => ({
        id: `doc-${Date.now()}-${index}`,
        name: d.name,
        type: d.type,
        url: d.url || '#',
        uploadedAt: new Date().toISOString().split('T')[0],
        size: d.size || '1.5 MB',
      })),
      totalOrders: 0,
      pendingOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrganizations([newOrg, ...organizations]);

    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        organizationId: newOrgId,
      };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      if (isSupabaseConfigured) dbService.saveProfile(updatedUser);
    }

    if (isSupabaseConfigured) {
      dbService.saveOrganization(newOrg);
    }
    broadcastSyncMessage('ORGANIZATION_REGISTERED');

    addNotification({
      title: 'New Organization Registered',
      message: `${newOrg.name} has submitted documentation and is awaiting DGHS verification.`,
      type: 'system',
    });

    logActivity('New Organization Registered', `${newOrg.name} (${newOrg.type}) - Pending Review`, 'organization');
    return newOrg;
  };

  const verifyOrganization = (orgId: string, status: 'Approved' | 'Rejected', reason?: string) => {
    let targetOrgName = 'Organization';
    const updatedOrgs = organizations.map(o => {
      if (o.id === orgId) {
        targetOrgName = o.name;
        return {
          ...o,
          verificationStatus: status,
          rejectionReason: reason,
        };
      }
      return o;
    });
    setOrganizations(updatedOrgs);

    const targetOrg = organizations.find(o => o.id === orgId);

    // Update user role if approved/rejected
    const newRole: UserRole = status === 'Approved' ? 'organization' : 'normal_user';
    const updatedUsers = users.map(u => {
      const isLinked = (targetOrg?.userId && u.id === targetOrg.userId) ||
                       u.organizationId === orgId ||
                       (targetOrg?.email && u.email.toLowerCase() === targetOrg.email.toLowerCase());
      if (isLinked) {
        if (isSupabaseConfigured) dbService.updateUserRoleInDb(u.id, newRole);
        return {
          ...u,
          organizationId: orgId,
          role: newRole,
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    if (currentUser) {
      const isCurrentLinked = (targetOrg?.userId && currentUser.id === targetOrg.userId) ||
                              currentUser.organizationId === orgId ||
                              (targetOrg?.email && currentUser.email.toLowerCase() === targetOrg.email.toLowerCase());
      if (isCurrentLinked) {
        setCurrentUser({ ...currentUser, role: newRole, organizationId: orgId });
      }
    }

    if (isSupabaseConfigured) {
      dbService.verifyOrganizationInDb(orgId, status, reason);
    }
    broadcastSyncMessage('ORGANIZATION_VERIFIED');

    addNotification({
      title: status === 'Approved' ? 'Organization Approved! 🎉' : 'Organization Application Rejected',
      message: status === 'Approved'
        ? `Congratulations! ${targetOrgName} has been approved by Admin.`
        : `Your application for ${targetOrgName} was rejected: ${reason || 'Documents could not be verified'}.`,
      type: 'order',
    });

    logActivity(`Organization Verification`, `Org ID: ${orgId} -> ${status}`, 'organization');
  };

  // ============================================================================
  // BLOOD DONATION (REQUESTS & DONORS)
  // ============================================================================
  const createBloodRequest = (data: {
    requesterName: string;
    bloodGroup: BloodRequest['bloodGroup'];
    hospital: string;
    location: string;
    unitsNeeded: number;
    dateNeeded: string;
    contactPhone: string;
    urgency: BloodRequest['urgency'];
    notes: string;
  }) => {
    const newReq: BloodRequest = {
      id: generateUUID(),
      requesterId: currentUser?.id || 'guest',
      requesterName: data.requesterName,
      requesterAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      bloodGroup: data.bloodGroup,
      hospital: data.hospital,
      location: data.location,
      unitsNeeded: data.unitsNeeded,
      dateNeeded: data.dateNeeded,
      contactPhone: data.contactPhone,
      urgency: data.urgency,
      notes: data.notes,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBloodRequests([newReq, ...bloodRequests]);

    if (isSupabaseConfigured) {
      dbService.saveBloodRequest(newReq);
    }
    broadcastSyncMessage('BLOOD_REQUEST_CREATED');

    addNotification({
      title: 'Emergency Blood Request Posted 🩸',
      message: `${data.bloodGroup} urgently needed at ${data.hospital} (${data.unitsNeeded} units).`,
      type: 'blood',
    });

    logActivity('Blood Request Created', `${data.bloodGroup} for ${data.hospital}`, 'system');
    return newReq;
  };

  const acceptBloodRequest = (requestId: string, donorPhone: string, donorMessage?: string) => {
    if (!currentUser) throw new Error('Please sign in to volunteer as a donor.');
    const target = bloodRequests.find(r => r.id === requestId);
    if (!target) throw new Error('Blood request not found.');

    const updated = bloodRequests.map(r => {
      if (r.id === requestId) {
        const item: BloodRequest = {
          ...r,
          status: 'Accepted' as const,
          acceptedById: currentUser.id,
          acceptedByName: currentUser.name,
          acceptedByPhone: donorPhone || currentUser.phone || '',
          acceptedAt: new Date().toISOString(),
          donorMessage: donorMessage || 'I am ready to donate blood.',
        };
        if (isSupabaseConfigured) dbService.saveBloodRequest(item);
        return item;
      }
      return r;
    });

    setBloodRequests(updated);
    broadcastSyncMessage('BLOOD_REQUEST_UPDATED');

    addNotification({
      title: 'Donor Accepted Your Blood Request! 🩸',
      message: `${currentUser.name} has volunteered to donate ${target.bloodGroup} for ${target.hospital}!`,
      type: 'blood',
      userId: target.requesterId,
    });

    logActivity('Blood Request Accepted', `${currentUser.name} volunteered for ${target.hospital}`, 'user');
  };

  const fulfillBloodRequest = (requestId: string) => {
    const updated = bloodRequests.map(r => {
      if (r.id === requestId) {
        const item: BloodRequest = { ...r, status: 'Fulfilled' as const };
        if (isSupabaseConfigured) dbService.saveBloodRequest(item);
        return item;
      }
      return r;
    });
    setBloodRequests(updated);
    broadcastSyncMessage('BLOOD_REQUEST_UPDATED');
    logActivity('Blood Request Fulfilled', `Request ${requestId} marked completed`, 'user');
  };

  const deleteBloodRequest = (requestId: string) => {
    const updated = bloodRequests.filter(r => r.id !== requestId);
    setBloodRequests(updated);

    if (isSupabaseConfigured) {
      dbService.deleteBloodRequest(requestId);
    }
    broadcastSyncMessage('BLOOD_REQUEST_DELETED');
    logActivity('Blood Request Removed', `Request ${requestId}`, 'user');
  };

  const clearAllBloodRequests = () => {
    setBloodRequests([]);
    if (isSupabaseConfigured) {
      dbService.clearAllBloodRequests();
    }
    broadcastSyncMessage('BLOOD_REQUEST_CLEARED');
    logActivity('All Blood Requests Cleared', 'Admin/Owner Action', 'system');
  };

  const clearFulfilledBloodRequests = () => {
    const toRemove = bloodRequests.filter(r => r.status === 'Fulfilled' || r.status === 'Cancelled');
    const remaining = bloodRequests.filter(r => r.status !== 'Fulfilled' && r.status !== 'Cancelled');
    setBloodRequests(remaining);

    if (isSupabaseConfigured) {
      toRemove.forEach(r => dbService.deleteBloodRequest(r.id));
    }
    broadcastSyncMessage('BLOOD_REQUEST_CLEARED');
  };

  const registerAsDonor = (data: {
    bloodGroup: BloodGroup;
    location: string;
    phone: string;
    notes?: string;
  }) => {
    if (!currentUser) throw new Error('Please sign in to register as a donor.');

    const existingIndex = donors.findIndex(d => d.userId === currentUser.id || d.email === currentUser.email);

    if (existingIndex >= 0) {
      const updated = [...donors];
      const updatedDonor: BloodDonor = {
        ...updated[existingIndex],
        bloodGroup: data.bloodGroup,
        location: data.location,
        phone: data.phone,
        notes: data.notes,
        isAvailable: true,
      };
      updated[existingIndex] = updatedDonor;
      setDonors(updated);

      if (isSupabaseConfigured) {
        dbService.saveBloodDonor(updatedDonor);
      }
      broadcastSyncMessage('DONOR_UPDATED');
      logActivity('Donor Profile Updated', `${currentUser.name} (${data.bloodGroup})`, 'user');
      return updatedDonor;
    } else {
      const newDonor: BloodDonor = {
        id: generateUUID(),
        userId: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: data.phone,
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        bloodGroup: data.bloodGroup,
        location: data.location,
        isAvailable: true,
        lastDonationDate: new Date().toISOString().split('T')[0],
        notes: data.notes,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setDonors([newDonor, ...donors]);

      if (isSupabaseConfigured) {
        dbService.saveBloodDonor(newDonor);
      }
      broadcastSyncMessage('DONOR_REGISTERED');
      logActivity('Donor Registered', `${currentUser.name} (${data.bloodGroup})`, 'user');
      return newDonor;
    }
  };

  const toggleDonorAvailability = (donorId: string) => {
    const updated = donors.map(d => {
      if (d.id === donorId) {
        const toggled: BloodDonor = { ...d, isAvailable: !d.isAvailable };
        if (isSupabaseConfigured) dbService.saveBloodDonor(toggled);
        return toggled;
      }
      return d;
    });
    setDonors(updated);
    broadcastSyncMessage('DONOR_UPDATED');
  };

  const deleteDonor = (donorId: string) => {
    const updated = donors.filter(d => d.id !== donorId);
    setDonors(updated);

    if (isSupabaseConfigured) {
      dbService.deleteBloodDonor(donorId);
    }
    broadcastSyncMessage('DONOR_DELETED');
    logActivity('Donor Profile Removed', `Donor ID ${donorId}`, 'user');
  };

  const clearAllDonors = () => {
    setDonors([]);
    if (isSupabaseConfigured) {
      dbService.clearAllBloodDonors();
    }
    broadcastSyncMessage('DONOR_CLEARED');
    logActivity('All Donors Cleared', 'Admin/Owner Action', 'system');
  };

  const sendDonorDirectRequest = (data: {
    donorId: string;
    donorName: string;
    donorUserId?: string;
    hospital: string;
    location: string;
    bloodGroup: BloodGroup;
    unitsNeeded: number;
    dateNeeded: string;
    requesterPhone: string;
    notes?: string;
  }) => {
    if (!currentUser) throw new Error('Please sign in to send a blood request to a donor.');

    const newReq: DonorDirectRequest = {
      id: `dreq-direct-${Date.now()}`,
      donorId: data.donorId,
      donorUserId: data.donorUserId,
      donorName: data.donorName,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterPhone: data.requesterPhone,
      hospital: data.hospital,
      location: data.location,
      bloodGroup: data.bloodGroup,
      unitsNeeded: data.unitsNeeded,
      dateNeeded: data.dateNeeded,
      notes: data.notes,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setDonorRequests([newReq, ...donorRequests]);

    addNotification({
      title: 'Direct Blood Donation Request Received! 🩸',
      message: `${currentUser.name} has requested blood (${data.bloodGroup}) for ${data.hospital}.`,
      type: 'blood',
      userId: data.donorUserId,
    });

    logActivity('Direct Donor Request Sent', `${currentUser.name} requested ${data.donorName}`, 'user');
    return newReq;
  };

  const respondToDonorRequest = (requestId: string, status: 'Accepted' | 'Declined') => {
    const target = donorRequests.find(r => r.id === requestId);
    const updated = donorRequests.map(r => r.id === requestId ? { ...r, status } : r);
    setDonorRequests(updated);

    if (target) {
      addNotification({
        title: status === 'Accepted' ? 'Donor Accepted Your Request! 🎉' : 'Donor Is Unavailable',
        message: status === 'Accepted'
          ? `${target.donorName} accepted your blood request for ${target.hospital}!`
          : `${target.donorName} is unable to donate blood at this time.`,
        type: 'blood',
        userId: target.requesterId,
      });
    }

    logActivity('Direct Donor Request Response', `${status} for request ${requestId}`, 'user');
  };

  const deleteDonorRequest = (requestId: string) => {
    setDonorRequests(donorRequests.filter(r => r.id !== requestId));
  };

  const clearAllDonorRequests = () => {
    setDonorRequests([]);
  };

  // ============================================================================
  // DEMAND & NOTIFICATIONS & ACTIVITY
  // ============================================================================
  const submitProductDemand = (data: {
    orgId: string;
    orgName: string;
    itemName: string;
    requestedQuantity: number;
    explanation: string;
  }) => {
    const newReq: ProductDemandRequest = {
      id: generateUUID(),
      organizationId: data.orgId,
      organizationName: data.orgName,
      itemName: data.itemName,
      requestedQuantity: data.requestedQuantity,
      explanation: data.explanation,
      status: 'Under Review',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDemandRequests([newReq, ...demandRequests]);
    if (isSupabaseConfigured) dbService.saveDemandRequest(newReq);
    broadcastSyncMessage('DEMAND_REQUEST_CREATED');
    logActivity('Product Demand Requested', `${data.itemName} (Qty: ${data.requestedQuantity}) by ${data.orgName}`, 'product');
    return newReq;
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif: Omit<UserNotification, 'id' | 'time' | 'read'>) => {
    const newN: UserNotification = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif,
    };
    setNotifications([newN, ...notifications]);
    return newN;
  };

  const logActivity = (action: string, target: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      actorName: currentUser?.name || 'System',
      actorRole: currentUser?.role || 'system',
      action,
      target,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      type,
    };
    const updated = [newLog, ...activityLogs].slice(0, 100);
    setActivityLogsState(updated);
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, updated);
    if (isSupabaseConfigured) dbService.saveActivityLog(newLog);
  };

  // ============================================================================
  // COMPUTED DYNAMIC STATISTICS
  // ============================================================================
  const getDynamicOrgStats = (orgId: string) => {
    const myOrders = orders.filter(o => o.organizationId === orgId);
    const totalOrders = myOrders.length;
    const pendingOrders = myOrders.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Confirmed').length;
    const totalSpent = myOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
    return { totalOrders, pendingOrders, totalSpent };
  };

  const dynamicAdminStats = useMemo(() => {
    const totalOrganizations = organizations.length;
    const totalOrders = orders.length;
    const pendingApprovals = organizations.filter(o => o.verificationStatus === 'Pending').length;
    const pendingProductRequests = demandRequests.filter(r => r.status === 'Under Review').length;
    return {
      totalOrganizations,
      totalOrders,
      pendingApprovals,
      productRequests: pendingProductRequests,
    };
  }, [organizations, orders, demandRequests]);

  const dynamicOwnerStats = useMemo(() => {
    const totalUsers = users.length;
    const totalOrganizations = organizations.length;
    const totalOrders = orders.length;
    const platformRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);

    const dateGroups: Record<string, { orders: number; revenue: number }> = {};
    orders.forEach(o => {
      const d = o.date;
      if (!dateGroups[d]) dateGroups[d] = { orders: 0, revenue: 0 };
      dateGroups[d].orders += 1;
      if (o.status !== 'Cancelled') dateGroups[d].revenue += o.total;
    });

    const chartPoints = Object.entries(dateGroups).map(([date, val]) => ({
      date,
      orders: val.orders,
      revenue: val.revenue,
    }));

    return {
      totalUsers,
      totalOrganizations,
      totalOrders,
      platformRevenue,
      chartPoints,
    };
  }, [users, organizations, orders]);

  const currentUserOrg = useMemo(() => {
    if (!currentUser) return null;
    return (
      organizations.find(
        o => (o.userId && o.userId === currentUser.id) ||
             o.id === currentUser.organizationId ||
             (o.email && currentUser.email && o.email.toLowerCase() === currentUser.email.toLowerCase())
      ) || null
    );
  }, [currentUser, organizations]);

  const activeRole: UserRole = useMemo(() => {
    if (!currentUser) return 'normal_user';
    if (currentUser.role === 'owner') return 'owner';
    if (currentUser.role === 'admin') return 'admin';
    if (currentUserOrg && currentUserOrg.verificationStatus === 'Approved') {
      return 'organization';
    }
    return 'normal_user';
  }, [currentUser, currentUserOrg]);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'owner' && currentUser.role !== 'admin') {
      const needsRoleSync = currentUser.role !== activeRole;
      const needsOrgSync = currentUserOrg && currentUser.organizationId !== currentUserOrg.id;
      if (needsRoleSync || needsOrgSync) {
        const synced: UserProfile = {
          ...currentUser,
          role: activeRole,
          organizationId: currentUserOrg?.id || currentUser.organizationId,
        };
        setCurrentUserState(synced);
        saveToStorage(STORAGE_KEYS.CURRENT_USER, synced);
      }
    }
  }, [activeRole, currentUser, currentUserOrg]);

  return {
    currentUser,
    currentUserOrg,
    activeRole,
    login,
    loginWithGoogle,
    registerWithGoogle,
    registerUser,
    updateUserProfile,
    updateUserRole,
    updateUserSettings,
    changePassword,
    logout,
    users,
    products,
    setProducts,
    categories,
    setCategories,
    organizations,
    orders,
    donors,
    setDonors,
    bloodRequests,
    setBloodRequests,
    demandRequests,
    setDemandRequests,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    addNotification,
    activityLogs,
    logActivity,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    updateOrderStatus,
    verifyOrganization,
    registerOrganization,
    createBloodRequest,
    acceptBloodRequest,
    fulfillBloodRequest,
    deleteBloodRequest,
    clearAllBloodRequests,
    clearFulfilledBloodRequests,
    registerAsDonor,
    toggleDonorAvailability,
    deleteDonor,
    clearAllDonors,
    donorRequests,
    setDonorRequests,
    sendDonorDirectRequest,
    respondToDonorRequest,
    deleteDonorRequest,
    clearAllDonorRequests,
    submitProductDemand,
    addProduct,
    deleteProduct,
    deleteUser,
    deletedUserIds: [] as string[],
    deletedBloodRequestIds: [] as string[],
    deletedDonorIds: [] as string[],
    deletedProductIds: [] as string[],
    getDynamicOrgStats,
    dynamicAdminStats,
    dynamicOwnerStats,
    syncFromDatabase,
  };
}

type MediStockContextType = ReturnType<typeof useMediStockStoreInternal>;

const MediStockContext = createContext<MediStockContextType | null>(null);

export const MediStockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useMediStockStoreInternal();
  return React.createElement(MediStockContext.Provider, { value: store }, children);
};

export const useMediStockStore = () => {
  const context = useContext(MediStockContext);
  if (!context) {
    throw new Error('useMediStockStore must be used within a MediStockProvider');
  }
  return context;
};

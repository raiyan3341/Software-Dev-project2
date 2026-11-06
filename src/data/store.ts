import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
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
  INITIAL_ORGANIZATIONS,
  INITIAL_ORDERS,
  INITIAL_DONORS,
  INITIAL_BLOOD_REQUESTS,
  INITIAL_DEMAND_REQUESTS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_USERS,
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'medistock_users_v6',
  CURRENT_USER: 'medistock_current_user_v6',
  PRODUCTS: 'medistock_products_v6',
  DELETED_PRODUCTS: 'medistock_deleted_products_v6',
  CATEGORIES: 'medistock_categories_v5',
  ORGANIZATIONS: 'medistock_orgs_clean',
  ORDERS: 'medistock_orders_clean',
  DONORS: 'medistock_donors_clean',
  BLOOD_REQUESTS: 'medistock_blood_reqs_clean',
  DONOR_REQUESTS: 'medistock_donor_reqs_clean',
  DEMAND_REQUESTS: 'medistock_demand_reqs_clean',
  ACTIVITY_LOGS: 'medistock_logs_clean',
  CART: 'medistock_cart_clean',
  NOTIFICATIONS: 'medistock_notifications_clean',
};

const INITIAL_NOTIFICATIONS: UserNotification[] = [];

// Auto-clean old cached mock data for testing
try {
  if (typeof window !== 'undefined' && !localStorage.getItem('medistock_cleaned_v6')) {
    localStorage.removeItem('medistock_orgs_v5');
    localStorage.removeItem('medistock_orders_v5');
    localStorage.removeItem('medistock_donors_v5');
    localStorage.removeItem('medistock_blood_reqs_v5');
    localStorage.removeItem('medistock_demand_reqs_v5');
    localStorage.removeItem('medistock_logs_v5');
    localStorage.removeItem('medistock_cart_v5');
    localStorage.removeItem('medistock_notifications_v5');
    localStorage.setItem('medistock_cleaned_v6', 'true');
  }
} catch (e) {
  // Ignore storage exceptions
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === 'undefined' || item === 'null') {
      return fallback;
    }
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Error reading localStorage key ${key}:`, e);
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
    console.warn(`Error saving to localStorage key ${key}:`, e);
  }
}

function useMediStockStoreInternal() {
  // 1. Users & Authentication (default guest / logged out if null)
  const [users, setUsersState] = useState<UserProfile[]>(() =>
    loadFromStorage<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS)
  );

  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() =>
    loadFromStorage<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null)
  );

  // 2. Core Data
  const [deletedProductIds, setDeletedProductIdsState] = useState<string[]>(() =>
    loadFromStorage<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, [])
  );

  const setDeletedProductIds = (ids: string[]) => {
    setDeletedProductIdsState(ids);
    saveToStorage(STORAGE_KEYS.DELETED_PRODUCTS, ids);
  };

  const [products, setProductsState] = useState<Product[]>(() => {
    const deleted = loadFromStorage<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, []);
    const saved = loadFromStorage<Product[] | null>(STORAGE_KEYS.PRODUCTS, null)
      || loadFromStorage<Product[] | null>('medistock_products_v5', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      const filtered = saved.filter(p => !deleted.includes(p.id) && !deleted.includes(p.sku));
      saveToStorage(STORAGE_KEYS.PRODUCTS, filtered);
      return filtered;
    }
    const initial = INITIAL_PRODUCTS.filter(p => !deleted.includes(p.id) && !deleted.includes(p.sku));
    saveToStorage(STORAGE_KEYS.PRODUCTS, initial);
    return initial;
  });

  const [categories, setCategoriesState] = useState<Category[]>(() =>
    loadFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES)
  );

  const [organizations, setOrganizationsState] = useState<Organization[]>(() =>
    loadFromStorage<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS)
  );

  const [orders, setOrdersState] = useState<Order[]>(() =>
    loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );

  const [donors, setDonorsState] = useState<BloodDonor[]>(() =>
    loadFromStorage<BloodDonor[]>(STORAGE_KEYS.DONORS, INITIAL_DONORS)
  );

  const [bloodRequests, setBloodRequestsState] = useState<BloodRequest[]>(() =>
    loadFromStorage<BloodRequest[]>(STORAGE_KEYS.BLOOD_REQUESTS, INITIAL_BLOOD_REQUESTS)
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

  // 3. Shared Real-time Cart
  const [cart, setCartState] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>(STORAGE_KEYS.CART, [])
  );

  // 4. Shared Real-time Notifications
  const [notifications, setNotificationsState] = useState<UserNotification[]>(() =>
    loadFromStorage<UserNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  // Storage and Sync Helpers
  const setUsers = (newUsers: UserProfile[]) => {
    setUsersState(newUsers);
    saveToStorage(STORAGE_KEYS.USERS, newUsers);
  };

  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentUserState(user);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
  };

  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts);
    saveToStorage(STORAGE_KEYS.PRODUCTS, newProducts);
  };

  const setCategories = (newCategories: Category[]) => {
    setCategoriesState(newCategories);
    saveToStorage(STORAGE_KEYS.CATEGORIES, newCategories);
  };

  const setOrganizations = (newOrgs: Organization[]) => {
    setOrganizationsState(newOrgs);
    saveToStorage(STORAGE_KEYS.ORGANIZATIONS, newOrgs);
  };

  const setOrders = (newOrders: Order[]) => {
    setOrdersState(newOrders);
    saveToStorage(STORAGE_KEYS.ORDERS, newOrders);
  };

  const setDonors = (newDonors: BloodDonor[]) => {
    setDonorsState(newDonors);
    saveToStorage(STORAGE_KEYS.DONORS, newDonors);
  };

  const setBloodRequests = (newReqs: BloodRequest[]) => {
    setBloodRequestsState(newReqs);
    saveToStorage(STORAGE_KEYS.BLOOD_REQUESTS, newReqs);
  };

  const setDonorRequests = (newReqs: DonorDirectRequest[]) => {
    setDonorRequestsState(newReqs);
    saveToStorage(STORAGE_KEYS.DONOR_REQUESTS, newReqs);
  };

  const setDemandRequests = (newReqs: ProductDemandRequest[]) => {
    setDemandRequestsState(newReqs);
    saveToStorage(STORAGE_KEYS.DEMAND_REQUESTS, newReqs);
  };

  const setActivityLogs = (newLogs: ActivityLog[]) => {
    setActivityLogsState(newLogs);
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, newLogs);
  };

  const setCart = (action: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    setCartState(prev => {
      const updated = typeof action === 'function' ? action(prev) : action;
      saveToStorage(STORAGE_KEYS.CART, updated);
      return updated;
    });
  };

  const setNotifications = (newNotifs: UserNotification[]) => {
    setNotificationsState(newNotifs);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, newNotifs);
  };

  // Synchronize with Supabase Cloud if configured in .env
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Listen for Supabase OAuth login (e.g. Google return)
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const authUser = session.user;
          const userEmail = authUser.email || '';
          const userProfile: UserProfile = {
            id: authUser.id,
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || userEmail.split('@')[0] || 'Google User',
            email: userEmail,
            avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            role: 'normal_user',
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
          };
          setCurrentUserState(userProfile);
          saveToStorage(STORAGE_KEYS.CURRENT_USER, userProfile);
        }
      });

      // 2. Hydrate session if already signed in
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const authUser = session.user;
          const userEmail = authUser.email || '';
          const userProfile: UserProfile = {
            id: authUser.id,
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || userEmail.split('@')[0] || 'Google User',
            email: userEmail,
            avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            role: 'normal_user',
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
          };
          setCurrentUserState(userProfile);
          saveToStorage(STORAGE_KEYS.CURRENT_USER, userProfile);
        }
      });

      dbService.fetchProducts().then(prods => {
        if (prods && prods.length > 0) {
          setProductsState(currentProducts => {
            const currentDeleted = loadFromStorage<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, []);
            const existingIds = new Set(currentProducts.map(p => p.id));
            const existingSkus = new Set(currentProducts.map(p => p.sku.toLowerCase()));
            
            // Only merge truly new products from Supabase that are not already in currentProducts and not in currentDeleted
            const newFromDb = prods.filter(p => 
              !currentDeleted.includes(p.id) && 
              !currentDeleted.includes(p.sku) &&
              !existingIds.has(p.id) && 
              !existingSkus.has(p.sku.toLowerCase())
            );
            
            if (newFromDb.length > 0) {
              const merged = [...currentProducts, ...newFromDb];
              saveToStorage(STORAGE_KEYS.PRODUCTS, merged);
              return merged;
            }
            return currentProducts;
          });
        }
      });
      dbService.fetchOrganizations().then(orgs => {
        if (orgs && orgs.length > 0) setOrganizations(orgs);
      });
      dbService.fetchOrders().then(ords => {
        if (ords && ords.length > 0) setOrders(ords);
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, []);

  // Authentication Methods (Strict: Real-world authentication requires registration first)
  const login = (email: string, password?: string): UserProfile => {
    if (!email || !email.trim()) {
      throw new Error('Please enter your email address.');
    }
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      throw new Error('No account found with this email. Please switch to the Sign Up tab to register first.');
    }
    if (password && found.password && found.password !== password) {
      throw new Error('Incorrect password. Please verify your credentials and try again.');
    }
    setCurrentUser(found);
    logActivity('User Signed In', `${found.name} (${found.role})`, 'user');
    return found;
  };

  const loginWithGoogle = (email: string): UserProfile => {
    if (!email || !email.trim()) {
      throw new Error('Please provide your Google email address.');
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('No account found with this Google email. You cannot sign in without registering first. Please switch to the Sign Up tab to create your account.');
    }
    setCurrentUser(user);
    logActivity('Google Authentication Signed In', `${user.name}`, 'user');
    return user;
  };

  const registerWithGoogle = (data: { email: string; name?: string; role?: UserRole }): UserProfile => {
    if (!data.email || !data.email.trim()) {
      throw new Error('Please provide your Google email address.');
    }
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this Google email already exists. Please switch to Sign In to log in.');
    }
    const newUser: UserProfile = {
      id: `user-g-${Date.now()}`,
      name: data.name?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      role: data.role || 'normal_user',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...users, newUser];
    setUsers(updated);
    setCurrentUser(newUser);

    if (isSupabaseConfigured) {
      dbService.updateUserProfile(newUser);
    }

    logActivity('New Google User Registered', `${newUser.name} (${newUser.role})`, 'user');
    return newUser;
  };

  const registerUser = (data: { name: string; email: string; password?: string; role?: UserRole; phone?: string }): UserProfile => {
    if (!data.email || !data.email.trim()) {
      throw new Error('Please enter a valid email address.');
    }
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please switch to Sign In.');
    }
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
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
      dbService.updateUserProfile(newUser);
    }

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

  // Real-time Profile & Settings Updates (persists to storage and Supabase cloud)
  const updateUserProfile = (updatedData: Partial<UserProfile>) => {
    if (!currentUser) return null;
    const updatedUser: UserProfile = {
      ...currentUser,
      ...updatedData,
    };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers);

    // Save to Supabase Cloud if configured
    if (isSupabaseConfigured) {
      dbService.updateUserProfile(updatedUser);
    }
    logActivity('Updated Profile Details', updatedUser.name, 'user');
    return updatedUser;
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
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers);

    if (isSupabaseConfigured) {
      dbService.updateUserProfile(updatedUser);
    }
    logActivity('Updated Account Settings', updatedUser.name, 'user');
    return updatedUser;
  };

  const changePassword = async (newPass: string) => {
    if (!currentUser) throw new Error('No user logged in');
    const updatedUser: UserProfile = {
      ...currentUser,
      password: newPass,
    };
    setCurrentUser(updatedUser);
    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    setUsers(updatedUsers);

    if (isSupabaseConfigured) {
      await dbService.updatePassword(newPass);
    }
    logActivity('Password Changed', currentUser.name, 'user');
    return true;
  };

  // Real-time Notifications Management
  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
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

  // Activity logger
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
    setActivityLogs([newLog, ...activityLogs]);
  };

  // Real-time Cart Operations (triggers instant UI updates across the entire app)
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

  // Order Placement (deducts stock, recalculates statistics, adds notification, saves to Supabase)
  const placeOrder = (orgOrId: Organization | string, customItems?: CartItem[]): Order => {
    const activeCart = customItems || cart;
    if (activeCart.length === 0) {
      throw new Error('Your cart is empty. Please add medical supplies before placing an order.');
    }

    const org: Organization = typeof orgOrId === 'string'
      ? organizations.find(o => o.id === orgOrId) || {
          id: orgOrId,
          name: currentUser?.name || 'Partner Pharmacy',
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
      throw new Error(`Cannot place order: Organization "${org.name}" is ${org.verificationStatus.toLowerCase()} approval by DGHS Admin. Restock orders require verified healthcare facility credentials.`);
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

    // Deduct stock safely in real-time
    const updatedProducts = products.map(prod => {
      const inCart = activeCart.find(c => c.product.id === prod.id);
      if (inCart) {
        return { ...prod, stock: Math.max(0, prod.stock - inCart.quantity) };
      }
      return prod;
    });
    setProducts(updatedProducts);

    // Dynamic organization counters
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

    setOrders([newOrder, ...orders]);
    clearCart();

    // Persist to Supabase if connected
    if (isSupabaseConfigured) {
      dbService.saveOrder(newOrder);
    }

    // Add real-time notification
    addNotification({
      title: 'Restock Order Submitted',
      message: `${orderNum} for ${org.name} (৳${subtotal.toLocaleString()}) has been queued for verification.`,
      type: 'order',
    });

    logActivity('Placed New Order', `${orderNum} (${org.name}) - ৳${subtotal.toLocaleString()}`, 'order');
    return newOrder;
  };

  // Update Order Status (Restores stock if cancelled!)
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
          return { ...prod, stock: prod.stock + item.quantity };
        }
        return prod;
      });
      setProducts(updatedProducts);
    }

    logActivity(`Order ${orderId} Status Updated`, `New status: ${newStatus}`, 'order');
  };

  // Organization verification (Admin Approval / Rejection)
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

    // If Approved: upgrade the linked user's role to 'organization'!
    // If Rejected: ensure user's role remains 'normal_user'!
    const updatedUsers = users.map(u => {
      const isLinked = u.organizationId === orgId || (targetOrg && u.email.toLowerCase() === targetOrg.email.toLowerCase());
      if (isLinked) {
        return {
          ...u,
          organizationId: orgId,
          role: (status === 'Approved' ? 'organization' : 'normal_user') as UserRole,
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    // Also update currentUser if it matches the organization
    if (currentUser) {
      const isCurrentLinked = currentUser.organizationId === orgId || (targetOrg && currentUser.email.toLowerCase() === targetOrg.email.toLowerCase());
      if (isCurrentLinked) {
        const updatedCurrentUser: UserProfile = {
          ...currentUser,
          organizationId: orgId,
          role: (status === 'Approved' ? 'organization' : 'normal_user') as UserRole,
        };
        setCurrentUser(updatedCurrentUser);
      }
    }

    addNotification({
      title: status === 'Approved' ? 'Organization Approved! 🎉' : 'Organization Application Rejected',
      message: status === 'Approved'
        ? `Congratulations! ${targetOrgName} has been approved by Admin. You can now place wholesale medical restock orders.`
        : `Your application for ${targetOrgName} was rejected: ${reason || 'Documents could not be verified'}.`,
      type: 'order',
    });

    logActivity(`Organization Verification`, `Org ID: ${orgId} -> ${status}`, 'organization');
  };

  // Register new organization
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
    const newOrgId = `org-${Date.now()}`;
    const newOrg: Organization = {
      id: newOrgId,
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

    // Link organizationId to currentUser without dummy passwords and WITHOUT auto-promoting to 'organization' role!
    // The user's role remains 'normal_user' until an administrator reviews and approves the application.
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        organizationId: newOrgId,
        // Role stays normal_user until Admin verification approval
      };
      setCurrentUser(updatedUser);
      const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
      setUsers(updatedUsers);
    }

    if (isSupabaseConfigured) {
      dbService.saveOrganization(newOrg);
    }

    addNotification({
      title: 'New Organization Registered',
      message: `${newOrg.name} has submitted documentation and is awaiting DGHS verification.`,
      type: 'system',
    });

    logActivity('New Organization Registered', `${newOrg.name} (${newOrg.type}) - Pending Review`, 'organization');
    return newOrg;
  };

  // Blood Request submission
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
      id: `breq-${Date.now()}`,
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

    addNotification({
      title: 'Emergency Blood Request Posted 🩸',
      message: `${data.bloodGroup} urgently needed at ${data.hospital} (${data.unitsNeeded} units).`,
      type: 'blood',
    });

    logActivity('Blood Request Created', `${data.bloodGroup} for ${data.hospital}`, 'system');
    return newReq;
  };

  // Accept blood request (donor agrees to donate)
  const acceptBloodRequest = (requestId: string, donorPhone: string, donorMessage?: string) => {
    if (!currentUser) throw new Error('Please sign in to accept this blood donation request.');
    const target = bloodRequests.find(r => r.id === requestId);
    if (!target) throw new Error('Blood request not found.');

    const updatedReqs = bloodRequests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Accepted' as const,
          acceptedById: currentUser.id,
          acceptedByName: currentUser.name,
          acceptedByPhone: donorPhone || currentUser.phone || '',
          acceptedAt: new Date().toISOString(),
          donorMessage: donorMessage || 'I am ready to donate blood for this patient.',
        };
      }
      return r;
    });

    setBloodRequests(updatedReqs);

    addNotification({
      title: 'Donor Accepted Your Blood Request! 🩸',
      message: `${currentUser.name} has volunteered to donate ${target.bloodGroup} for ${target.hospital}! Contact: ${donorPhone || currentUser.phone || 'Available in app'}`,
      type: 'blood',
      userId: target.requesterId,
    });

    logActivity('Blood Request Accepted', `${currentUser.name} volunteered for ${target.hospital}`, 'user');
  };

  // Fulfill Blood Request (requester marks fulfilled)
  const fulfillBloodRequest = (requestId: string) => {
    const updated = bloodRequests.map(r => r.id === requestId ? { ...r, status: 'Fulfilled' as const } : r);
    setBloodRequests(updated);
    logActivity('Blood Request Fulfilled', `Request ${requestId} marked completed`, 'user');
  };

  // Delete Blood Request
  const deleteBloodRequest = (requestId: string) => {
    const updated = bloodRequests.filter(r => r.id !== requestId);
    setBloodRequests(updated);
    if (isSupabaseConfigured) {
      dbService.deleteBloodRequest(requestId);
    }
    logActivity('Blood Request Removed', `Request ${requestId} deleted`, 'user');
  };

  // Clear All Blood Requests (Admin / Owner 1-Click)
  const clearAllBloodRequests = () => {
    setBloodRequests([]);
    if (isSupabaseConfigured) {
      dbService.clearAllBloodRequests();
    }
    logActivity('All Blood Requests Cleared', 'Admin/Owner 1-Click Action', 'system');
  };

  // Clear Completed / Fulfilled Blood Requests
  const clearFulfilledBloodRequests = () => {
    const updated = bloodRequests.filter(r => r.status !== 'Fulfilled' && r.status !== 'Cancelled');
    const removedCount = bloodRequests.length - updated.length;
    setBloodRequests(updated);
    logActivity('Fulfilled Blood Requests Cleared', `Removed ${removedCount} completed requests`, 'system');
  };

  // Register or Update as Blood Donor
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
      updated[existingIndex] = {
        ...updated[existingIndex],
        bloodGroup: data.bloodGroup,
        location: data.location,
        phone: data.phone,
        notes: data.notes,
        isAvailable: true,
      };
      setDonors(updated);
      logActivity('Donor Profile Updated', `${currentUser.name} (${data.bloodGroup})`, 'user');
      return updated[existingIndex];
    } else {
      const newDonor: BloodDonor = {
        id: `donor-${Date.now()}`,
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
      logActivity('Donor Registered', `${currentUser.name} (${data.bloodGroup})`, 'user');
      return newDonor;
    }
  };

  // Toggle Donor Availability
  const toggleDonorAvailability = (donorId: string) => {
    const updated = donors.map(d => d.id === donorId ? { ...d, isAvailable: !d.isAvailable } : d);
    setDonors(updated);
  };

  // Delete Donor Profile
  const deleteDonor = (donorId: string) => {
    const updated = donors.filter(d => d.id !== donorId);
    setDonors(updated);
    logActivity('Donor Profile Removed', `Donor ID ${donorId}`, 'user');
  };

  // Clear All Donors (Admin / Owner 1-Click Action)
  const clearAllDonors = () => {
    setDonors([]);
    logActivity('All Donors Cleared', 'Admin/Owner Action', 'system');
  };

  // Send Direct Request to Donor
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

  // Respond to Direct Donor Request
  const respondToDonorRequest = (requestId: string, status: 'Accepted' | 'Declined') => {
    const target = donorRequests.find(r => r.id === requestId);
    const updated = donorRequests.map(r => r.id === requestId ? { ...r, status } : r);
    setDonorRequests(updated);

    if (target) {
      addNotification({
        title: status === 'Accepted' ? 'Donor Accepted Your Request! 🎉' : 'Donor Is Unavailable',
        message: status === 'Accepted'
          ? `${target.donorName} accepted your blood request for ${target.hospital}! Contact: ${currentUser?.phone || 'In app'}`
          : `${target.donorName} is unable to donate blood at this time.`,
        type: 'blood',
        userId: target.requesterId,
      });
    }

    logActivity('Direct Donor Request Response', `${status} for request ${requestId}`, 'user');
  };

  // Delete Direct Donor Request
  const deleteDonorRequest = (requestId: string) => {
    const updated = donorRequests.filter(r => r.id !== requestId);
    setDonorRequests(updated);
    logActivity('Donor Request Removed', `Request ID ${requestId}`, 'user');
  };

  // Clear All Direct Donor Requests (Admin / Owner Action)
  const clearAllDonorRequests = () => {
    setDonorRequests([]);
    logActivity('All Direct Donor Requests Cleared', 'Admin/Owner Action', 'system');
  };

  // Add Product (Admin & Owner)
  const addProduct = (productData: Omit<Product, 'id'> & { id?: string }) => {
    const id = productData.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`);
    const newProduct: Product = {
      ...productData,
      id,
    };

    // Remove from deleted list if it was previously marked deleted
    const currentDeleted = loadFromStorage<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, []);
    const updatedDeleted = currentDeleted.filter(did => did !== id && did !== newProduct.sku);
    setDeletedProductIds(updatedDeleted);

    const updated = [newProduct, ...products.filter(p => p.id !== id && p.sku !== newProduct.sku)];
    setProducts(updated);

    if (isSupabaseConfigured) {
      dbService.saveProduct(newProduct);
    }

    addNotification({
      title: 'New Product Added',
      message: `${newProduct.name} (${newProduct.sku}) added to catalog.`,
      type: 'stock',
    });

    logActivity('Added New Product to Catalog', `${newProduct.name} (${newProduct.sku})`, 'product');
    return newProduct;
  };

  // Delete Product (Admin & Owner)
  const deleteProduct = (productId: string) => {
    const target = products.find(p => p.id === productId);
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);

    // Save to deletedProductIds so it can NEVER be re-seeded or resurrected on refresh
    const targetSku = target?.sku;
    const currentDeleted = loadFromStorage<string[]>(STORAGE_KEYS.DELETED_PRODUCTS, []);
    const newDeleted = [...currentDeleted, productId];
    if (targetSku) newDeleted.push(targetSku);
    setDeletedProductIds(Array.from(new Set(newDeleted)));

    // Also remove from active cart if it was in cart
    removeFromCart(productId);

    if (isSupabaseConfigured) {
      dbService.deleteProduct(productId);
    }

    addNotification({
      title: 'Product Removed',
      message: `${target?.name || 'Product'} has been deleted from the catalog.`,
      type: 'stock',
    });

    logActivity('Product Deleted', `${target?.name || productId} (${target?.sku || ''})`, 'product');
  };

  // Delete User Account (Admin & Owner)
  const deleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    // Safety guard: Root platform owner cannot be deleted
    if (target.role === 'owner') {
      alert('The root platform owner account cannot be deleted.');
      return;
    }

    // Safety guard: Current user cannot delete themselves
    if (target.id === currentUser?.id) {
      alert('You cannot delete your own logged-in account.');
      return;
    }

    // Remove user
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);

    // Also remove any linked blood donor record to prevent orphan data
    const updatedDonors = donors.filter(d => d.userId !== userId && d.email.toLowerCase() !== target.email.toLowerCase());
    if (updatedDonors.length !== donors.length) {
      setDonors(updatedDonors);
    }

    // Also remove any linked organization if it was an organization user
    if (target.organizationId) {
      const updatedOrgs = organizations.filter(o => o.id !== target.organizationId);
      setOrganizations(updatedOrgs);
    }

    if (isSupabaseConfigured) {
      dbService.deleteUser(userId);
    }

    addNotification({
      title: 'User Account Deleted',
      message: `User account for ${target.name} (${target.email}) has been removed.`,
      type: 'system',
    });

    logActivity('User Account Removed', `${target.name} (${target.email}) - Role: ${target.role}`, 'system');
  };

  // Product demand request
  const submitProductDemand = (data: {
    orgId: string;
    orgName: string;
    itemName: string;
    requestedQuantity: number;
    explanation: string;
  }) => {
    const newReq: ProductDemandRequest = {
      id: `dreq-${Date.now()}`,
      organizationId: data.orgId,
      organizationName: data.orgName,
      itemName: data.itemName,
      requestedQuantity: data.requestedQuantity,
      explanation: data.explanation,
      status: 'Under Review',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDemandRequests([newReq, ...demandRequests]);
    logActivity('Product Demand Requested', `${data.itemName} (Qty: ${data.requestedQuantity}) by ${data.orgName}`, 'product');
    return newReq;
  };

  // DYNAMIC COMPUTED STATISTICS (No Hardcoded Numbers!)
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

  return {
    currentUser,
    activeRole: currentUser?.role || 'normal_user',
    login,
    loginWithGoogle,
    registerWithGoogle,
    registerUser,
    updateUserProfile,
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
    getDynamicOrgStats,
    dynamicAdminStats,
    dynamicOwnerStats,
  };
}

// 5. Global Shared React Context for 100% Real-time State Synchronization
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

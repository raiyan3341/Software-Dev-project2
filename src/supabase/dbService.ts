import { supabase, isSupabaseConfigured } from './client';
import { 
  Product, 
  Organization, 
  Order, 
  OrderStatus, 
  BloodDonor, 
  BloodRequest, 
  ProductDemandRequest, 
  ActivityLog, 
  UserProfile, 
  UserRole 
} from '../types';

/**
 * MediStock Supabase Service (Clean Architecture)
 * Directly connects to Supabase PostgreSQL cloud tables.
 * Single source of truth for the entire platform.
 */
export const dbService = {
  isLive: isSupabaseConfigured,

  // ============================================================================
  // 1. PRODUCTS
  // ============================================================================
  async fetchProducts(): Promise<Product[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        console.warn('Supabase fetchProducts error:', error.message);
        return null;
      }
      if (!data) return [];
      return data.map((r: any) => ({
        id: r.id,
        name: r.name,
        sku: r.sku,
        category: r.category_name,
        manufacturer: r.manufacturer,
        unit: r.unit,
        price: Number(r.price),
        stock: Number(r.stock),
        minStockThreshold: Number(r.min_stock_threshold ?? 20),
        isPrescriptionRequired: Boolean(r.is_prescription_required),
        isActive: Boolean(r.is_active),
        batchNumber: r.batch_number || 'BATCH-001',
        expiryDate: r.expiry_date || '2028-12-31',
        description: r.description || '',
        image: r.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      }));
    } catch (err) {
      console.warn('Supabase fetchProducts exception:', err);
      return null;
    }
  },

  async saveProduct(p: Product): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const payload = {
        id: p.id,
        name: p.name,
        sku: p.sku,
        category_name: p.category,
        manufacturer: p.manufacturer,
        unit: p.unit,
        price: p.price,
        stock: p.stock,
        min_stock_threshold: p.minStockThreshold,
        is_prescription_required: p.isPrescriptionRequired,
        is_active: p.isActive,
        batch_number: p.batchNumber,
        expiry_date: p.expiryDate,
        description: p.description,
        image_url: p.image,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('products').upsert(payload, { onConflict: 'sku' });
      if (error) {
        console.warn('Supabase saveProduct error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveProduct exception:', err);
      return false;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('products').delete().or(`id.eq.${id},sku.eq.${id}`);
      return !error;
    } catch {
      return false;
    }
  },

  // ============================================================================
  // 2. PROFILES (USERS)
  // ============================================================================
  async fetchProfiles(): Promise<UserProfile[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.warn('Supabase fetchProfiles error:', error.message);
        return null;
      }
      if (!data) return [];
      return data.map((r: any) => ({
        id: r.id,
        name: r.full_name,
        email: r.email,
        password: r.password || 'password123',
        avatar: r.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        role: (r.role || 'normal_user') as UserRole,
        status: (r.status || 'active') as 'active' | 'suspended',
        phone: r.phone || undefined,
        city: r.city || undefined,
        address: r.address || undefined,
        bloodGroup: r.blood_group || undefined,
        organizationId: r.organization_id || undefined,
        createdAt: r.created_at ? r.created_at.split('T')[0] : '2025-01-01',
      }));
    } catch (err) {
      console.warn('Supabase fetchProfiles exception:', err);
      return null;
    }
  },

  async saveProfile(u: UserProfile): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const payload: any = {
        id: u.id,
        email: u.email.toLowerCase(),
        full_name: u.name,
        password: u.password || 'password123',
        avatar_url: u.avatar,
        role: u.role,
        organization_id: u.organizationId || null,
        phone: u.phone || null,
        city: u.city || 'Dhaka',
        address: u.address || '',
        blood_group: u.bloodGroup || '',
        status: u.status || 'active',
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'email' });
      if (error) {
        // If PostgreSQL does not have city/address columns yet, fallback safely
        if (error.message.includes('column') || error.code === 'PGRST204') {
          const safePayload = {
            id: u.id,
            email: u.email.toLowerCase(),
            full_name: u.name,
            password: u.password || 'password123',
            avatar_url: u.avatar,
            role: u.role,
            organization_id: u.organizationId || null,
            phone: u.phone || null,
            status: u.status || 'active',
            updated_at: new Date().toISOString(),
          };
          await supabase.from('profiles').upsert(safePayload, { onConflict: 'email' });
        } else {
          console.warn('Supabase saveProfile error:', error.message);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveProfile exception:', err);
      return false;
    }
  },

  async updateUserRoleInDb(userId: string, role: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .or(`id.eq.${userId},email.eq.${userId.toLowerCase()}`);
      return !error;
    } catch {
      return false;
    }
  },

  async deleteProfile(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .or(`id.eq.${userId},email.eq.${userId.toLowerCase()}`);
      return !error;
    } catch {
      return false;
    }
  },

  // ============================================================================
  // 3. ORGANIZATIONS
  // ============================================================================
  async fetchOrganizations(): Promise<Organization[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Supabase fetchOrganizations error:', error.message);
        return null;
      }
      if (!data) return [];
      return data.map((r: any) => ({
        id: r.id,
        userId: r.user_id || undefined,
        name: r.name,
        type: r.type,
        representative: r.representative,
        email: r.email,
        phone: r.phone,
        address: r.address,
        city: r.city,
        verificationStatus: r.verification_status,
        rejectionReason: r.rejection_reason || undefined,
        documents: Array.isArray(r.documents) ? r.documents : [],
        totalOrders: Number(r.total_orders || 0),
        pendingOrders: Number(r.pending_orders || 0),
        totalSpent: Number(r.total_spent || 0),
        createdAt: r.created_at ? r.created_at.split('T')[0] : '2025-01-01',
      }));
    } catch (err) {
      console.warn('Supabase fetchOrganizations exception:', err);
      return null;
    }
  },

  async saveOrganization(org: Organization): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const payload = {
        id: org.id,
        user_id: org.userId || null,
        name: org.name,
        type: org.type,
        representative: org.representative,
        email: org.email.toLowerCase(),
        phone: org.phone,
        address: org.address,
        city: org.city,
        verification_status: org.verificationStatus,
        rejection_reason: org.rejectionReason || null,
        documents: org.documents || [],
        total_orders: org.totalOrders || 0,
        pending_orders: org.pendingOrders || 0,
        total_spent: org.totalSpent || 0,
      };
      const { error } = await supabase.from('organizations').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase saveOrganization error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveOrganization exception:', err);
      return false;
    }
  },

  async verifyOrganizationInDb(orgId: string, status: string, reason?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          verification_status: status,
          rejection_reason: reason || null,
        })
        .eq('id', orgId);
      return !error;
    } catch {
      return false;
    }
  },

  // ============================================================================
  // 4. ORDERS
  // ============================================================================
  async fetchOrders(): Promise<Order[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Supabase fetchOrders error:', error.message);
        return null;
      }
      if (!data) return [];
      return data.map((r: any) => ({
        id: r.id,
        organizationId: r.organization_id || '',
        organizationName: r.organization_name,
        organizationAddress: r.organization_address || '',
        organizationPhone: r.organization_phone || '',
        organizationEmail: r.organization_email || '',
        items: Array.isArray(r.items) ? r.items : [],
        subtotal: Number(r.subtotal || 0),
        tax: Number(r.tax || 0),
        total: Number(r.total || 0),
        status: r.status as OrderStatus,
        date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Apr 24, 2025',
        timeline: Array.isArray(r.timeline) ? r.timeline : [],
      }));
    } catch (err) {
      console.warn('Supabase fetchOrders exception:', err);
      return null;
    }
  },

  async saveOrder(order: Order): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const payload = {
        id: order.id,
        organization_id: order.organizationId,
        organization_name: order.organizationName,
        organization_address: order.organizationAddress,
        organization_phone: order.organizationPhone,
        organization_email: order.organizationEmail,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: order.status,
        timeline: order.timeline,
      };
      const { error } = await supabase.from('orders').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase saveOrder error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveOrder exception:', err);
      return false;
    }
  },

  async updateOrderStatusInDb(orderId: string, status: OrderStatus, timeline: any[]): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, timeline })
        .eq('id', orderId);
      return !error;
    } catch {
      return false;
    }
  },

  // ============================================================================
  // 5. BLOOD DONATION (REQUESTS & DONORS)
  // ============================================================================
  async fetchBloodRequests(): Promise<BloodRequest[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Supabase fetchBloodRequests error:', error.message);
        return null;
      }
      if (!data) return [];
      return data.map((r: any) => ({
        id: r.id,
        requesterId: r.requester_id || 'guest',
        requesterName: r.requester_name,
        requesterAvatar: r.requester_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        bloodGroup: r.blood_group,
        hospital: r.hospital,
        location: r.location,
        unitsNeeded: Number(r.units_needed || 1),
        dateNeeded: r.date_needed,
        contactPhone: r.contact_phone,
        urgency: r.urgency as any,
        notes: r.notes || '',
        status: r.status as any,
        acceptedById: r.accepted_by_id || undefined,
        acceptedByName: r.accepted_by_name || undefined,
        acceptedByPhone: r.accepted_by_phone || undefined,
        acceptedAt: r.accepted_at || undefined,
        donorMessage: r.donor_message || undefined,
        createdAt: r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      }));
    } catch (err) {
      console.warn('Supabase fetchBloodRequests exception:', err);
      return null;
    }
  },

  async saveBloodRequest(req: BloodRequest): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const payload = {
        id: req.id,
        requester_id: req.requesterId,
        requester_name: req.requesterName,
        requester_avatar: req.requesterAvatar,
        blood_group: req.bloodGroup,
        hospital: req.hospital,
        location: req.location,
        units_needed: req.unitsNeeded,
        date_needed: req.dateNeeded,
        contact_phone: req.contactPhone,
        urgency: req.urgency,
        notes: req.notes,
        status: req.status,
        accepted_by_id: req.acceptedById || null,
        accepted_by_name: req.acceptedByName || null,
        accepted_by_phone: req.acceptedByPhone || null,
        accepted_at: req.acceptedAt || null,
        donor_message: req.donorMessage || null,
      };
      const { error } = await supabase.from('blood_requests').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase saveBloodRequest error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveBloodRequest exception:', err);
      return false;
    }
  },

  async deleteBloodRequest(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('blood_requests').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  async clearAllBloodRequests(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('blood_requests').delete().neq('id', '__keep_none__');
      return !error;
    } catch {
      return false;
    }
  },

  async fetchBloodDonors(): Promise<BloodDonor[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('blood_donors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.warn('Supabase fetchBloodDonors error:', error.message);
        return null;
      }
      if (!data) return [];
      return data.map((r: any) => ({
        id: r.id,
        userId: r.user_id || undefined,
        name: r.name,
        email: r.email || '',
        phone: r.phone,
        avatar: r.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        bloodGroup: r.blood_group as any,
        location: r.location,
        isAvailable: Boolean(r.is_available),
        lastDonationDate: r.last_donation_date || undefined,
        notes: r.notes || '',
        createdAt: r.created_at ? r.created_at.split('T')[0] : '2025-01-01',
      }));
    } catch (err) {
      console.warn('Supabase fetchBloodDonors exception:', err);
      return null;
    }
  },

  async saveBloodDonor(donor: BloodDonor): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const payload = {
        id: donor.id,
        user_id: donor.userId || null,
        name: donor.name,
        email: donor.email || null,
        phone: donor.phone,
        avatar_url: donor.avatar,
        blood_group: donor.bloodGroup,
        location: donor.location,
        is_available: donor.isAvailable,
        last_donation_date: donor.lastDonationDate || null,
        notes: donor.notes || '',
      };
      const { error } = await supabase.from('blood_donors').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase saveBloodDonor error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveBloodDonor exception:', err);
      return false;
    }
  },

  async deleteBloodDonor(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('blood_donors').delete().or(`id.eq.${id},phone.eq.${id}`);
      return !error;
    } catch {
      return false;
    }
  },

  async clearAllBloodDonors(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('blood_donors').delete().neq('id', '__keep_none__');
      return !error;
    } catch {
      return false;
    }
  },

  // ============================================================================
  // 6. PRODUCT DEMAND REQUESTS
  // ============================================================================
  async fetchDemandRequests(): Promise<ProductDemandRequest[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('product_demand_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data) return null;
      return data.map((r: any) => ({
        id: r.id,
        organizationId: r.organization_id,
        organizationName: r.organization_name,
        itemName: r.item_name,
        requestedQuantity: Number(r.requested_quantity || 1),
        explanation: r.explanation,
        status: r.status as any,
        adminNotes: r.admin_notes || undefined,
        createdAt: r.created_at ? r.created_at.split('T')[0] : '2025-01-01',
      }));
    } catch {
      return null;
    }
  },

  async saveDemandRequest(req: ProductDemandRequest): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const payload = {
        id: req.id,
        organization_id: req.organizationId,
        organization_name: req.organizationName,
        item_name: req.itemName,
        requested_quantity: req.requestedQuantity,
        explanation: req.explanation,
        status: req.status,
        admin_notes: req.adminNotes || null,
      };
      const { error } = await supabase.from('product_demand_requests').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // ============================================================================
  // 7. ACTIVITY LOGS
  // ============================================================================
  async fetchActivityLogs(): Promise<ActivityLog[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error || !data) return null;
      return data.map((r: any) => ({
        id: r.id,
        actorName: r.actor_name,
        actorRole: r.actor_role,
        action: r.action,
        target: r.target,
        timestamp: r.timestamp,
        type: r.type as any,
      }));
    } catch {
      return null;
    }
  },

  async saveActivityLog(log: ActivityLog): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const payload = {
        id: log.id,
        actor_name: log.actorName,
        actor_role: log.actorRole,
        action: log.action,
        target: log.target,
        type: log.type,
        timestamp: log.timestamp,
      };
      const { error } = await supabase.from('activity_logs').insert(payload);
      return !error;
    } catch {
      return false;
    }
  },
};

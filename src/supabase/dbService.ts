import { supabase, isSupabaseConfigured } from './client';
import { Product, Organization, Order, BloodDonor, BloodRequest, ProductDemandRequest, UserProfile } from '../types';

/**
 * MediStock Supabase Database Service
 * Provides bidirectional synchronization with Supabase PostgreSQL tables.
 * When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided in .env,
 * this service queries and persists directly to Supabase cloud.
 */

export const dbService = {
  isLive: isSupabaseConfigured,

  // 1. Fetch Products
  async fetchProducts(): Promise<Product[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) {
        console.warn('Supabase fetchProducts error:', error.message);
        return null;
      }

      if (data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          sku: row.sku,
          category: row.category_name,
          manufacturer: row.manufacturer,
          unit: row.unit,
          price: Number(row.price),
          stock: Number(row.stock),
          minStockThreshold: Number(row.min_stock_threshold || 20),
          isPrescriptionRequired: Boolean(row.is_prescription_required),
          isActive: Boolean(row.is_active),
          batchNumber: row.batch_number,
          expiryDate: row.expiry_date,
          description: row.description,
          image: row.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
        }));
      }
      return null;
    } catch (err) {
      console.warn('Supabase connection error in fetchProducts:', err);
      return null;
    }
  },

  // 2. Fetch Organizations
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

      if (data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          type: row.type,
          representative: row.representative,
          email: row.email,
          phone: row.phone,
          address: row.address,
          city: row.city,
          verificationStatus: row.verification_status,
          rejectionReason: row.rejection_reason,
          documents: [],
          totalOrders: 0,
          pendingOrders: 0,
          totalSpent: 0,
          createdAt: row.created_at ? row.created_at.split('T')[0] : '2025-01-01',
        }));
      }
      return null;
    } catch (err) {
      console.warn('Supabase error in fetchOrganizations:', err);
      return null;
    }
  },

  // 3. Fetch Orders
  async fetchOrders(): Promise<Order[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetchOrders error:', error.message);
        return null;
      }

      if (data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          organizationId: row.organization_id,
          organizationName: row.organization_name,
          organizationAddress: row.organization_address || 'Dhaka, Bangladesh',
          organizationPhone: row.organization_phone || '+880 1711 000000',
          organizationEmail: row.organization_email || 'info@organization.com',
          items: (row.order_items || []).map((item: any) => ({
            productId: item.product_id,
            productName: item.product_name,
            unit: item.unit || 'Box',
            quantity: Number(item.quantity),
            unitPrice: Number(item.unit_price),
            total: Number(item.total || item.subtotal || (item.quantity * item.unit_price)),
            batchNumber: item.batch_number,
          })),
          subtotal: Number(row.subtotal),
          tax: Number(row.tax || 0),
          total: Number(row.total),
          status: row.status,
          date: row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Apr 24, 2025',
          timeline: [
            {
              status: row.status,
              timestamp: row.created_at ? new Date(row.created_at).toLocaleString() : 'Just now',
              note: `Order ${row.status}`,
            },
          ],
        }));
      }
      return null;
    } catch (err) {
      console.warn('Supabase error in fetchOrders:', err);
      return null;
    }
  },

  // 4. Save new Order to Supabase
  async saveOrder(order: Order): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const isOrderUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(order.id);
      const isOrgUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(order.organizationId);

      const orderPayload: any = {
        organization_name: order.organizationName,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: order.status,
      };
      if (isOrderUUID) orderPayload.id = order.id;
      if (isOrgUUID) orderPayload.organization_id = order.organizationId;

      const { data: insertedOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) {
        console.warn('Supabase saveOrder notice (using persistent local storage fallback):', orderError.message);
        return false;
      }

      const activeOrderId = insertedOrder?.id || (isOrderUUID ? order.id : null);

      if (activeOrderId && order.items && order.items.length > 0) {
        const itemRows = order.items.map(item => {
          const isItemProdUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.productId);
          const row: any = {
            order_id: activeOrderId,
            product_name: item.productName,
            unit: item.unit || 'Box',
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total: item.total,
            batch_number: item.batchNumber || 'BATCH-GEN',
          };
          if (isItemProdUUID) row.product_id = item.productId;
          return row;
        });
        await supabase.from('order_items').insert(itemRows);
      }

      return true;
    } catch (err) {
      console.warn('Supabase saveOrder exception:', err);
      return false;
    }
  },

  // 5. Save new Organization Registration to Supabase
  async saveOrganization(org: Organization): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(org.id);
      const payload: any = {
        name: org.name,
        type: org.type,
        representative: org.representative,
        email: org.email,
        phone: org.phone,
        address: org.address,
        city: org.city,
        verification_status: org.verificationStatus,
      };
      if (isUUID) payload.id = org.id;

      let { error } = await supabase.from('organizations').upsert(payload, { onConflict: 'email' });
      if (error) {
        const res = await supabase.from('organizations').insert(payload);
        error = res.error;
      }

      if (error) {
        console.warn('Supabase saveOrganization notice (using persistent local storage fallback):', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveOrganization exception:', err);
      return false;
    }
  },

  // 5b. Verify Organization in Supabase
  async verifyOrganizationInDb(orgId: string, status: string, reason?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('organizations').update({
        verification_status: status,
        rejection_reason: reason || null,
        updated_at: new Date().toISOString(),
      }).eq('id', orgId);
      return !error;
    } catch {
      return false;
    }
  },

  // 6. Fetch Blood Requests from Supabase
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

      if (data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          requesterId: row.requester_id || 'guest',
          requesterName: row.requester_name,
          requesterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          bloodGroup: row.blood_group,
          hospital: row.hospital,
          location: row.location,
          unitsNeeded: Number(row.units_needed || 1),
          dateNeeded: row.date_needed || new Date().toISOString().split('T')[0],
          contactPhone: row.contact_phone,
          urgency: row.urgency === 'Critical' ? 'Critical' : (row.urgency === 'Urgent' ? 'Urgent' : 'Normal'),
          notes: row.notes || '',
          status: row.status === 'Fulfilled' ? 'Fulfilled' : (row.status === 'Cancelled' ? 'Cancelled' : 'Open'),
          createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        }));
      }
      return null;
    } catch (err) {
      console.warn('Supabase error in fetchBloodRequests:', err);
      return null;
    }
  },

  // 6b. Save Blood Request to Supabase
  async saveBloodRequest(req: BloodRequest): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.id);
      const payload: any = {
        requester_name: req.requesterName,
        blood_group: req.bloodGroup,
        hospital: req.hospital,
        location: req.location,
        units_needed: req.unitsNeeded,
        date_needed: req.dateNeeded,
        contact_phone: req.contactPhone,
        urgency: req.urgency === 'Critical' ? 'Critical' : (req.urgency === 'Urgent' ? 'Urgent' : 'Normal'),
        notes: req.notes,
        status: req.status === 'Fulfilled' ? 'Fulfilled' : (req.status === 'Cancelled' ? 'Cancelled' : 'Open'),
      };
      if (isUUID) {
        payload.id = req.id;
      }
      if (req.requesterId && req.requesterId !== 'guest' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.requesterId)) {
        payload.requester_id = req.requesterId;
      }

      let { error } = await supabase.from('blood_requests').upsert(payload);

      // If foreign key constraint failed because profiles table doesn't have requester_id, retry without it
      if (error && (error.code === '23503' || error.message.includes('foreign key'))) {
        delete payload.requester_id;
        const retry = await supabase.from('blood_requests').upsert(payload);
        error = retry.error;
      }

      if (error) {
        console.warn('Failed to insert blood request into Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveBloodRequest exception:', err);
      return false;
    }
  },

  // Delete Blood Request from Supabase
  async deleteBloodRequest(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('blood_requests').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // Clear All Blood Requests from Supabase
  async clearAllBloodRequests(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('blood_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      return !error;
    } catch {
      return false;
    }
  },

  // 6c. Fetch Blood Donors from Supabase
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

      if (data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          userId: row.user_id || undefined,
          name: row.name,
          email: row.email,
          phone: row.phone,
          avatar: row.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          bloodGroup: row.blood_group,
          location: row.location,
          isAvailable: Boolean(row.is_available),
          lastDonationDate: row.last_donation_date || new Date().toISOString().split('T')[0],
          notes: '',
          createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        }));
      }
      return null;
    } catch (err) {
      console.warn('Supabase error in fetchBloodDonors:', err);
      return null;
    }
  },

  // 6d. Save Blood Donor to Supabase
  async saveBloodDonor(donor: BloodDonor): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(donor.id);
      const payload: any = {
        name: donor.name,
        email: donor.email || 'donor@medistock.com',
        phone: donor.phone,
        blood_group: donor.bloodGroup,
        location: donor.location,
        is_available: donor.isAvailable,
        avatar_url: donor.avatar,
      };
      if (isUUID) {
        payload.id = donor.id;
      }
      if (donor.userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(donor.userId)) {
        payload.user_id = donor.userId;
      }
      let { error } = await supabase.from('blood_donors').upsert(payload);

      // If foreign key constraint failed because profiles table doesn't have user_id, retry without it
      if (error && (error.code === '23503' || error.message.includes('foreign key'))) {
        delete payload.user_id;
        const retry = await supabase.from('blood_donors').upsert(payload);
        error = retry.error;
      }

      if (error) {
        console.warn('Failed to upsert blood donor to Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveBloodDonor exception:', err);
      return false;
    }
  },

  // 6e. Delete Blood Donor from Supabase
  async deleteBloodDonor(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        const { error } = await supabase.from('blood_donors').delete().eq('id', id);
        return !error;
      } else {
        const { error } = await supabase.from('blood_donors').delete().eq('phone', id);
        return !error;
      }
    } catch {
      return false;
    }
  },

  // 6f. Clear All Blood Donors from Supabase
  async clearAllBloodDonors(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('blood_donors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      return !error;
    } catch {
      return false;
    }
  },

  // Save or Update Product in Supabase
  async saveProduct(product: Product): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(product.id);
      const payload: any = {
        name: product.name,
        sku: product.sku,
        category_name: product.category,
        manufacturer: product.manufacturer,
        unit: product.unit,
        price: product.price,
        stock: product.stock,
        min_stock_threshold: product.minStockThreshold,
        is_prescription_required: product.isPrescriptionRequired,
        is_active: product.isActive,
        batch_number: product.batchNumber,
        expiry_date: product.expiryDate,
        description: product.description,
        image_url: product.image,
      };
      if (isUUID) {
        payload.id = product.id;
      }
      const { error } = await supabase.from('products').upsert(payload, { onConflict: 'sku' });
      if (error) {
        console.warn('Supabase saveProduct notice (using persistent local storage fallback):', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveProduct exception:', err);
      return false;
    }
  },

  // Delete Product from Supabase
  async deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUUID) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        return !error;
      } else {
        const { error } = await supabase.from('products').delete().eq('sku', id);
        return !error;
      }
    } catch {
      return false;
    }
  },

  // Delete User from Supabase
  async deleteUser(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // 7. Fetch Profiles from Supabase
  async fetchProfiles(): Promise<UserProfile[] | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.warn('Supabase fetchProfiles error:', error.message);
        return null;
      }

      if (data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.full_name || row.email?.split('@')[0] || 'User',
          email: row.email,
          avatar: row.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          role: (row.role || 'normal_user') as any,
          status: 'active' as const,
          phone: row.phone || undefined,
          createdAt: row.created_at ? row.created_at.split('T')[0] : '2025-01-01',
        }));
      }
      return null;
    } catch (err) {
      console.warn('Supabase error in fetchProfiles:', err);
      return null;
    }
  },

  // 7b. Update User Profile in Supabase
  async updateUserProfile(user: UserProfile): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
      const payload: any = {
        email: user.email,
        full_name: user.name,
        avatar_url: user.avatar,
        role: user.role,
        phone: user.phone || null,
        updated_at: new Date().toISOString(),
      };
      if (isUUID) payload.id = user.id;

      let { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'email' });
      if (error) {
        const res = await supabase.from('profiles').insert(payload);
        error = res.error;
      }
      if (error) {
        console.warn('Supabase updateUserProfile notice:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase updateUserProfile exception:', err);
      return false;
    }
  },

  // 7c. Update User Role in Supabase
  async updateUserRoleInDb(userId: string, role: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
      let query = isUUID 
        ? supabase.from('profiles').update({ role, updated_at: new Date().toISOString() }).eq('id', userId)
        : supabase.from('profiles').update({ role, updated_at: new Date().toISOString() }).eq('email', userId);
      const { error } = await query;
      return !error;
    } catch {
      return false;
    }
  },

  // 8. Update Password in Supabase
  async updatePassword(password: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        console.warn('Supabase updatePassword notice:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase updatePassword exception:', err);
      return false;
    }
  },
};

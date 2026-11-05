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
      const { error: orderError } = await supabase.from('orders').insert({
        id: order.id,
        organization_id: order.organizationId,
        organization_name: order.organizationName,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: order.status,
      });

      if (orderError) {
        console.warn('Failed to insert order into Supabase:', orderError.message);
        return false;
      }

      if (order.items && order.items.length > 0) {
        const itemRows = order.items.map(item => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          unit: item.unit || 'Box',
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total,
          batch_number: item.batchNumber || 'BATCH-GEN',
        }));
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
      const { error } = await supabase.from('organizations').insert({
        id: org.id,
        name: org.name,
        type: org.type,
        representative: org.representative,
        email: org.email,
        phone: org.phone,
        address: org.address,
        city: org.city,
        verification_status: org.verificationStatus,
      });

      if (error) {
        console.warn('Failed to insert org into Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Supabase saveOrganization exception:', err);
      return false;
    }
  },

  // 6. Save Blood Request to Supabase
  async saveBloodRequest(req: BloodRequest): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('blood_requests').insert({
        id: req.id,
        requester_name: req.requesterName,
        blood_group: req.bloodGroup,
        hospital: req.hospital,
        location: req.location,
        units_needed: req.unitsNeeded,
        date_needed: req.dateNeeded,
        contact_phone: req.contactPhone,
        urgency: req.urgency,
        notes: req.notes,
        status: req.status,
      });

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
      const { error } = await supabase.from('blood_requests').delete().neq('id', '');
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

  // 7. Update User Profile in Supabase
  async updateUserProfile(user: UserProfile): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.name,
        avatar_url: user.avatar,
        phone: user.phone || null,
        updated_at: new Date().toISOString(),
      });
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

export type UserRole = 'normal_user' | 'organization' | 'admin' | 'owner';

export interface UserSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  twoFactor: boolean;
  orderDispatchAlerts: boolean;
  theme?: 'light' | 'dark';
}

export interface UserNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'system' | 'blood' | 'stock' | 'security' | 'order';
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: UserRole;
  status: 'active' | 'suspended';
  phone?: string;
  bloodGroup?: string;
  city?: string;
  address?: string;
  settings?: UserSettings;
  organizationId?: string;
  createdAt: string;
}

export type OrganizationType = 'Hospital' | 'Pharmacy' | 'Clinic';

export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface OrganizationDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  size?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  representative: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  documents: OrganizationDocument[];
  totalOrders: number;
  pendingOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description?: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  manufacturer: string;
  unit: string;
  price: number; // in BDT ৳
  stock: number;
  minStockThreshold: number;
  isPrescriptionRequired: boolean;
  isActive: boolean;
  batchNumber: string;
  expiryDate: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  batchNumber?: string;
}

export interface OrderTimelineStep {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string; // e.g. #ORD-0124
  organizationId: string;
  organizationName: string;
  organizationAddress: string;
  organizationPhone: string;
  organizationEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  date: string;
  timeline: OrderTimelineStep[];
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodDonor {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  bloodGroup: BloodGroup;
  location: string;
  isAvailable: boolean;
  lastDonationDate?: string;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  bloodGroup: BloodGroup;
  hospital: string;
  location: string;
  unitsNeeded: number;
  dateNeeded: string;
  contactPhone: string;
  urgency: 'Normal' | 'Urgent' | 'Critical';
  notes: string;
  status: 'Open' | 'Fulfilled' | 'Cancelled';
  createdAt: string;
}

export interface ProductDemandRequest {
  id: string;
  organizationId: string;
  organizationName: string;
  itemName: string;
  requestedQuantity: number;
  explanation: string;
  status: 'Under Review' | 'Approved' | 'Rejected';
  adminNotes?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'order' | 'product' | 'organization' | 'user' | 'system';
}

export interface NotificationItem {
  id: string;
  recipientRole: UserRole | 'all';
  recipientId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'alert' | 'blood' | 'approval';
}


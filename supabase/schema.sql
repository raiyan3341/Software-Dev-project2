-- ==============================================================================
-- MediStock: Healthcare Supply & Inventory Management Platform
-- PostgreSQL Database Schema & Row Level Security (RLS) for Supabase
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum
CREATE TYPE user_role_enum AS ENUM ('normal_user', 'organization', 'admin', 'owner');
CREATE TYPE org_type_enum AS ENUM ('Hospital', 'Pharmacy', 'Clinic');
CREATE TYPE verification_status_enum AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE order_status_enum AS ENUM ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE urgency_enum AS ENUM ('Normal', 'Urgent', 'Critical');

-- 3. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role_enum DEFAULT 'normal_user' NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    phone TEXT,
    organization_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type org_type_enum NOT NULL,
    representative TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    verification_status verification_status_enum DEFAULT 'Pending' NOT NULL,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add foreign key back to profiles
ALTER TABLE public.profiles 
    ADD CONSTRAINT fk_profiles_org 
    FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

-- 5. Organization Documents Table
CREATE TABLE IF NOT EXISTS public.organization_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon_name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    unit TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock_threshold INTEGER NOT NULL DEFAULT 20 CHECK (min_stock_threshold >= 0),
    is_prescription_required BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    batch_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. '#ORD-0124'
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    organization_name TEXT NOT NULL,
    organization_address TEXT NOT NULL,
    organization_phone TEXT NOT NULL,
    organization_email TEXT NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    tax NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    status order_status_enum DEFAULT 'Pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    batch_number TEXT
);

-- 10. Order Timeline Table
CREATE TABLE IF NOT EXISTS public.order_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status order_status_enum NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    note TEXT
);

-- 11. Blood Donors Table
CREATE TABLE IF NOT EXISTS public.blood_donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    avatar_url TEXT,
    blood_group blood_group_enum NOT NULL,
    location TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    last_donation_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. Blood Requests Table
CREATE TABLE IF NOT EXISTS public.blood_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    requester_name TEXT NOT NULL,
    blood_group blood_group_enum NOT NULL,
    hospital TEXT NOT NULL,
    location TEXT NOT NULL,
    units_needed INTEGER NOT NULL DEFAULT 1 CHECK (units_needed > 0),
    date_needed DATE NOT NULL,
    contact_phone TEXT NOT NULL,
    urgency urgency_enum DEFAULT 'Urgent' NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Fulfilled', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. Product Demand Requests Table
CREATE TABLE IF NOT EXISTS public.product_demand_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    item_name TEXT NOT NULL,
    requested_quantity INTEGER NOT NULL CHECK (requested_quantity > 0),
    explanation TEXT NOT NULL,
    status TEXT DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'Approved', 'Rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. Activity Audit Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_demand_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile; Admin/Owner can read all
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products & Categories: Anyone can read active items; Only Admin/Owner can modify
CREATE POLICY "Anyone can browse active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can browse active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);

-- Organizations: Approved orgs can view their own; Admins/Owners view all
CREATE POLICY "Organizations can view own data" ON public.organizations FOR SELECT USING (
    id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);
CREATE POLICY "Admins can manage organizations" ON public.organizations FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);

-- Orders: Organizations can view their own orders; Admins/Owners view all
CREATE POLICY "Organizations can view own orders" ON public.orders FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);
CREATE POLICY "Approved orgs can insert orders" ON public.orders FOR INSERT WITH CHECK (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid()) AND
    EXISTS (SELECT 1 FROM public.organizations WHERE id = organization_id AND verification_status = 'Approved')
);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);

-- Blood Donors: Anyone can search available donors; Donors can update their own availability
CREATE POLICY "Anyone can search donors" ON public.blood_donors FOR SELECT USING (is_available = true);
CREATE POLICY "Users can manage own donor profile" ON public.blood_donors FOR ALL USING (
    user_id = auth.uid() OR user_id IS NULL
);

-- Blood Requests: Anyone can read open requests; Registered users can create
CREATE POLICY "Anyone can view blood requests" ON public.blood_requests FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create blood requests" ON public.blood_requests FOR INSERT WITH CHECK (true);

-- Activity Logs: Only Admin and Owner can view
CREATE POLICY "Admins and Owners can view activity logs" ON public.activity_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);

-- ==============================================================================
-- INITIAL SEED DATA (Matching Project.png)
-- ==============================================================================

-- Categories Seed
INSERT INTO public.categories (name, slug, icon_name, description) VALUES
('Cold & Cough', 'cold-cough', 'Wind', 'Medicines for relief from cold, cough, and sore throat'),
('Gastric & Digestive', 'gastric-digestive', 'Flame', 'Antacids and digestive solutions'),
('Blood Pressure', 'blood-pressure', 'Activity', 'Cardiovascular support medications'),
('Diabetes', 'diabetes', 'HeartPulse', 'Insulin and blood glucose management'),
('First Aid', 'first-aid', 'Cross', 'Bandages and emergency wound care'),
('Creams & Ointments', 'creams-ointments', 'Sparkles', 'Dermatological and antiseptic creams'),
('Syrups & Liquids', 'syrups', 'FlaskConical', 'Oral liquid therapeutic preparations'),
('Tablets & Capsules', 'tablets-capsules', 'Pill', 'Solid dosage pharmaceutical medications'),
('Masks & PPE', 'masks', 'Shield', 'Protective respiratory equipment'),
('Thermometers', 'thermometers', 'Thermometer', 'Clinical temperature monitoring devices'),
('Gloves', 'gloves', 'Hand', 'Clinical nitrile and latex gloves'),
('Medical Equipment', 'medical-equipment', 'Stethoscope', 'Diagnostic monitors and equipment'),
('Hygiene Supplies', 'hygiene-supplies', 'Droplets', 'Hospital antiseptics and sanitizers'),
('Other Supplies', 'other-supplies', 'Box', 'Surgical disposables')
ON CONFLICT (slug) DO NOTHING;

-- Products Seed matching Project.png Screen 2
INSERT INTO public.products (name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES
('Paracetamol 500mg Tablets (10 pcs)', 'MED-PAR-500', 'Cold & Cough', 'Square Pharmaceuticals PLC', '1 Strip (10 Tablets)', 25.00, 450, 50, false, true, 'BT-2025-081', '2027-08-30', 'Fast acting fever reducer and pain reliever.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'),
('N95 Mask (1 pc)', 'PPE-MSK-N95', 'Masks & PPE', 'MediShield Health Ltd.', '1 Piece', 45.00, 820, 100, false, true, 'N95-2025-04', '2029-12-31', 'Certified 5-layer filtration N95 respirator mask.', 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=500&auto=format&fit=crop&q=80'),
('Vitamin C Syrup (100ml)', 'SUP-VITC-100', 'Syrups & Liquids', 'Beximco Pharma', '1 Bottle (100ml)', 120.00, 140, 30, false, true, 'VTC-2025-11', '2026-10-15', 'High potency Vitamin C ascorbic acid syrup.', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=80'),
('Digital Thermometer (1 pc)', 'DEV-THM-DIG', 'Thermometers', 'Omron Healthcare', '1 Unit', 350.00, 95, 15, false, true, 'THM-2025-OM', '2030-01-01', '10-second precision digital clinical thermometer.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80')
ON CONFLICT (sku) DO NOTHING;


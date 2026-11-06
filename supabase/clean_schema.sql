-- ==============================================================================
-- MediStock: Complete Clean PostgreSQL Schema & Seed Data
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. DROP ALL OLD TABLES (CLEAN SLATE)
DROP TABLE IF EXISTS public.order_timeline CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.organization_documents CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.product_demand_requests CASCADE;
DROP TABLE IF EXISTS public.blood_donors CASCADE;
DROP TABLE IF EXISTS public.blood_requests CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CREATE FRESH ROBUST TABLES (TEXT IDs - 100% RELIABLE)

CREATE TABLE public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password TEXT DEFAULT 'password123',
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  role TEXT NOT NULL DEFAULT 'normal_user',
  organization_id TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT,
  icon_name TEXT,
  description TEXT,
  item_count INTEGER DEFAULT 0
);

CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category_name TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  unit TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock_threshold INTEGER NOT NULL DEFAULT 20,
  is_prescription_required BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  batch_number TEXT,
  expiry_date TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.organizations (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  representative TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'Pending',
  rejection_reason TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  total_orders INTEGER DEFAULT 0,
  pending_orders INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  organization_name TEXT NOT NULL,
  organization_address TEXT,
  organization_phone TEXT,
  organization_email TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending',
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.blood_requests (
  id TEXT PRIMARY KEY,
  requester_id TEXT,
  requester_name TEXT NOT NULL,
  requester_avatar TEXT,
  blood_group TEXT NOT NULL,
  hospital TEXT NOT NULL,
  location TEXT NOT NULL,
  units_needed INTEGER NOT NULL DEFAULT 1,
  date_needed TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'Normal',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Open',
  accepted_by_id TEXT,
  accepted_by_name TEXT,
  accepted_by_phone TEXT,
  accepted_at TEXT,
  donor_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.blood_donors (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  blood_group TEXT NOT NULL,
  location TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  last_donation_date TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.product_demand_requests (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  item_name TEXT NOT NULL,
  requested_quantity INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Under Review',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.activity_logs (
  id TEXT PRIMARY KEY,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system',
  timestamp TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DISABLE RLS ON ALL TABLES FOR SEAMLESS REAL-TIME CLOUD OPERATION
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_donors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_demand_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs DISABLE ROW LEVEL SECURITY;

-- Fallback permissive policies in case RLS is ever enabled
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public full access %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public full access %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
    END LOOP;
END $$;

-- 4. ENABLE REALTIME ON ALL TABLES
DO $$
BEGIN
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles; EXCEPTION WHEN duplicate_object THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.categories; EXCEPTION WHEN duplicate_object THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.products; EXCEPTION WHEN duplicate_object THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.organizations; EXCEPTION WHEN duplicate_object THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.orders; EXCEPTION WHEN duplicate_object THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests; EXCEPTION WHEN duplicate_object THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_donors; EXCEPTION WHEN duplicate_object THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.product_demand_requests; EXCEPTION WHEN duplicate_object THEN END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs; EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- 5. SEED INITIAL DEFAULT USERS
INSERT INTO public.profiles (id, email, full_name, password, avatar_url, role, status, phone) VALUES
('user-owner-1', 'owner@medistock.com', 'Platform Owner', 'owner123', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80', 'owner', 'active', '+880 1711 000001'),
('user-admin-1', 'admin@medistock.com', 'Admin Panel Staff', 'admin123', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80', 'admin', 'active', '+880 1711 000002'),
('user-normal-1', 'rahim.ahmed@example.com', 'Rahim Ahmed', 'user123', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80', 'normal_user', 'active', '+880 1718 223344'),
('user-org-1', 'cityhospital@health.com', 'City Hospital Admin', 'hospital123', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80', 'organization', 'active', '+880 1712 345678'),
('user-org-2', 'tanvir@pharmaplus.com.bd', 'Pharma Plus Representative', 'pharma123', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', 'organization', 'active', '+880 1819 876543')
ON CONFLICT (email) DO NOTHING;

-- 6. SEED INITIAL ORGANIZATIONS
INSERT INTO public.organizations (id, user_id, name, type, representative, email, phone, address, city, verification_status, total_orders, pending_orders, total_spent) VALUES
('org-city-hospital', 'user-org-1', 'City General Hospital', 'Hospital', 'City Hospital Admin', 'cityhospital@health.com', '+880 1712 345678', 'Mirpur Road, Dhanmondi, Dhaka', 'Dhaka', 'Approved', 12, 1, 48500),
('org-pharma-plus', 'user-org-2', 'Pharma Plus Ltd.', 'Pharmacy', 'Tanvir Hossain', 'tanvir@pharmaplus.com.bd', '+880 1819 876543', 'Station Road, Chittagong', 'Chittagong', 'Approved', 8, 0, 31200)
ON CONFLICT (id) DO NOTHING;

-- 7. SEED INITIAL CATEGORIES
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-1', 'Cold & Cough', 'cold-cough', 'Wind', 3, 'Medicines for relief from cold, flu, cough, and sore throat') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-2', 'Gastric & Digestive', 'gastric-digestive', 'Flame', 3, 'Antacids, PPIs, and digestive health solutions') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-3', 'Blood Pressure', 'blood-pressure', 'Activity', 3, 'Cardiovascular support and hypertension medicines') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-4', 'Diabetes', 'diabetes', 'HeartPulse', 3, 'Insulin, test strips, and blood glucose care supplies') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-5', 'First Aid', 'first-aid', 'PlusSquare', 3, 'Bandages, antiseptics, and emergency wound care') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-6', 'Creams & Ointments', 'creams-ointments', 'Sparkles', 3, 'Topical antiseptics, antibiotics, and dermatological creams') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-7', 'Syrups & Liquids', 'syrups', 'FlaskConical', 3, 'Pediatric and adult oral therapeutic liquid solutions') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-8', 'Tablets & Capsules', 'tablets-capsules', 'Pill', 3, 'Essential oral solid dosage medications') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-9', 'Masks & PPE', 'masks', 'Shield', 3, 'Surgical 3-ply, N95, KN95 and face shields') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-10', 'Thermometers', 'thermometers', 'Thermometer', 3, 'Digital, infrared, and mercury-free medical thermometers') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-11', 'Gloves', 'gloves', 'Hand', 3, 'Nitrile, latex, and vinyl clinical examination gloves') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-12', 'Medical Equipment', 'medical-equipment', 'Stethoscope', 3, 'BP monitors, nebulizers, oxygen concentrators, pulse oximeters') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-13', 'Hygiene Supplies', 'hygiene-supplies', 'Droplets', 3, 'Hospital grade sanitizers, disinfectants, and surface wipes') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;
INSERT INTO public.categories (id, name, slug, icon_name, item_count, description) VALUES ('cat-14', 'Other Supplies', 'other-supplies', 'Box', 3, 'Cannulas, IV infusion sets, surgical tape, and disposables') ON CONFLICT (name) DO UPDATE SET item_count = EXCLUDED.item_count;

-- 8. SEED ALL 42 INITIAL MEDICAL PRODUCTS
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-cc-1', 'Napa Extra 500mg/65mg Tablets (10 pcs)', 'MED-NAP-EXT', 'Cold & Cough', 'Beximco Pharma', '1 Strip (10 Tablets)', 35, 450, 50, false, true, 'NP-2025-081', '2028-06-30', 'Fast acting paracetamol and caffeine formulation for fast relief from severe headache, fever, cold, flu, and body ache.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-cc-2', 'Fexo 120mg Fexofenadine Tablets (10 pcs)', 'MED-FEX-120', 'Cold & Cough', 'Square Pharmaceuticals PLC', '1 Strip (10 Tablets)', 90, 280, 30, false, true, 'FX-2025-12', '2027-11-20', 'Non-drowsy 24-hour allergy relief antihistamine for runny nose, sneezing, itchy throat, and watery eyes.', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-cc-3', 'Tusca Cough Expectorant Syrup (100ml)', 'MED-TUS-100', 'Cold & Cough', 'Square Pharmaceuticals PLC', '1 Bottle (100ml)', 85, 190, 25, false, true, 'TS-2025-04', '2027-04-15', 'Effective soothing formula for productive cough, chest congestion, bronchial irritation, and respiratory tract discomfort.', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-gd-1', 'Seclo 20mg Omeprazole Capsules (14 pcs)', 'MED-SEC-020', 'Gastric & Digestive', 'Square Pharmaceuticals PLC', '1 Strip (14 Capsules)', 70, 520, 60, true, true, 'SC-992-01', '2027-09-30', 'Gold standard proton pump inhibitor for gastric acidity, heartburn, gastroesophageal reflux disease (GERD), and peptic ulcers.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-gd-2', 'Gaviscon Double Action Liquid Suspension (200ml)', 'MED-GAV-200', 'Gastric & Digestive', 'Reckitt Benckiser Healthcare', '1 Bottle (200ml)', 320, 110, 20, false, true, 'GV-2025-09', '2027-12-10', 'Fast dual relief from heartburn and indigestion by forming a protective raft barrier over stomach contents within seconds.', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-gd-3', 'Entacyd Plus Chewable Antacid Tablets (10 pcs)', 'MED-ENT-010', 'Gastric & Digestive', 'Square Pharmaceuticals PLC', '1 Strip (10 Tablets)', 30, 350, 40, false, true, 'ET-2025-05', '2028-02-14', 'Rapid neutralizing mint-flavored chewable antacids containing aluminum hydroxide and magnesium hydroxide for quick burning relief.', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-bp-1', 'Amlopin 5mg Amlodipine Tablets (10 pcs)', 'MED-AML-005', 'Blood Pressure', 'Square Pharmaceuticals PLC', '1 Strip (10 Tablets)', 60, 400, 40, true, true, 'AM-2025-01', '2027-10-25', 'Calcium channel blocker prescribed for the management of high blood pressure (hypertension) and chronic stable angina.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-bp-2', 'Osartil 50mg Losartan Potassium (10 pcs)', 'MED-OSA-050', 'Blood Pressure', 'Incepta Pharmaceuticals', '1 Strip (10 Tablets)', 110, 310, 35, true, true, 'OS-2025-77', '2028-01-15', 'Angiotensin II receptor antagonist used to lower blood pressure, protect kidneys in diabetic patients, and reduce stroke risk.', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-bp-3', 'Bislol 2.5mg Bisoprolol Fumarate (10 pcs)', 'MED-BIS-025', 'Blood Pressure', 'Beximco Pharma', '1 Strip (10 Tablets)', 85, 230, 25, true, true, 'BS-2025-03', '2027-08-10', 'Cardioselective beta-1 adrenergic blocker used in hypertension and steady cardiovascular pulse control.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-db-1', 'Accu-Chek Instant Blood Glucose Meter Kit', 'DEV-GLU-ACC', 'Diabetes', 'Roche Diabetes Care', '1 Complete Kit', 2200, 45, 10, false, true, 'AC-88102', '2031-12-31', 'Medical grade wireless blood glucose monitoring system with target range indicator and instant 4-second measurement.', 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-db-2', 'GlucoLeader Blood Glucose Test Strips (50 pcs)', 'DEV-STP-GLU50', 'Diabetes', 'HMD Biomedical', '1 Box (50 Strips)', 850, 160, 20, false, true, 'ST-2025-99', '2026-11-30', 'Electrochemical biosensor capillary test strips requiring micro blood sample for high-precision glucose readings.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-db-3', 'Comet 500mg Metformin Hydrochloride (10 pcs)', 'MED-COM-500', 'Diabetes', 'Square Pharmaceuticals PLC', '1 Strip (10 Tablets)', 45, 480, 50, true, true, 'CM-2025-06', '2028-03-25', 'First-line anti-hyperglycemic biguanide medicine for the management of type 2 diabetes mellitus in adult patients.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-fa-1', 'Savlon Antiseptic Disinfectant Liquid (500ml)', 'AID-SAV-500', 'First Aid', 'ACI Limited', '1 Bottle (500ml)', 185, 240, 30, false, true, 'SV-2025-02', '2028-05-15', 'Hospital standard broad-spectrum chlorhexidine and cetrimide antiseptic solution for wounds, minor cuts, and personal sanitization.', 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-fa-2', 'Micropore Surgical Paper Tape 1-inch (Box of 12)', 'AID-MIC-TP12', 'First Aid', '3M Healthcare', '1 Box (12 Rolls)', 360, 95, 15, false, true, '3M-2025-11', '2030-01-01', 'Hypoallergenic, breathable, gentle non-woven surgical tape for securing bandages, dressings, and medical tubing.', 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-fa-3', 'Sterile Gauze Bandage Roll 3-inch (Pack of 12)', 'AID-GAU-ROL12', 'First Aid', 'MediPak Surgical Ltd.', '1 Pack (12 Rolls)', 140, 320, 40, false, true, 'GZ-2025-88', '2029-08-30', '100% pure absorbent bleached cotton medical conforming gauze rolls for emergency trauma and wound dressing.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-co-1', 'Silverene 1% Silver Sulfadiazine Burn Cream (25g)', 'CRM-SIL-025', 'Creams & Ointments', 'Square Pharmaceuticals PLC', '1 Tube (25g)', 65, 210, 25, false, true, 'SL-2025-01', '2027-06-15', 'Topical antibacterial cream essential for burn wound healing and bacterial infection prophylaxis.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-co-2', 'Betnovate-N Skin Ointment (20g)', 'CRM-BET-020', 'Creams & Ointments', 'GlaxoSmithKline (GSK)', '1 Tube (20g)', 85, 175, 20, true, true, 'BT-2025-44', '2027-11-30', 'Combination of betamethasone corticosteroid and neomycin antibiotic for inflammatory eczema, dermatitis, and bacterial skin infections.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-co-3', 'Neosporin Triple Antibiotic First Aid Ointment (15g)', 'CRM-NEO-015', 'Creams & Ointments', 'Johnson & Johnson Healthcare', '1 Tube (15g)', 155, 140, 20, false, true, 'NS-2025-10', '2028-01-20', '24-hour infection protection ointment containing bacitracin, neomycin, and polymyxin B for cuts, scrapes, and minor burns.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-sl-1', 'Vitamin C Ascorbic Acid Syrup (100ml)', 'SUP-VITC-100', 'Syrups & Liquids', 'Beximco Pharma', '1 Bottle (100ml)', 120, 140, 30, false, true, 'VTC-2025-11', '2026-10-15', 'Pleasant orange-flavored high-potency Vitamin C ascorbic acid syrup to boost immunity and tissue repair in kids and adults.', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-sl-2', 'Adovas Herbal Non-Sedating Cough Syrup (100ml)', 'SYR-ADO-100', 'Syrups & Liquids', 'Square Herbal & Nutraceuticals', '1 Bottle (100ml)', 95, 220, 25, false, true, 'AD-2025-88', '2027-09-01', 'Natural herbal formulation containing Adhatoda vasica for soothing irritation, clearing airway mucus, and calming dry cough.', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-sl-3', 'Zincat Multivitamin & Zinc Nutritional Syrup (200ml)', 'SYR-ZIN-200', 'Syrups & Liquids', 'Square Pharmaceuticals PLC', '1 Bottle (200ml)', 135, 190, 25, false, true, 'ZC-2025-02', '2027-05-18', 'Essential therapeutic nutritional syrup rich in zinc sulfate and B-complex vitamins for pediatric recovery and general vitality.', 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-tc-1', 'Zimax 500mg Azithromycin Tablets (3 pcs)', 'MED-ZIM-500', 'Tablets & Capsules', 'Beximco Pharma', '1 Strip (3 Tablets)', 105, 290, 35, true, true, 'ZM-2025-45', '2027-12-31', 'Broad-spectrum macrolide antibiotic for upper and lower respiratory tract infections, pneumonia, and skin bacterial infections.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-tc-2', 'Neoflox 500mg Ciprofloxacin Film Coated (10 pcs)', 'MED-NEO-500', 'Tablets & Capsules', 'Square Pharmaceuticals PLC', '1 Strip (10 Tablets)', 140, 260, 30, true, true, 'NF-2025-09', '2028-04-10', 'Fluoroquinolone antibacterial medication for urinary tract infections (UTI), infectious diarrhea, and bone and joint infections.', 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-tc-3', 'B-50 Forte Vitamin B Complex + Zinc (30 Capsules)', 'MED-B50-030', 'Tablets & Capsules', 'Incepta Pharmaceuticals', '1 Bottle (30 Capsules)', 195, 180, 20, false, true, 'BF-2025-22', '2028-08-15', 'High-potency synergistic therapeutic complex of vitamins B1, B2, B6, B12, and zinc for nerve health, immune strength, and fatigue.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-mp-1', 'N95 Respirator Mask 5-Layer Filtration (1 pc)', 'PPE-MSK-N95', 'Masks & PPE', 'MediShield Health Ltd.', '1 Piece', 45, 820, 100, false, true, 'N95-2025-04', '2029-12-31', 'Certified 5-layer filtration N95 respirator mask with snug nasal seal, filtering >95% airborne particulates, viruses, and pathogens.', 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-mp-2', '3-Ply Medical Disposable Surgical Mask (Box of 50)', 'PPE-MSK-3PLY50', 'Masks & PPE', 'Protec Hygiene Care', '1 Box (50 Pcs)', 150, 640, 80, false, true, 'MS-2025-50', '2030-05-20', 'CE and FDA certified 3-layer melt-blown protective surgical masks with soft elastic earloops and adjustable nose clip.', 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-mp-3', 'Full Face Medical Protective Anti-Fog Shield (1 pc)', 'PPE-FSH-001', 'Masks & PPE', 'SafeVision Clinical', '1 Piece', 80, 220, 30, false, true, 'FS-2025-01', '2032-01-01', 'Ultra-clear PET transparent face shield with forehead foam padding, protecting face, eyes, and mouth from infectious fluid splashes.', 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-th-1', 'Omron Digital Clinical Thermometer with Beep', 'DEV-THM-DIG', 'Thermometers', 'Omron Healthcare', '1 Unit', 350, 95, 15, false, true, 'THM-2025-OM', '2030-01-01', 'Quick 10-second precision oral and axillary digital clinical thermometer with LCD screen and fever notification beep.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-th-2', 'Non-Contact Infrared Forehead Thermometer', 'DEV-THM-IR01', 'Thermometers', 'Berrcom Medical Instruments', '1 Unit', 1650, 40, 10, false, true, 'IR-2025-99', '2032-12-31', 'Instant 1-second non-contact infrared thermal measurement gun with 3-color backlit fever alarm for clinic entry triage.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-th-3', 'Flexible Tip Waterproof Digital Thermometer', 'DEV-THM-FLX', 'Thermometers', 'Microlife Medical', '1 Unit', 220, 120, 20, false, true, 'FX-2025-07', '2031-06-30', 'Gentle soft-flex tip waterproof thermometer safe for pediatric and infant oral and rectal clinical measurement.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-gl-1', 'Medical Blue Nitrile Examination Gloves (Box of 100)', 'PPE-GLV-NT100', 'Gloves', 'Sempermed Protect', '1 Box (100 Pcs)', 550, 210, 25, false, true, 'GLV-2503-A', '2028-09-01', 'Powder-free medical grade blue nitrile examination gloves, textured micro-fingertips for puncture resistance and superior wet grip.', 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-gl-2', 'Latex Sterile Surgical Powder-Free Gloves (50 Pairs)', 'PPE-GLV-LTX50', 'Gloves', 'Ansell Healthcare', '1 Box (50 Pairs)', 750, 130, 20, false, true, 'LX-2025-18', '2029-03-15', 'Gamma sterilized anatomical surgical latex gloves providing optimal tactile sensitivity and barrier protection in operation theatres.', 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-gl-3', 'Clear Vinyl Examination Disposable Gloves (Box of 100)', 'PPE-GLV-VIN100', 'Gloves', 'SafeCare Disposables', '1 Box (100 Pcs)', 380, 260, 30, false, true, 'VN-2025-04', '2029-10-20', 'Cost-effective latex-free transparent synthetic vinyl gloves ideal for clinical sanitation, lab prep, and pharmacy restocking.', 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-me-1', 'Fingertip Pulse Oximeter SpO2 & Heart Rate Monitor', 'DEV-OXI-PUL', 'Medical Equipment', 'Contec Medical Systems', '1 Unit', 850, 75, 15, false, true, 'OX-2025-33', '2031-12-31', 'OLED dual-color display portable pulse oximeter for real-time blood oxygen saturation (SpO2) and pulse rate monitoring.', 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-me-2', 'Omron Ultrasonic Heavy-Duty Compressor Nebulizer Kit', 'DEV-NEB-OMR', 'Medical Equipment', 'Omron Healthcare', '1 Complete Kit', 2850, 35, 10, false, true, 'NB-2025-08', '2032-05-15', 'High efficiency medication aerosol delivery system for asthma, COPD, bronchitis, and acute pediatric breathing distress.', 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-me-3', 'Automatic Upper-Arm Blood Pressure Monitor Kit', 'DEV-BPM-AUTO', 'Medical Equipment', 'Microlife Medical', '1 Kit', 2450, 50, 10, false, true, 'BPM-8812', '2031-12-31', 'Clinically validated upper-arm digital sphygmomanometer with hypertension WHO indicator, memory recall, and irregular heartbeat detector.', 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-hs-1', 'Hexisol Hand Rub 500ml with Dispenser Pump', 'HYG-HEX-500', 'Hygiene Supplies', 'ACI Limited', '1 Bottle (500ml)', 195, 320, 40, false, true, 'HX-2025-05', '2028-04-30', '0.5% w/v chlorhexidine gluconate in 70% ethyl alcohol surgical hand rub for fast surgical scrubbing and infection control.', 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-hs-2', 'Dettol Multi-Surface Hospital Grade Disinfectant Spray (450ml)', 'HYG-DET-450', 'Hygiene Supplies', 'Reckitt Benckiser', '1 Spray Can (450ml)', 340, 140, 20, false, true, 'DT-2025-19', '2027-10-15', 'Kills 99.9% of bacteria, flu viruses, and fungi on clinic tables, door handles, medical stretchers, and hard surfaces.', 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-hs-3', 'Alcohol Prep Swabs 70% Isopropyl (Box of 100 Pcs)', 'HYG-SWB-100', 'Hygiene Supplies', 'MediShield Health Ltd.', '1 Box (100 Swabs)', 120, 410, 50, false, true, 'SW-2025-01', '2029-07-20', 'Individually foil-wrapped 2-ply non-woven antiseptic alcohol swabs for venipuncture, fingersticks, and injection preparation.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-os-1', 'IV Cannula 20G Pink with Injection Port (Box of 50)', 'OTH-CAN-20G50', 'Other Supplies', 'Poly Medicure Surgical Ltd.', '1 Box (50 Pcs)', 850, 110, 20, false, true, 'CN-2025-20', '2030-03-31', 'Sterile radiopaque FEP catheter intravenous cannula with sharp back-bevel needle and one-way injection valve.', 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-os-2', 'Scalp Vein / Butterfly Infusion Set 23G (Pack of 25)', 'OTH-INF-23G25', 'Other Supplies', 'BD Becton Dickinson', '1 Pack (25 Sets)', 350, 160, 25, false, true, 'BF-2025-23', '2029-11-15', 'Sterile winged needle infusion set with flexible kink-resistant tubing and female luer lock connector for smooth blood drawing.', 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;
INSERT INTO public.products (id, name, sku, category_name, manufacturer, unit, price, stock, min_stock_threshold, is_prescription_required, is_active, batch_number, expiry_date, description, image_url) VALUES ('prod-os-3', 'Disposable Syringes with Needle 5ml Luer Lock (Box of 100)', 'OTH-SYR-5ML100', 'Other Supplies', 'Opso Saline Ltd.', '1 Box (100 Pcs)', 480, 220, 30, false, true, 'SY-2025-05', '2030-08-31', 'Pyrogen-free medical grade transparent plastic hypodermic syringe with smooth plunger and clear bold milliliter gradations.', 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80') ON CONFLICT (sku) DO NOTHING;

-- ==============================================================================
-- MediStock: Full Dynamic Permissions & Realtime Enablement Script
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Disable Row Level Security (RLS) on all platform tables
-- This allows all roles (Anonymous visitors, Normal Users, Admins, Owners) 
-- to read, insert, update, and delete in real-time without being blocked by RLS policies.

ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.organization_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_timeline DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blood_donors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blood_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_demand_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.activity_logs DISABLE ROW LEVEL SECURITY;

-- 2. Drop strict foreign key constraints that block client insertions
-- (e.g. inserting a profile without auth.users, or requester_id without profiles row)
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS fk_profiles_org;
ALTER TABLE IF EXISTS public.blood_requests DROP CONSTRAINT IF EXISTS blood_requests_requester_id_fkey;
ALTER TABLE IF EXISTS public.blood_donors DROP CONSTRAINT IF EXISTS blood_donors_user_id_fkey;
ALTER TABLE IF EXISTS public.orders DROP CONSTRAINT IF EXISTS orders_organization_id_fkey;
ALTER TABLE IF EXISTS public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- 3. In case RLS is re-enabled in the future, create permissive fallback policies
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public full access %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Public full access %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
    END LOOP;
END $$;

-- 4. Enable Supabase Realtime Replication for instant multi-user synchronization
-- This allows changes made by one user to immediately reflect on Admin and Owner screens
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    EXCEPTION WHEN duplicate_object THEN END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.organizations;
    EXCEPTION WHEN duplicate_object THEN END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    EXCEPTION WHEN duplicate_object THEN END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    EXCEPTION WHEN duplicate_object THEN END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
    EXCEPTION WHEN duplicate_object THEN END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_donors;
    EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- 5. Insert initial admin and owner profiles if missing
INSERT INTO public.profiles (id, email, full_name, role, status) VALUES
('00000000-0000-0000-0000-000000000001', 'owner@medistock.com', 'MediStock Platform Owner', 'owner', 'active'),
('00000000-0000-0000-0000-000000000002', 'admin@medistock.com', 'Dr. Tariqul Islam', 'admin', 'active')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

-- ==============================================================================
-- PrintXpress - Campus Stationery & Document Printing Platform
-- Supabase PostgreSQL Database Schema & Row Level Security (RLS) Policies
-- ==============================================================================

-- 1. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  department TEXT,
  batch TEXT,
  phone TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  saved_building TEXT,
  saved_floor TEXT,
  saved_classroom TEXT
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles can be viewed by authenticated users" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 2. Products Table (Stationery catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  stock INT NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT false
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" 
ON public.products FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Only admins can modify products" 
ON public.products FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 3. Printing Rates Table
CREATE TABLE IF NOT EXISTS public.print_rates (
  id SERIAL PRIMARY KEY,
  a4_bw NUMERIC(5, 2) NOT NULL DEFAULT 2.00,
  a4_color NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
  a3_bw NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
  a3_color NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
  staple_binding NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
  spiral_binding NUMERIC(5, 2) NOT NULL DEFAULT 35.00,
  hardcover_binding NUMERIC(5, 2) NOT NULL DEFAULT 120.00,
  classroom_delivery_fee NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.print_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view print rates" 
ON public.print_rates FOR SELECT 
TO authenticated, anon 
USING (true);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- e.g. PX-1001
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  stationery_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  printing_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('counter_pickup', 'classroom_delivery')),
  delivery_department TEXT,
  delivery_batch TEXT,
  delivery_building TEXT,
  delivery_floor TEXT,
  delivery_classroom TEXT,
  delivery_instructions TEXT,
  payment_method TEXT NOT NULL DEFAULT 'demo',
  payment_status TEXT NOT NULL DEFAULT 'Paid — Demo',
  status TEXT NOT NULL DEFAULT 'Requested' CHECK (status IN (
    'Requested', 'Processing', 'Printing Complete', 
    'Ready for Pickup', 'On the Way', 'Delivered', 'Collected', 'Cancelled', 'Rejected'
  )),
  estimated_time TEXT NOT NULL DEFAULT '10-15 mins'
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Students can read only their own orders; Admins can read all orders
CREATE POLICY "Students can view their own orders" 
ON public.orders FOR SELECT 
TO authenticated 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Students can insert orders
CREATE POLICY "Authenticated users can create orders" 
ON public.orders FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Admins can update order status
CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('stationery', 'print')),
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INT DEFAULT 1,
  unit_price NUMERIC(10, 2),
  total_price NUMERIC(10, 2) NOT NULL,
  -- Print Job Metadata
  document_name TEXT,
  document_size_bytes BIGINT,
  document_url TEXT,
  color_mode TEXT,
  paper_size TEXT,
  duplex_mode TEXT,
  orientation TEXT,
  page_count INT,
  page_range TEXT,
  binding TEXT,
  operator_notes TEXT
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their order items" 
ON public.order_items FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id AND (
      orders.user_id = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  )
);

-- 6. Storage Bucket for Private Uploaded Documents
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
-- CREATE POLICY "Students can upload their documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
-- CREATE POLICY "Students can access their documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents' AND auth.uid() = owner);
-- CREATE POLICY "Admins can access all documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents' AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

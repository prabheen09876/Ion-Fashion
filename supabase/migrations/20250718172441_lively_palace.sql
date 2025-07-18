/*
  # Create E-commerce Database Schema

  1. New Tables
    - `users` - User profiles with roles (admin/customer)
    - `products` - Product catalog with categories and pricing
    - `customers` - Extended customer information
    - `orders` - Order management
    - `order_items` - Order line items

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Create storage bucket for product images

  3. Features
    - Admin role management
    - Product management with categories
    - Order processing system
    - Secure file storage for product images
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with role management
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  product_type TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table (extending the users table)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  billing_address TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for products table
CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for customers table
CREATE POLICY "Users can read their own customer data"
  ON customers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own customer data"
  ON customers FOR INSERT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own customer data"
  ON customers FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all customer data"
  ON customers FOR SELECT
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for orders table
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  USING (
    auth.uid() = user_id OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- RLS Policies for order_items table
CREATE POLICY "Users can read their own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin')
    )
  );

CREATE POLICY "Users can insert their own order items"
  ON order_items FOR INSERT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Public Access to Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Only admins can insert product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN NEW.raw_user_meta_data->>'isAdmin' = 'true' THEN 'admin'
      ELSE 'customer'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert some sample products
INSERT INTO products (name, category, product_type, price, description, image_url, featured, in_stock) VALUES
('Classic White Shirt', 'Men', 'Shirt', 2999.00, 'Premium cotton white shirt perfect for formal occasions', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', true, true),
('Denim Jacket', 'Women', 'Jacket', 4999.00, 'Stylish denim jacket for casual wear', 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', true, true),
('Black Dress', 'Women', 'Dress', 3999.00, 'Elegant black dress for evening events', 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg', true, true),
('Casual T-Shirt', 'Men', 'T-Shirt', 1299.00, 'Comfortable cotton t-shirt for everyday wear', 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', false, true),
('Summer Dress', 'Women', 'Dress', 2799.00, 'Light and breezy summer dress', 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg', true, true),
('Formal Blazer', 'Men', 'Blazer', 6999.00, 'Professional blazer for business meetings', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', false, true)
ON CONFLICT DO NOTHING;
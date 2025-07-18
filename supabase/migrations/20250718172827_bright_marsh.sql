-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  product_type TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table (extending the auth.users table)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  billing_address TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products
CREATE POLICY "Anyone can read products" 
  ON products FOR SELECT 
  USING (true);

-- Authenticated users can insert/update/delete products (you can restrict this further later)
CREATE POLICY "Authenticated users can insert products" 
  ON products FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
  ON products FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete products" 
  ON products FOR DELETE 
  TO authenticated
  USING (true);

-- Create RLS policies for customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own customer data
CREATE POLICY "Users can read their own customer data" 
  ON customers FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own customer data" 
  ON customers FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own customer data" 
  ON customers FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users can read their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders
CREATE POLICY "Users can update their own orders" 
  ON orders FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can read their own order items
CREATE POLICY "Users can read their own order items" 
  ON order_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Users can insert their own order items
CREATE POLICY "Users can insert their own order items" 
  ON order_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample products
INSERT INTO products (name, category, product_type, price, description, image, featured, in_stock) VALUES
('Classic White Shirt', 'Clothing', 'Shirt', 2999.00, 'A timeless white cotton shirt perfect for any occasion', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', true, true),
('Denim Jacket', 'Clothing', 'Jacket', 4999.00, 'Stylish denim jacket for a casual look', 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', true, true),
('Black Dress', 'Clothing', 'Dress', 3999.00, 'Elegant black dress for evening wear', 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', true, true),
('Sneakers', 'Footwear', 'Shoes', 5999.00, 'Comfortable white sneakers for everyday wear', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', true, true),
('Leather Handbag', 'Accessories', 'Bag', 7999.00, 'Premium leather handbag with multiple compartments', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', true, true),
('Sunglasses', 'Accessories', 'Eyewear', 1999.00, 'Stylish sunglasses with UV protection', 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg', true, true);
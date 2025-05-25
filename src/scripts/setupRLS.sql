-- This script helps set up the initial Row Level Security (RLS) policies
-- Run this in the Supabase SQL Editor

-- Enable RLS on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to read all users
CREATE POLICY "Users can view all user profiles" 
ON users FOR SELECT 
TO authenticated 
USING (true);

-- Create a policy that allows users to update their own profiles
CREATE POLICY "Users can update their own profiles" 
ON users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Create a policy that allows insertion during signup
-- This is needed for the initial admin creation
CREATE POLICY "Allow public insertion for signup" 
ON users FOR INSERT 
TO anon 
WITH CHECK (true);

-- Create a policy that allows admin users to do everything
CREATE POLICY "Admins have full access" 
ON users 
TO authenticated 
USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
) 
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

-- Similarly for the products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for the products table
CREATE POLICY "Anyone can view products" 
ON products FOR SELECT 
USING (true);

-- Only admins can insert, update, delete products
CREATE POLICY "Only admins can insert products" 
ON products FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

CREATE POLICY "Only admins can update products" 
ON products FOR UPDATE 
TO authenticated 
USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

CREATE POLICY "Only admins can delete products" 
ON products FOR DELETE 
TO authenticated 
USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

import { supabase } from '../lib/supabaseClient';

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageUrl?: string; // Alias for image to maintain backward compatibility
  category: string;
  productType?: string;
  featured?: boolean;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  // Map the image field to imageUrl for backward compatibility
  return (data || []).map(product => ({
    ...product,
    imageUrl: product.image
  }));
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(8);
    
  if (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
  
  // Map the image field to imageUrl for backward compatibility
  return (data || []).map(product => ({
    ...product,
    imageUrl: product.image
  }));
};

// Add a new product
export const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...productData }])
    .select();
    
  if (error) {
    console.error('Error adding product:', error);
    throw error;
  }
  
  return data?.[0];
};

// Update a product
export const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
  
  return data?.[0];
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
  
  if (!data) return null;
  
  // Map the image field to imageUrl for backward compatibility
  return {
    ...data,
    imageUrl: data.image
  };
};

// Delete a product
export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
  
  return true;
};
import { supabase } from './supabaseClient';

// Products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  return data;
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createProduct = async (productData: any) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateProduct = async (id: string, productData: any) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
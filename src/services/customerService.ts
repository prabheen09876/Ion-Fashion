import { supabase } from '../lib/supabaseClient';

// Types
export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  created_at: string;
  updated_at: string;
}

// Get all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  return data || [];
};

// Get a single customer by ID
export const getCustomerById = async (id: string): Promise<Customer | null> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
  
  return data;
};

// Create a new customer
export const createCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
  
  return data;
};

// Update a customer
export const updateCustomer = async (id: string, updates: Partial<Omit<Customer, 'id' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
  
  return data;
};

// Delete a customer
export const deleteCustomer = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
  
  return true;
};

// Search customers by name or email
export const searchCustomers = async (query: string): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error searching customers:', error);
    throw error;
  }
  
  return data || [];
};

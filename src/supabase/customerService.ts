import { supabase } from './config';

export interface Customer {
  id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  role: 'admin' | 'customer';
  createdAt?: Date;
  updatedAt?: Date;
  totalOrders?: number; // For display purposes
  totalSpent?: number; // For display purposes
}

// Convert Supabase customer to our Customer interface
const convertCustomer = (user: any, customer: any = null): Customer => {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name || 'Unknown',
    firstName: customer?.first_name || '',
    lastName: customer?.last_name || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    postalCode: customer?.postal_code || '',
    country: customer?.country || 'India',
    role: user.role || 'customer',
    createdAt: user.created_at ? new Date(user.created_at) : undefined,
    updatedAt: user.updated_at ? new Date(user.updated_at) : undefined
  };
};

// Get all customers with order statistics
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    // Get all users with role 'customer'
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'customer');
    
    if (usersError) throw usersError;
    
    // Get customer details
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*');
    
    if (customersError) throw customersError;
    
    // Get order statistics - using a simpler approach to avoid type issues
    const { data: orderStats, error: orderStatsError } = await supabase
      .from('orders')
      .select('user_id, total_amount');
    
    if (orderStatsError) throw orderStatsError;
    
    // Map users to customers with order statistics
    return users.map((user: any) => {
      const customerDetails = customers.find((c: any) => c.id === user.id);
      const userOrders = orderStats.filter((o: any) => o.user_id === user.id);
      
      // Calculate order stats manually
      const totalOrders = userOrders.length;
      const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      
      return {
        ...convertCustomer(user, customerDetails),
        totalOrders,
        totalSpent
      };
    });
  } catch (error) {
    console.error('Error getting customers:', error);
    throw error;
  }
};

// Get customer by ID with order history
export const getCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (userError) {
      if (userError.code === 'PGRST116') return null; // Record not found
      throw userError;
    }
    
    // Get customer details
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (customerError && customerError.code !== 'PGRST116') throw customerError;
    
    // Get order statistics - using a simpler approach to avoid type issues
    const { data: userOrders, error: orderStatsError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('user_id', id);
    
    if (orderStatsError) throw orderStatsError;
    
    // Calculate order stats manually
    const totalOrders = userOrders ? userOrders.length : 0;
    const totalSpent = userOrders ? userOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) : 0;
    
    return {
      ...convertCustomer(user, customer),
      totalOrders,
      totalSpent
    };
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
};

// Update customer details
export const updateCustomer = async (id: string, data: Partial<Customer>): Promise<void> => {
  try {
    // Update user table
    const userUpdate: any = {
      updated_at: new Date().toISOString()
    };
    
    if (data.displayName !== undefined) userUpdate.display_name = data.displayName;
    if (data.email !== undefined) userUpdate.email = data.email;
    if (data.role !== undefined) userUpdate.role = data.role;
    
    if (Object.keys(userUpdate).length > 1) {
      const { error: userError } = await supabase
        .from('users')
        .update(userUpdate)
        .eq('id', id);
      
      if (userError) throw userError;
    }
    
    // Update customer table
    const customerUpdate: any = {
      updated_at: new Date().toISOString()
    };
    
    if (data.firstName !== undefined) customerUpdate.first_name = data.firstName;
    if (data.lastName !== undefined) customerUpdate.last_name = data.lastName;
    if (data.phone !== undefined) customerUpdate.phone = data.phone;
    if (data.address !== undefined) customerUpdate.address = data.address;
    if (data.city !== undefined) customerUpdate.city = data.city;
    if (data.state !== undefined) customerUpdate.state = data.state;
    if (data.postalCode !== undefined) customerUpdate.postal_code = data.postalCode;
    if (data.country !== undefined) customerUpdate.country = data.country;
    
    if (Object.keys(customerUpdate).length > 1) {
      // Check if customer record exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('id', id)
        .single();
      
      if (existingCustomer) {
        // Update existing record
        const { error: customerError } = await supabase
          .from('customers')
          .update(customerUpdate)
          .eq('id', id);
        
        if (customerError) throw customerError;
      } else {
        // Insert new record
        const { error: customerError } = await supabase
          .from('customers')
          .insert([{ id, ...customerUpdate }]);
        
        if (customerError) throw customerError;
      }
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    // Delete customer details first (due to foreign key constraint)
    const { error: customerError } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
    
    if (customerError && customerError.code !== 'PGRST116') throw customerError;
    
    // Delete user
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (userError) throw userError;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

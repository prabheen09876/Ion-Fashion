import { supabase } from '../lib/supabaseClient';

// Products - using Supabase directly
export const getProducts = async (category?: string, productType?: string) => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply category filter
    if (category && category !== 'all') {
      query = query.ilike('category', category);
    }

    // Apply productType filter
    if (productType) {
      query = query.ilike('product_type', productType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    // Map the image field to imageUrl for backward compatibility
    return (data || []).map(product => ({
      ...product,
      imageUrl: product.image
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }

    if (!data) return null;

    // Map the image field to imageUrl for backward compatibility
    return {
      ...data,
      imageUrl: data.image
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Orders - using Supabase directly
export const createOrder = async (orderData: any) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    return data?.[0];
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Export supabase client for advanced queries
export { supabase };
import { supabase } from '../lib/supabaseClient';

// Types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyGrowth: number;
}

export interface TopSellingProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity_sold: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get total revenue
    const { data: revenueData } = await supabase
      .rpc('get_total_revenue');

    // Get total customers
    const { count: totalCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Get total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Calculate monthly growth (simplified example)
    const monthlyGrowth = 12.5; // This would be calculated based on your business logic

    return {
      totalOrders: totalOrders || 0,
      totalRevenue: (revenueData as any)?.[0]?.total_revenue || 0,
      totalCustomers: totalCustomers || 0,
      totalProducts: totalProducts || 0,
      monthlyGrowth,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get top selling products
 */
export const getTopSellingProducts = async (limit = 5): Promise<TopSellingProduct[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_top_selling_products', { limit_count: limit });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    throw error;
  }
};

/**
 * Get recent orders
 */
export const getRecentOrders = async (limit = 5): Promise<RecentOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        shipping_address->full_name as customer_name,
        total_amount,
        status,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

/**
 * Get revenue by period (day/week/month/year)
 */
export const getRevenueByPeriod = async (period: 'day' | 'week' | 'month' | 'year') => {
  try {
    let interval = '1 day';
    let format = 'YYYY-MM-DD';
    
    switch (period) {
      case 'week':
        interval = '1 week';
        format = 'YYYY-WW';
        break;
      case 'month':
        interval = '1 month';
        format = 'YYYY-MM';
        break;
      case 'year':
        interval = '1 year';
        format = 'YYYY';
        break;
    }

    const { data, error } = await supabase
      .rpc('get_revenue_by_period', { 
        interval_param: interval,
        format_param: format
      });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error(`Error fetching revenue by ${period}:`, error);
    throw error;
  }
};

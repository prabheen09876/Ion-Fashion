import { supabase } from './config';

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  salesGrowth: number;
  ordersGrowth: number;
  productsGrowth: number;
  customersGrowth: number;
}

export interface TopProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  soldCount: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  date: Date;
  amount: number;
  status: string;
}

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total products
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (productsError) throw productsError;
    
    // Get total customers (users with role 'customer')
    const { count: customersCount, error: customersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');
    
    if (customersError) throw customersError;
    
    // Get total orders and sales
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, created_at');
    
    if (ordersError) throw ordersError;
    
    const totalOrders = ordersData.length;
    const totalSales = ordersData.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    
    // Calculate growth rates (comparing current month with previous month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const currentMonthOrders = ordersData.filter(order => 
      new Date(order.created_at) >= currentMonthStart
    );
    
    const previousMonthOrders = ordersData.filter(order => 
      new Date(order.created_at) >= previousMonthStart && 
      new Date(order.created_at) < currentMonthStart
    );
    
    const currentMonthSales = currentMonthOrders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount), 0
    );
    
    const previousMonthSales = previousMonthOrders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount), 0
    );
    
    // Calculate growth percentages
    const salesGrowth = previousMonthSales === 0 
      ? 100 
      : ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;
    
    const ordersGrowth = previousMonthOrders.length === 0 
      ? 100 
      : ((currentMonthOrders.length - previousMonthOrders.length) / previousMonthOrders.length) * 100;
    
    // For products and customers, we'll use dummy growth for now
    // In a real app, you'd track when products and customers were added
    const productsGrowth = 4.1;
    const customersGrowth = 15.3;
    
    return {
      totalSales,
      totalOrders,
      totalProducts: productsCount || 0,
      totalCustomers: customersCount || 0,
      salesGrowth,
      ordersGrowth,
      productsGrowth,
      customersGrowth
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

// Get top selling products
export const getTopSellingProducts = async (limit = 5): Promise<TopProduct[]> => {
  try {
    // This query gets products with the most orders
    const { data, error } = await supabase.rpc('get_top_selling_products', { limit_count: limit });
    
    if (error) {
      console.error('RPC error, falling back to manual calculation:', error);
      
      // Fallback if the RPC function doesn't exist
      // Get all order items
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          product_id,
          quantity,
          products (
            id,
            name,
            image_url,
            price
          )
        `);
      
      if (itemsError) throw itemsError;
      
      // Calculate product sales
      const productSales: Record<string, { 
        id: string; 
        name: string; 
        imageUrl: string; 
        price: number; 
        soldCount: number; 
      }> = {};
      
      orderItems.forEach((item: any) => {
        const productId = item.product_id;
        const product = item.products;
        const quantity = item.quantity;
        
        if (productId in productSales) {
          productSales[productId].soldCount += quantity;
        } else {
          productSales[productId] = {
            id: productId,
            name: product.name,
            imageUrl: product.image_url,
            price: product.price,
            soldCount: quantity
          };
        }
      });
      
      // Sort by sold count and limit
      return Object.values(productSales)
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, limit);
    }
    
    // If RPC succeeded, map the results
    return data.map((item: any) => ({
      id: item.product_id,
      name: item.product_name,
      imageUrl: item.image_url,
      price: item.price,
      soldCount: item.sold_count
    }));
  } catch (error) {
    console.error('Error getting top selling products:', error);
    throw error;
  }
};

// Get recent orders
export const getRecentOrders = async (limit = 5): Promise<RecentOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        created_at,
        users:user_id (
          display_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data.map((order: any) => ({
      id: order.id,
      customerName: order.users?.display_name || 'Unknown',
      date: new Date(order.created_at),
      amount: order.total_amount,
      status: order.status
    }));
  } catch (error) {
    console.error('Error getting recent orders:', error);
    throw error;
  }
};

// Get sales by time period (day, week, month, year)
export const getSalesByTimePeriod = async (period: 'day' | 'week' | 'month' | 'year'): Promise<{ date: string; amount: number }[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('created_at, total_amount');
    
    if (error) throw error;
    
    // Group sales by time period
    const salesByPeriod: Record<string, number> = {};
    
    data.forEach((order: any) => {
      const date = new Date(order.created_at);
      let periodKey: string;
      
      switch (period) {
        case 'day':
          periodKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'week':
          // Get the Monday of the week
          const day = date.getDay() || 7; // Convert Sunday (0) to 7
          const diff = date.getDate() - day + 1; // Adjust to Monday
          const monday = new Date(date);
          monday.setDate(diff);
          periodKey = monday.toISOString().split('T')[0];
          break;
        case 'month':
          periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          periodKey = date.getFullYear().toString();
          break;
      }
      
      if (periodKey in salesByPeriod) {
        salesByPeriod[periodKey] += parseFloat(order.total_amount);
      } else {
        salesByPeriod[periodKey] = parseFloat(order.total_amount);
      }
    });
    
    // Convert to array and sort by date
    return Object.entries(salesByPeriod)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error(`Error getting sales by ${period}:`, error);
    throw error;
  }
};

import { supabase } from './config';

export interface OrderItem {
  id?: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productName?: string; // For display purposes
  productImage?: string; // For display purposes
}

export interface Order {
  id?: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: string;
  billingAddress?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
  customerName?: string; // For display purposes
  customerEmail?: string; // For display purposes
  items?: OrderItem[];
}

// Convert Supabase order to our Order interface
const convertOrder = (item: any): Order => {
  return {
    id: item.id,
    userId: item.user_id,
    status: item.status,
    totalAmount: item.total_amount,
    shippingAddress: item.shipping_address,
    billingAddress: item.billing_address,
    paymentMethod: item.payment_method,
    paymentStatus: item.payment_status,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
    customerName: item.customer_name,
    customerEmail: item.customer_email
  };
};

// Convert Supabase order item to our OrderItem interface
const convertOrderItem = (item: any): OrderItem => {
  return {
    id: item.id,
    orderId: item.order_id,
    productId: item.product_id,
    quantity: item.quantity,
    price: item.price,
    productName: item.product_name,
    productImage: item.product_image
  };
};

// Get all orders with customer details
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    // Join orders with users to get customer details
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id (
          email,
          display_name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map((item: any) => ({
      ...convertOrder(item),
      customerName: item.users?.display_name || 'Unknown',
      customerEmail: item.users?.email || 'Unknown'
    }));
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

// Get order by ID with items and product details
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    // Get the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        users:user_id (
          email,
          display_name
        )
      `)
      .eq('id', id)
      .single();
    
    if (orderError) {
      if (orderError.code === 'PGRST116') return null; // Record not found
      throw orderError;
    }
    
    // Get the order items with product details
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products:product_id (
          name,
          image_url
        )
      `)
      .eq('order_id', id);
    
    if (itemsError) throw itemsError;
    
    const order = {
      ...convertOrder(orderData),
      customerName: orderData.users?.display_name || 'Unknown',
      customerEmail: orderData.users?.email || 'Unknown',
      items: itemsData.map((item: any) => ({
        ...convertOrderItem(item),
        productName: item.products?.name || 'Unknown',
        productImage: item.products?.image_url || ''
      }))
    };
    
    return order;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(convertOrder);
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Create a new order with items
export const createOrder = async (order: Omit<Order, 'id'>, items: Omit<OrderItem, 'id' | 'orderId'>[]): Promise<string> => {
  try {
    // Start a transaction
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id: order.userId,
        status: order.status,
        total_amount: order.totalAmount,
        shipping_address: order.shippingAddress,
        billing_address: order.billingAddress,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus
      }])
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create order');
    
    const orderId = data[0].id;
    
    // Insert order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id: string, status: Order['status'], paymentStatus?: Order['paymentStatus']): Promise<void> => {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };
    
    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }
    
    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    // Order items will be deleted automatically due to CASCADE
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

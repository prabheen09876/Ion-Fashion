import { supabase } from './config';

export interface Product {
  id?: string;
  name: string;
  category: string;
  productType: string;
  price: number;
  description: string;
  imageUrl: string;
  featured?: boolean;
  inStock?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Convert Supabase product to our Product interface
const convertProduct = (item: any): Product => {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    productType: item.product_type,
    price: item.price,
    description: item.description,
    imageUrl: item.image_url,
    featured: item.featured || false,
    inStock: item.in_stock || true,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at)
  };
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(convertProduct);
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw error;
    }
    
    return convertProduct(data);
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    
    return data.map(convertProduct);
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

// Get products by product type
export const getProductsByType = async (productType: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('product_type', productType);
    
    if (error) throw error;
    
    return data.map(convertProduct);
  } catch (error) {
    console.error('Error getting products by type:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit_count = 4): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(limit_count);
    
    if (error) throw error;
    
    return data.map(convertProduct);
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
};

// Upload product image to Supabase Storage
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);
    
    if (error) throw error;
    
    // Get the public URL for the uploaded image
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Add a new product
export const addProduct = async (product: Omit<Product, 'id'>, imageFile?: File): Promise<string> => {
  try {
    const now = new Date().toISOString();
    
    // First, insert the product to get an ID
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        category: product.category,
        product_type: product.productType,
        price: product.price,
        description: product.description,
        image_url: product.imageUrl || '',
        featured: product.featured || false,
        in_stock: product.inStock || true,
        created_at: now,
        updated_at: now
      }])
      .select();
    
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Failed to create product');
    
    const newProductId = data[0].id;
    
    // If an image file is provided, upload it and update the product
    if (imageFile) {
      const imageUrl = await uploadProductImage(imageFile, newProductId);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', newProductId);
      
      if (updateError) throw updateError;
    }
    
    return newProductId;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id: string, product: Partial<Product>, imageFile?: File): Promise<void> => {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // Map our Product fields to Supabase column names
    if (product.name !== undefined) updateData.name = product.name;
    if (product.category !== undefined) updateData.category = product.category;
    if (product.productType !== undefined) updateData.product_type = product.productType;
    if (product.price !== undefined) updateData.price = product.price;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.featured !== undefined) updateData.featured = product.featured;
    if (product.inStock !== undefined) updateData.in_stock = product.inStock;
    
    // If an image file is provided, upload it
    if (imageFile) {
      const imageUrl = await uploadProductImage(imageFile, id);
      updateData.image_url = imageUrl;
    } else if (product.imageUrl !== undefined) {
      updateData.image_url = product.imageUrl;
    }
    
    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string, imageUrl?: string): Promise<void> => {
  try {
    // Delete the product from the database
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // If imageUrl is provided and it's from Supabase storage, delete it
    if (imageUrl && imageUrl.includes('supabase')) {
      // Extract the path from the URL
      const path = imageUrl.split('/').slice(-2).join('/');
      
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([path]);
      
      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continue with deletion even if image deletion fails
      }
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

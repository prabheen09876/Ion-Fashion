export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  productType: string;
  featured: boolean;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Add any additional product fields here
}

export interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  productType: string;
  featured: boolean;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}

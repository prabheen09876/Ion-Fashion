// Define product data structure
export interface Product {
  id: number;
  name: string;
  category: string;
  productType: string;
  price: number;
  imageUrl: string;
  description?: string;
}

// Product database
// export const productDatabase: Product[] = [
//   ... (dummy data removed)
// ];
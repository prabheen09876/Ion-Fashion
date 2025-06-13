import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../ui/Button';
import { Loader } from 'lucide-react';
import { createProduct, updateProduct, getProductById } from '../../../lib/databaseService';
import { uploadFile, getFileUrl } from '../../../lib/storageService';

// Define the product form data type
type ProductFormData = {
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
};

// ... (existing imports)

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const isEditMode = !!productId;

  // Form state
  const [formData, setFormData] = useState<Omit<ProductFormData, 'id'> & { id: string }>({
    id: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    productType: '',
    featured: false,
    inStock: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load product data in edit mode
  useEffect(() => {
    const loadProduct = async () => {
      if (!isEditMode || !productId) return;
      
      try {
        setIsLoading(true);
        const product = await getProductById(productId);
        if (product) {
          setFormData(product);
          if (product.image) {
            setPreviewImage(product.image);
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setErrors(prev => ({ ...prev, form: 'Failed to load product' }));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [isEditMode, productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set the file for upload
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.image;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw new Error('Failed to upload image');
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.productType) newErrors.productType = 'Product type is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image && !previewImage) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      let imageUrl = formData.image;
      
      // Upload new image if selected
      if (imageFile) {
        try {
          imageUrl = await uploadImage();
        } catch (error) {
          setErrors(prev => ({ ...prev, form: 'Failed to upload image' }));
          return;
        }
      }

      const productData = {
        ...formData,
        image: imageUrl
      };

      if (isEditMode && productId) {
        await updateProduct(productId, productData);
      } else {
        await createProduct(productData);
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors(prev => ({
        ...prev,
        form: 'Failed to save product. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/products')}
        >
          Back to Products
        </Button>
      </div>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {errors.form}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.price ? 'border-red-500' : ''
              }`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.category ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Accessories">Accessories</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Type</label>
            <input
              type="text"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              placeholder="e.g., T-shirt, Jeans, Dress"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.productType ? 'border-red-500' : ''
              }`}
            />
            {errors.productType && <p className="mt-1 text-sm text-red-600">{errors.productType}</p>}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Featured Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                In Stock
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="mt-1 flex items-center">
              <label
                htmlFor="image-upload"
                className="cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Choose File
              </label>
              <input
                id="image-upload"
                name="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
              <span className="ml-2 text-sm text-gray-500">
                {imageFile ? imageFile.name : 'No file chosen'}
              </span>
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            
            {previewImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Preview:</p>
                <img
                  src={previewImage}
                  alt="Product preview"
                  className="mt-1 h-32 w-32 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/products')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : isEditMode ? (
            'Update Product'
          ) : (
            'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
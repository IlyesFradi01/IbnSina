'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const rawId: any = params.id as any;
  const productId = Array.isArray(rawId) ? String(rawId[0] || '') : String(rawId || '');
  const invalidId = !productId || productId === 'undefined' || productId === 'null';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    sku: '',
    benefits: '',
    usageInstructions: '',
    ingredients: '',
    weight: '',
    origin: '',
    categoryId: '',
    isActive: true,
    isFeatured: false
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (invalidId) {
      setLoadingProduct(false);
      return;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

    const loadCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/categories`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const minimal = (Array.isArray(data) ? data : []).map((c: any) => ({ id: String(c._id || c.id), name: String(c.name || '') }));
          setCategories(minimal);
        }
      } catch {}
    };

    const loadProduct = async () => {
      setLoadingProduct(true);
      setError(null);
      try {
        const res = await fetch(`${apiUrl}/products/${productId}`, { cache: 'no-store' });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`${res.status} ${txt}`);
        }
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) {
          const txt = await res.text();
          throw new Error(`Unexpected response (not JSON): ${txt.slice(0, 120)}...`);
        }
        const p = await res.json();
        setFormData({
          name: p?.name || '',
          description: p?.description || '',
          price: p?.price != null ? String(p.price) : '',
          originalPrice: p?.originalPrice != null ? String(p.originalPrice) : '',
          stock: p?.stock != null ? String(p.stock) : '',
          sku: p?.sku || '',
          benefits: p?.benefits || '',
          usageInstructions: p?.usageInstructions || '',
          ingredients: p?.ingredients || '',
          weight: p?.weight || '',
          origin: p?.origin || '',
          categoryId: p?.categoryId ? String(p.categoryId) : '',
          isActive: p?.isActive !== false,
          isFeatured: p?.isFeatured === true,
        });
        const imgs = typeof p?.images === 'string' && p.images.length > 0 ? p.images.split(',') : [];
        setImages(imgs);
      } catch (e: any) {
        setError(e?.message || 'Failed to load product');
      } finally {
        setLoadingProduct(false);
      }
    };

    loadCategories();
    loadProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
      if (cloud && preset) {
        const uploaded: string[] = [];
        for (const file of files) {
          const form = new FormData();
          form.append('file', file);
          form.append('upload_preset', preset);
          const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/image/upload`;
          const res = await fetch(url, { method: 'POST', body: form });
          if (!res.ok) {
            const txt = await res.text();
            throw new Error(`Cloud upload failed: ${res.status} ${txt}`);
          }
          const data = await res.json();
          if (!data?.secure_url) throw new Error('No secure_url from Cloudinary');
          uploaded.push(String(data.secure_url));
        }
        // Put newly uploaded images first so they show on the storefront
        setImages(prev => [...uploaded, ...prev]);
      } else {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
        const form = new FormData();
        files.forEach((f) => form.append('files', f));
        const res = await fetch(`${apiUrl}/uploads`, { method: 'POST', body: form });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Upload failed: ${res.status} ${txt}`);
        }
        const data = await res.json();
        const urls: string[] = Array.isArray(data?.urls) ? data.urls : [];
        setImages(prev => [...urls, ...prev]);
      }
    } catch (err) {
      setError((err as any)?.message || 'Image upload failed');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invalidId) return;
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
      // Normalize, trim, and deduplicate images, preserving order
      const normalized = Array.from(new Set(images.map((s) => String(s).trim()).filter(Boolean)));
      const payload: any = {
        ...formData,
        price: formData.price ? Number(formData.price) : 0,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: formData.stock ? Number(formData.stock) : 0,
        categoryId: formData.categoryId || undefined,
        images: normalized.join(','),
      };
      const res = await fetch(`${apiUrl}/products/open/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let message = 'Failed to update product';
        try {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            message = (data?.message && (Array.isArray(data.message) ? data.message.join(', ') : data.message)) || message;
          } else {
            message = await res.text();
          }
        } catch {}
        throw new Error(message || `API error: ${res.status}`);
      }
      
      router.push('/products');
    } catch (error: any) {
      setError(error?.message || 'Error updating product');
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (invalidId) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid product link</h2>
          <button onClick={() => router.push('/products')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Back to Products</button>
        </div>
      </div>
    );
  }

  if (loadingProduct) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded border border-red-200">{error}</div>
        )}
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="e.g., Premium Turmeric Root"
              />
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="e.g., TUR-001"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="Describe your product..."
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="24.99"
              />
            </div>

            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Original Price
              </label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                step="0.01"
                value={formData.originalPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="29.99"
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                placeholder="100"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

       

        {/* Images */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload product images
                    </span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="soldOut"
                name="soldOut"
                type="checkbox"
                checked={(Number(formData.stock || '0') <= 0)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData(prev => ({
                    ...prev,
                    stock: checked ? '0' : (prev.stock && Number(prev.stock) > 0 ? prev.stock : '1'),
                  }));
                }}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="soldOut" className="ml-2 block text-sm text-gray-900">
                Sold out
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

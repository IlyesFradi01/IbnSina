'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

export default function ProductView() {
  const router = useRouter();
  const params = useParams();
  const rawId: any = params?.id as any;
  const productId = Array.isArray(rawId) ? String(rawId[0] || '') : String(rawId || '');
  const invalidId = !productId || productId === 'undefined' || productId === 'null';

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categoriesById, setCategoriesById] = useState<Map<string, string>>(new Map());
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

  useEffect(() => {
    if (invalidId) {
      setLoading(false);
      setProduct(null);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`${apiUrl}/products/${productId}`, { cache: 'no-store' }),
          fetch(`${apiUrl}/categories`, { cache: 'no-store' }),
        ]);
        if (!pRes.ok) {
          const t = await pRes.text();
          throw new Error(`${pRes.status} ${t}`);
        }
        const p = await pRes.json();
        setProduct(p);
        if (cRes.ok) {
          const cats = await cRes.json();
          const map = new Map<string, string>((Array.isArray(cats) ? cats : []).map((c: any) => [String(c._id || c.id), String(c.name || '')]));
          setCategoriesById(map);
        }
      } catch (e) {
        console.error('Error loading product:', e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const handleEdit = () => {
    if (invalidId) return;
    router.push(`/products/${productId}/edit`);
  };

  const handleDelete = () => {
    if (invalidId) return;
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', productId);
      router.push('/products');
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const imageUrls: string[] = Array.isArray(product.images)
    ? product.images
    : (typeof product.images === 'string' && product.images.trim().length > 0
        ? product.images.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []);

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
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">Product Details</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleEdit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {imageUrls.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <PhotoIcon className="h-24 w-24 text-gray-400" />
            )}
          </div>
          {imageUrls.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {imageUrls.slice(1).map((url: string, index: number) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Image ${index + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <p className="text-gray-900">{product.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <p className="text-gray-900">{product.sku}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <p className="text-lg font-semibold text-gray-900">${product.price}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Original Price</label>
                <p className="text-lg text-gray-500 line-through">{product.originalPrice ? `$${product.originalPrice}` : '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <p className={`text-lg font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {product.stock}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <p className="text-gray-900">{categoriesById.get(String(product.categoryId)) || '—'}</p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Health Benefits</label>
                <p className="text-gray-900">{product.benefits || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usage Instructions</label>
                <p className="text-gray-900">{product.usageInstructions || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                <p className="text-gray-900">{product.ingredients || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight/Size</label>
                  <p className="text-gray-900">{product.weight || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Origin</label>
                  <p className="text-gray-900">{product.origin || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Featured</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  product.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

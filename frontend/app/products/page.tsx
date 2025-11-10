'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<Array<any>>([]);
  const [categories, setCategories] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = '';
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [pRes, cRes] = await Promise.all([
          fetch(`/api/products`, { cache: 'no-store' }),
          fetch(`/api/categories`, { cache: 'no-store' }),
        ]);
        if (!pRes.ok) {
          const t = await pRes.text();
          throw new Error(`${pRes.status} ${t}`);
        }
        const pJson = await pRes.json();
        setProducts(Array.isArray(pJson) ? pJson : []);
        if (cRes.ok) {
          const cJson = await cRes.json();
          setCategories(Array.isArray(cJson) ? cJson : []);
        } else {
          setCategories([]);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load products');
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      const cid = String(p?.categoryId ?? '');
      if (!cid) continue;
      counts.set(cid, (counts.get(cid) || 0) + 1);
    }
    const base = [{ id: 'all', name: 'All Products', count: products.length }];
    const rest = (categories || []).map((c: any) => ({
      id: String(c._id || c.id),
      name: String(c.name || ''),
      count: counts.get(String(c._id || c.id)) || 0,
    }));
    return [...base, ...rest];
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    const list = products.filter((product: any) => {
      const name = String(product?.name || '').toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || String(product?.categoryId || '') === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    if (sortBy === 'price-low') list.sort((a: any, b: any) => (a?.price ?? 0) - (b?.price ?? 0));
    else if (sortBy === 'price-high') list.sort((a: any, b: any) => (b?.price ?? 0) - (a?.price ?? 0));
    else if (sortBy === 'newest') list.sort((a: any, b: any) => new Date(b?.createdAt ?? 0).getTime() - new Date(a?.createdAt ?? 0).getTime());
    return list;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const uploadsBase = apiBase || '/api';

  const addToCart = (p: any) => {
    try {
      const id = String(p?._id || p?.id || '');
      if (!id) return;
      const name = String(p?.name || 'Product');
      const price = Number(p?.price || 0);
      const imgs = typeof p?.images === 'string' ? p.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
      let image = imgs[0] || '';
      if (image) {
        if (!/^https?:\/\//i.test(image)) {
          image = image.startsWith('/uploads') ? `${uploadsBase}${image}` : `${uploadsBase}/uploads/${encodeURIComponent(image)}`;
        } else {
          try {
            const u = new URL(image);
            if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
              const rel = u.pathname.startsWith('/uploads') ? u.pathname : `/uploads/${encodeURIComponent(u.pathname.replace(/^\/+/, ''))}`;
              image = `${uploadsBase}${rel}`;
            }
          } catch {}
        }
      }
      const raw = localStorage.getItem('cart') || '[]';
      const cart = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
      const idx = cart.findIndex((it: any) => String(it.id) === id);
      if (idx >= 0) {
        cart[idx].quantity = (Number(cart[idx].quantity) || 0) + 1;
      } else {
        cart.push({ id, name, price, quantity: 1, image });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
              <p className="text-gray-600 mt-2">Discover our complete collection of medicinal herbs and organic products</p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading products...' : `Showing ${filteredProducts.length} of ${products.length} products`}
              </p>
              <div className="flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Filters</span>
              </div>
            </div>

            {error ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-red-600 mb-2">{error}</h3>
                <p className="text-gray-600">Please try again later.</p>
              </div>
            ) : filteredProducts.length === 0 && !loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const detailId = String(product?._id || '');
                  return (
                  <div key={detailId || String(product.id || Math.random())} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="relative">
                      {detailId ? (
                      <Link href={`/products/${detailId}`}>
                        <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 rounded-t-xl flex items-center justify-center overflow-hidden">
                          {(() => {
                            const imgs = typeof product?.images === 'string' ? product.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
                            const raw = imgs[0];
                            if (!raw || raw.startsWith('blob:')) return <span className="text-4xl">🌿</span>;
                            let src = raw;
                            if (!/^https?:\/\//i.test(raw)) {
                              src = raw.startsWith('/uploads') ? `${uploadsBase}${raw}` : `${uploadsBase}/uploads/${encodeURIComponent(raw)}`;
                            } else {
                              try {
                                const u = new URL(raw);
                                if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
                                  const rel = u.pathname.startsWith('/uploads') ? u.pathname : `/uploads/${encodeURIComponent(u.pathname.replace(/^\/+/, ''))}`;
                                  src = `${uploadsBase}${rel}`;
                                }
                              } catch {}
                            }
                            // eslint-disable-next-line @next/next/no-img-element
                            return (
                              <img
                                src={src}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  try { (e.currentTarget as HTMLImageElement).src = '/logo.jpg'; } catch {}
                                }}
                              />
                            );
                          })()}
                        </div>
                      </Link>
                      ) : (
                        <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 rounded-t-xl flex items-center justify-center overflow-hidden">
                          {(() => {
                            const imgs = typeof product?.images === 'string' ? product.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
                            const raw = imgs[0];
                            if (!raw || raw.startsWith('blob:')) return <span className="text-4xl">🌿</span>;
                            let src = raw;
                            if (!/^https?:\/\//i.test(raw)) {
                              src = raw.startsWith('/uploads') ? `${uploadsBase}${raw}` : `${uploadsBase}/uploads/${encodeURIComponent(raw)}`;
                            } else {
                              try {
                                const u = new URL(raw);
                                if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
                                  const rel = u.pathname.startsWith('/uploads') ? u.pathname : `/uploads/${encodeURIComponent(u.pathname.replace(/^\/+/, ''))}`;
                                  src = `${uploadsBase}${rel}`;
                                }
                              } catch {}
                            }
                            // eslint-disable-next-line @next/next/no-img-element
                            return (
                              <img
                                src={src}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  try { (e.currentTarget as HTMLImageElement).src = '/logo.jpg'; } catch {}
                                }}
                              />
                            );
                          })()}
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {product.isFeatured ? 'Featured' : 'Product'}
                        </span>
                      </div>
                      
                      {!(product?.stock > 0) && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-xl flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      {detailId ? (
                      <Link href={`/products/${detailId}`} className="hover:underline">
                        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      </Link>
                      ) : (
                        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      )}
                      
                   
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">{`TND ${product.price}`}</span>
                          {product.originalPrice != null && product.originalPrice > 0 && (
                            <span className="text-sm text-gray-500 line-through">{`TND ${product.originalPrice}`}</span>
                          )}
                        </div>
                        <button 
                          disabled={!(product?.stock > 0)}
                          className={`p-2 rounded-lg transition-colors ${
                            product?.stock > 0 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          } flex items-center gap-2 px-3`}
                          onClick={() => addToCart(product)}
                          aria-label="Add to cart"
                          title={product?.stock > 0 ? 'Add to cart' : 'Sold out'}
                        >
                          <ShoppingCartIcon className="h-5 w-5" />
                         
                        </button>
                      </div>
                    </div>
                  </div>
                );
                })}
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-8">
                <button className="bg-white border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

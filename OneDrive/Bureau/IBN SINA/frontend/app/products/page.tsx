'use client';

import { useState } from 'react';
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

  const categories = [
    { id: 'all', name: 'All Products', count: 156 },
    { id: 'essential-oils', name: 'Essential Oils', count: 45 },
    { id: 'dried-herbs', name: 'Dried Herbs', count: 32 },
    { id: 'tea-blends', name: 'Tea Blends', count: 28 },
    { id: 'spices', name: 'Spices', count: 67 }
  ];

  const products = [
    {
      id: 1,
      name: "Premium Turmeric Root",
      price: 24.99,
      originalPrice: 29.99,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
      category: "dried-herbs",
      inStock: true
    },
    {
      id: 2,
      name: "Organic Ginger Powder",
      price: 18.99,
      originalPrice: 22.99,
      image: "/api/placeholder/300/300",
      rating: 4.9,
      reviews: 89,
      badge: "Organic",
      category: "spices",
      inStock: true
    },
    {
      id: 3,
      name: "Lavender Essential Oil",
      price: 32.99,
      originalPrice: 39.99,
      image: "/api/placeholder/300/300",
      rating: 4.7,
      reviews: 156,
      badge: "Premium",
      category: "essential-oils",
      inStock: true
    },
    {
      id: 4,
      name: "Eucalyptus Leaves",
      price: 15.99,
      originalPrice: 19.99,
      image: "/api/placeholder/300/300",
      rating: 4.6,
      reviews: 98,
      badge: "New",
      category: "dried-herbs",
      inStock: false
    },
    {
      id: 5,
      name: "Chamomile Tea Blend",
      price: 12.99,
      originalPrice: 15.99,
      image: "/api/placeholder/300/300",
      rating: 4.5,
      reviews: 67,
      badge: "Tea",
      category: "tea-blends",
      inStock: true
    },
    {
      id: 6,
      name: "Peppermint Essential Oil",
      price: 28.99,
      originalPrice: 34.99,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 143,
      badge: "Popular",
      category: "essential-oils",
      inStock: true
    },
    {
      id: 7,
      name: "Cinnamon Bark",
      price: 22.99,
      originalPrice: 27.99,
      image: "/api/placeholder/300/300",
      rating: 4.7,
      reviews: 89,
      badge: "Spice",
      category: "spices",
      inStock: true
    },
    {
      id: 8,
      name: "Green Tea Blend",
      price: 16.99,
      originalPrice: 19.99,
      image: "/api/placeholder/300/300",
      rating: 4.6,
      reviews: 112,
      badge: "Tea",
      category: "tea-blends",
      inStock: true
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                {categories.map((category) => (
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
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Filters</span>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 rounded-t-xl flex items-center justify-center">
                        <span className="text-4xl">🌿</span>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          {product.badge}
                        </span>
                      </div>
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <HeartIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-xl flex items-center justify-center">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                          )}
                        </div>
                        <button 
                          disabled={!product.inStock}
                          className={`p-2 rounded-lg transition-colors ${
                            product.inStock 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingCartIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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

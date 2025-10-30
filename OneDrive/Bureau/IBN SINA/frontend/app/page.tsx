import Image from "next/image";
import Link from "next/link";
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingCartIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Turmeric Root",
      price: 24.99,
      originalPrice: 29.99,
      image: "/api/placeholder/300/300",
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Organic Ginger Powder",
      price: 18.99,
      originalPrice: 22.99,
      image: "/api/placeholder/300/300",
      rating: 4.9,
      reviews: 89,
      badge: "Organic"
    },
    {
      id: 3,
      name: "Lavender Essential Oil",
      price: 32.99,
      originalPrice: 39.99,
      image: "/api/placeholder/300/300",
      rating: 4.7,
      reviews: 156,
      badge: "Premium"
    },
    {
      id: 4,
      name: "Eucalyptus Leaves",
      price: 15.99,
      originalPrice: 19.99,
      image: "/api/placeholder/300/300",
      rating: 4.6,
      reviews: 98,
      badge: "New"
    }
  ];

  const categories = [
    { name: "Essential Oils", count: 45, image: "/api/placeholder/400/300" },
    { name: "Dried Herbs", count: 32, image: "/api/placeholder/400/300" },
    { name: "Tea Blends", count: 28, image: "/api/placeholder/400/300" },
    { name: "Spices", count: 67, image: "/api/placeholder/400/300" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Premium
                  <span className="text-green-600 block">Medicinal Herbs</span>
                  & Organic Products
          </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover the healing power of nature with our carefully curated collection 
                  of medicinal herbs, essential oils, and organic products. 
                  Trusted by thousands for authentic, high-quality traditional medicine.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/products"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  Shop Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  href="/about"
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center"
                >
                  Learn More
                </Link>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center">
                  <TruckIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span>Free Shipping $50+</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl p-4 animate-pulse hover:animate-bounce transition-all duration-300">
                    <img 
                      src="/logo.jpg" 
                      alt="IBN SINA Logo" 
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                  <p className="text-gray-600 font-semibold">Premium Quality Herbs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Explore our diverse range of natural healing products</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index}
                href={`/categories/${category.name.toLowerCase().replace(' ', '-')}`}
                className="group relative overflow-hidden rounded-xl bg-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                  <span className="text-4xl">🌿</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                  <p className="text-white text-sm opacity-90">{category.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Our most popular and highest-rated products</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
                    <button className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors">
                      <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/products"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View All Products
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose IBN SINA?</h2>
            <p className="text-lg text-gray-600">We're committed to providing the highest quality natural products</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Authentic</h3>
              <p className="text-gray-600">All our products are sourced directly from trusted suppliers and verified for authenticity.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50. Fast, secure delivery to your doorstep.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Natural Healing</h3>
              <p className="text-gray-600">Traditional medicine meets modern quality standards for your wellness journey.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

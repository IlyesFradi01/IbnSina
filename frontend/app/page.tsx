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

type FeaturedProduct = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images?: string; // backend stores single string path
  isFeatured?: boolean;
};

async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  const API_URL = ''; // use relative proxy
  try {
    const res = await fetch(`/api/products/featured`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch featured products');
    const data: FeaturedProduct[] = await res.json();
    const featured = Array.isArray(data) ? data : [];
    if (featured.length >= 4) return featured.slice(0, 4);

    // Fallback: fetch latest products to fill remaining slots up to 4
    const fillCount = 4 - featured.length;
    const allRes = await fetch(`/api/products`, { cache: 'no-store' });
    const allData: FeaturedProduct[] = allRes.ok ? await allRes.json() : [];
    const existingIds = new Set(featured.map(p => p._id));
    const fillers = (Array.isArray(allData) ? allData : []).filter(p => !existingIds.has(p._id)).slice(0, fillCount);
    return [...featured, ...fillers];
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const uploadsBase = apiBase || '/api';

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
    

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Our most popular and highest-rated products</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const imgs = typeof product.images === 'string' ? product.images.split(',').map(s => s.trim()).filter(Boolean) : [];
              const raw = imgs[0];
              let firstImage = raw || '';
              if (firstImage) {
                if (!/^https?:\/\//i.test(firstImage)) {
                  firstImage = firstImage.startsWith('/uploads') ? `${uploadsBase}${firstImage}` : `${uploadsBase}/uploads/${encodeURIComponent(firstImage)}`;
                } else {
                  try {
                    const u = new URL(firstImage);
                    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
                      const rel = u.pathname.startsWith('/uploads') ? u.pathname : `/uploads/${encodeURIComponent(u.pathname.replace(/^\\/+/, ''))}`;
                      firstImage = `${uploadsBase}${rel}`;
                    }
                  } catch {}
                }
              }
              return (
              <div key={product._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-200 rounded-t-xl flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {firstImage ? (
                      <img src={firstImage} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🌿</span>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">TND {(Number(product.price) || 0).toFixed(3)}</span>
                      {typeof product.originalPrice === 'number' && (
                        <span className="text-sm text-gray-500 line-through">TND {product.originalPrice.toFixed(3)}</span>
                      )}
                    </div>
                    <Link href="/products" className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors">
                      <ShoppingCartIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
            })}
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
              <p className="text-gray-600"> Fast, secure delivery to your doorstep.</p>
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

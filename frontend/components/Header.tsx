'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const computeCounts = () => {
      try {
        const cartRaw = localStorage.getItem('cart') || '[]';
        const cart = JSON.parse(cartRaw);
        const c = Array.isArray(cart) ? cart.length : 0;
        setCartCount(c);
      } catch {
        setCartCount(0);
      }
      try {
        const favRaw = localStorage.getItem('favorites') || '[]';
        const fav = JSON.parse(favRaw);
        const f = Array.isArray(fav) ? fav.length : 0;
        setFavCount(f);
      } catch {
        setFavCount(0);
      }
    };
    computeCounts();
    const onStorage = (e: StorageEvent) => {
      if (!e || (e.key !== 'cart' && e.key !== 'favorites')) return;
      computeCounts();
    };
    const onCustom = () => computeCounts();
    window.addEventListener('storage', onStorage);
    window.addEventListener('cartUpdated', onCustom as any);
    window.addEventListener('favoritesUpdated', onCustom as any);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cartUpdated', onCustom as any);
      window.removeEventListener('favoritesUpdated', onCustom as any);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },

    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
   
    

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg p-2 ring-2 ring-gray-100 hover:ring-green-200 transition-all duration-300">
                <img 
                  src="/logo.jpg" 
                  alt="IBN SINA Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">IBN SINA</h1>
                <p className="text-sm text-gray-600">Medicinal Herbs</p>
              </div>
            </Link>
          </div>

       

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search icon for mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

          
          

            {/* Cart */}
            <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

          

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for herbs, oils, products..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 py-4 border-t border-gray-200">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 font-medium py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

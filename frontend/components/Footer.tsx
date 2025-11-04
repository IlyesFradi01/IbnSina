import Link from 'next/link';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg p-2">
                <img 
                  src="/logo.jpg" 
                  alt="IBN SINA Logo" 
                  className="h-8 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">IBN SINA</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Premium medicinal herbs and organic products for natural healing and wellness. 
              Trusted by thousands for authentic, high-quality traditional medicine.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/ibn.sina.542470" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="https://wa.me/21693086770" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">WhatsApp</span>
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.93 11.93 0 0 0 12.06 0C5.46 0 .1 5.36.1 11.96c0 2.1.55 4.16 1.6 5.98L0 24l6.22-1.64a11.9 11.9 0 0 0 5.84 1.53h.01c6.6 0 11.96-5.36 11.96-11.96 0-3.2-1.25-6.2-3.51-8.45zM12.06 21.3h-.01c-1.93 0-3.82-.52-5.47-1.5l-.39-.23-3.69.98.99-3.6-.25-.37a9.82 9.82 0 0 1-1.52-5.32c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.02 6.96 2.88a9.81 9.81 0 0 1 2.88 6.96c0 5.44-4.42 9.85-9.86 9.85zm5.73-7.35c-.31-.16-1.82-.9-2.1-1.01-.28-.1-.48-.16-.68.16-.2.31-.78 1.01-.96 1.22-.18.2-.36.23-.67.08-.31-.16-1.32-.49-2.51-1.57-.93-.83-1.56-1.85-1.74-2.16-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.19.21-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.68-1.63-.93-2.23-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.52.08-.79.39-.27.31-1.03 1.01-1.03 2.47s1.06 2.86 1.2 3.06c.16.2 2.08 3.18 5.04 4.46.7.3 1.24.47 1.67.6.7.22 1.34.19 1.85.12.57-.08 1.82-.74 2.08-1.46.26-.72.26-1.34.18-1.46-.08-.12-.28-.2-.59-.36z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 ">
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
             
            </ul>
          </div>

    

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">+216 93 053 220</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">+216 93 086 770</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">info@ibnsina.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-green-400 mt-0.5" />
                <span className="text-gray-300">
                 Kalaa Kebira<br />
                  Tunisia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} IBN SINA. All rights reserved.
            </p>
           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

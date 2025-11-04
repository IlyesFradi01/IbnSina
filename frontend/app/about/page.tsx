import { 
  HeartIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon,
  UserGroupIcon,
  LightBulbIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function About() {
  const values = [
    {
      icon: HeartIcon,
      title: "Natural Healing",
      description: "We believe in the power of nature to heal and restore balance to your body and mind."
    },
    {
      icon: ShieldCheckIcon,
      title: "Quality Assurance",
      description: "Every product is carefully tested and verified to meet our high standards of purity and potency."
    },
    {
      icon: GlobeAltIcon,
      title: "Sustainable Sourcing",
      description: "We work directly with local farmers and suppliers who practice sustainable and ethical harvesting."
    },
    {
      icon: UserGroupIcon,
      title: "Community Focus",
      description: "Supporting local communities and preserving traditional knowledge for future generations."
    }
  ];

  const team = [
    {
      name: "Dr. Ahmed Sabagh",
      role: "Chief Herbalist",
      image: "/api/placeholder/200/200",
      
    },
    {
      name: "Dr. Mohmoud Chaaraoui",
      role: "Chief Herbalist",
      image: "/api/placeholder/200/200",

    },
    {
      name: "Dr. Adel Abdaal",
      role: "Chief Herbalist",
      image: "/api/placeholder/200/200",
    
    },
    {
      name: "Dr. Abd Taweb Hsine",
      role: "Chief Herbalist",
      image: "/api/placeholder/200/200",
     
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-green-600">IBN SINA</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              For over a decade, we've been dedicated to bringing you the finest medicinal herbs 
              and organic products, combining traditional wisdom with modern quality standards.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <div className="space-y-4 text-gray-600">
              <p>
                At IBN SINA, we believe the secret to well-being begins with nature—
                in a drop of pure oil, a sip of clear honey, and a breath fragranced by
                meticulously distilled waters, crafted with care and quality.
              </p>
              <p>
                Here you will find what is exceptional: our products are natural, pure, and of
                high quality. It is an invitation to return to the origin—to the simplicity of the
                earth, the clarity of the body, and the serenity of the soul.
              </p>
              <p>
                To feel more energetic, balanced, successful, and joyful, we have curated a
                selection of natural oils; aromatic and leafy herbs; seeds of many kinds—local and
                international; honey and its derivatives for a stronger immunity; and scented waters
                for various uses, including cosmetic applications—so your body regains its energy,
                your spirit its clarity, and your life its joy.
              </p>
              <p>
                We choose our ingredients carefully from the heart of nature and present them as
                they are—without additives and without affectation—because true beauty needs only
                what is natural and authentic.
              </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4 bg-white shadow">
                    <img
                      src="/logo.jpg"
                      alt="IBN SINA Logo"
                      className="w-full h-full object-contain p-3"
                    />
                  </div>
                  <p className="text-gray-600">Traditional Medicine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The experts behind our quality products</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👨‍⚕️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-2">{member.role}</p>
              
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-green-100">Numbers that speak to our commitment</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1,000+</div>
              <div className="text-green-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-green-100">Countries Served</div>
            </div>
           
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Discover our carefully curated collection of medicinal herbs and organic products, 
            and experience the healing power of nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/products"
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Shop Now
            </a>
            <a 
              href="/contact"
              className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

# IBN SINA - Medicinal Herbs E-commerce Platform

A comprehensive e-commerce platform for medicinal herbs and organic products, built with Next.js, NestJS, and a microservices architecture.

## 🌿 Project Overview

IBN SINA is a modern e-commerce platform specializing in medicinal herbs, essential oils, and organic products. The platform features:

- **Frontend**: Beautiful Shopify-like e-commerce website built with Next.js
- **Backend**: Robust API built with NestJS and microservices architecture
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, and customers
- **Database**: SQLite database with TypeORM for data persistence

## 🏗️ Architecture

```
IBN SINA/
├── frontend/          # Next.js e-commerce website
├── backend/           # NestJS API server
├── admin/            # Next.js admin dashboard
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IBN-SINA
   ```

2. **Install dependencies for all projects**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   
   # Admin Dashboard
   cd ../admin
   npm install
   ```

3. **Start the development servers**

   **Backend (Port 3001):**
   ```bash
   cd backend
   npm run start:dev
   ```

   **Frontend (Port 3000):**
   ```bash
   cd frontend
   npm run dev
   ```

   **Admin Dashboard (Port 3002):**
   ```bash
   cd admin
   npm run dev
   ```

## 📱 Access Points

- **E-commerce Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3002
- **API Documentation**: http://localhost:3001 (when running)

## 🛠️ Features

### Frontend (E-commerce Website)
- ✅ Modern, responsive design inspired by Shopify
- ✅ Product catalog with categories and search
- ✅ Product detail pages with reviews and ratings
- ✅ Shopping cart functionality
- ✅ User authentication and profiles
- ✅ About Us and Contact pages
- ✅ Mobile-optimized design

### Backend (API)
- ✅ RESTful API with NestJS
- ✅ SQLite database with TypeORM
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Product management endpoints
- ✅ Category management
- ✅ Order management
- ✅ User management

### Admin Dashboard
- ✅ Comprehensive dashboard with analytics
- ✅ Product management (CRUD operations)
- ✅ Category management
- ✅ Order management
- ✅ Customer management
- ✅ Inventory tracking
- ✅ Sales analytics

## 🗄️ Database Schema

The application uses the following main entities:

- **Products**: Medicinal herbs, essential oils, and organic products
- **Categories**: Product categorization
- **Users**: Customer and admin accounts
- **Orders**: Customer orders and transactions
- **OrderItems**: Individual items within orders

## 🔧 API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/featured` - Get featured products
- `GET /products/search` - Search products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (Admin)
- `PUT /categories/:id` - Update category (Admin)
- `DELETE /categories/:id` - Delete category (Admin)

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile

## 🎨 Design System

The platform uses a consistent design system with:
- **Primary Color**: Green (#059669) - representing nature and healing
- **Typography**: Inter font family for modern readability
- **Components**: Tailwind CSS for consistent styling
- **Icons**: Heroicons for consistent iconography

## 📦 Product Categories

- **Essential Oils**: Pure essential oils for aromatherapy
- **Dried Herbs**: Traditional medicinal herbs
- **Tea Blends**: Herbal tea combinations
- **Spices**: Culinary and medicinal spices

## 🔐 Authentication & Authorization

- **JWT-based authentication**
- **Role-based access control**:
  - Customer: Browse and purchase products
  - Admin: Full access to admin dashboard
  - Moderator: Limited admin access

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure database connection
3. Deploy to your preferred platform (Vercel, Heroku, etc.)

### Frontend Deployment
1. Build the production version
2. Deploy to Vercel, Netlify, or your preferred platform

### Admin Dashboard Deployment
1. Build the production version
2. Deploy to your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: support@ibnsina.com
- Documentation: [Link to documentation]
- Issues: [GitHub Issues]

## 🌟 Features Roadmap

- [ ] Payment integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Inventory management
- [ ] Shipping integration

---

Built with ❤️ for natural healing and wellness

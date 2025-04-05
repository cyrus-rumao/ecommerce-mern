# 🛍️ ShopSphere — Full-Stack E-commerce Platform

ShopSphere is a high-performance, feature-rich e-commerce application built using the MERN stack. It provides a seamless shopping experience with secure payment processing, dynamic coupon integration, admin management, and insightful analytics — all wrapped in a sleek, responsive UI.

---

## 🚀 Tech Stack

**Frontend**: ReactJS, TailwindCSS  
**Backend**: Node.js, Express.js  
**Database**: MongoDB  
**Authentication**: Redis-based Access Tokens  
**Payments**: Stripe  
**Charts & Analytics**: Recharts  
**Media Storage**: Cloudinary  
**Notifications**: Sonner

---

## 💡 Features

- 🛒 **Real-Time Cart & Checkout**: Add, update, and remove items instantly with a smooth UI and persistent cart.  
- 🎟️ **Coupon Engine**: Apply dynamic discount codes at checkout with full validation.  
- 🔐 **Secure Auth**: Token-based user authentication using Redis for fast and safe sessions.  
- 🧑‍💼 **Admin Dashboard**: Manage products, users, and orders with role-based access control.  
- 📊 **Sales Analytics**: Visualized performance data using Recharts to track revenue and trends.  
- ☁️ **Media Management**: Product images handled through Cloudinary CDN for lightning-fast load times.  
- 🧈 **Sleek UI/UX**: Clean, responsive design that feels smooth on desktop and mobile.

---

## ⚙️ Setup Instructions

### 1. Clone the repository  
```bash
git clone https://github.com/cyrus-rumao/ecommerce-mern.git
cd ecommerce-mern
```

### 2. Install dependencies  
```bash
cd frontend
npm install

cd ../backend
npm install
```

### 3. Add environment variables  
Create `.env` file in`backend` directory with the following:

#### `/backend/.env`
```
PORT=your_backend_port
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REDIS_URL=your_redis_url
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=your_client_url
```

### 4. Run the app  
```bash
# Start backend
cd backend
nodemon server.js

# Start frontend
cd ../frontend
npm run dev
```

---

## 📸 Screenshots

> _Coming soon... or better yet, just run the app and witness its beauty firsthand._

---

## 🧠 Why I Built This

ShopSphere was built to bring together my passion for full-stack development, system design, and user experience. It challenged me to explore secure authentication, payment processing, real-time updates, and admin-level control — all while keeping the code clean and the UI buttery smooth. This isn't just another e-commerce site. It's my proof of how curiosity + code = powerful products.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

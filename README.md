🛒 Ecommerce SPA

A full-stack single page application for an e-commerce website. Built with React (Vite + Tailwind) on the frontend and Node.js + Express + SQLite on the backend. Supports authentication, product CRUD with filters, and a persistent shopping cart.

✨ Features
🔹 Backend (Node.js + Express)

JWT-based authentication (Signup, Login)

CRUD APIs for items (Create, Read, Update, Delete)

Filtering on items: by category, min price, max price, search

Add to cart APIs (Add, Update, Remove)

Cart persists across login/logout (tied to user in DB)

🔹 Frontend (React SPA)

Signup & Login pages

Product listing page with filters

Cart page with add/remove/update options

Clean & professional UI (TailwindCSS)

Cart state persists per user

⚙️ Tech Stack

Frontend: React, Vite, React Router, TailwindCSS

Backend: Node.js, Express, better-sqlite3, JWT, bcryptjs

Database: SQLite (lightweight, file-based)

Deployment:

Backend → Render (or any Node hosting)

Frontend → Vercel / Netlify

🚀 Getting Started
1️⃣ Clone the repo
git clone https://github.com/YOUR_USERNAME/ecommerce-spa.git
cd ecommerce-spa

2️⃣ Setup Backend
cd server
cp .env.example .env      # configure JWT_SECRET if needed
npm install
npm start                 # starts server on http://localhost:4000

3️⃣ Setup Frontend
cd client
npm install
npm run dev               # starts frontend on http://localhost:5173


Frontend talks to backend via VITE_API_BASE (defaults to http://localhost:4000).

🌐 Deployment
Backend (Render)

Push code to GitHub.

Create new Web Service in Render, point to /server.

Set env vars:

PORT=4000

JWT_SECRET=your_secret

CORS_ORIGIN=https://your-frontend.vercel.app

Frontend (Vercel)

Import project from GitHub.

Set root directory = /client.

Add env var:

VITE_API_BASE=https://your-backend.onrender.com

Deploy — you’ll get a live URL.

📝 API Endpoints
Auth

POST /api/auth/signup → { name, email, password }

POST /api/auth/login → { email, password }

Items

GET /api/items?category=&minPrice=&maxPrice=&q=

POST /api/items

PUT /api/items/:id

DELETE /api/items/:id

Cart (requires login)

GET /api/cart

POST /api/cart → { itemId, qty }

PUT /api/cart/:itemId → { qty }

DELETE /api/cart/:itemId

✅ Submission Checklist

 GitHub repo link → https://github.com/YOUR_USERNAME/ecommerce-spa

 Backend live URL (Render) → https://your-backend.onrender.com

 Frontend live URL (Vercel) → https://your-frontend.vercel.app

 Screenshots of Signup, Login, Listing with filters, Cart page

👤 Author

Your Name (@RamsaiNimmakuru)

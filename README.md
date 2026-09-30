# 🚚 Erode Transport & Logistics Web Application

A production-ready transport booking and shipment tracking full-stack web application built for transport businesses operating from **Erode, Tamil Nadu** across all districts of **Tamil Nadu, Karnataka, and Kerala**.

---

## 🌟 Key Highlights

- **Ultra-Simple Customer Experience**: Designed for non-technical users, mobile-first with touch-friendly controls (≥ 44px), liquid glass aesthetics, and instant calculation.
- **Multilingual Support (i18n)**:
  - 🇬🇧 English
  - 🇮🇳 தமிழ் (Tamil)
  - 🇮🇳 ಕನ್ನಡ (Kannada)
  - 🇮🇳 हिन्दी (Hindi)
  - 🇮🇳 മലയാളം (Malayalam)
- **Dynamic Database-Driven Pricing**: No hardcoded rates. Pricing rules (e.g., Home Shifting @ ₹40/km, Office Shifting @ ₹40/km, Cargo 2.5–5T @ ₹40/km, Cargo 5–10T @ ₹45/km) are loaded dynamically from the database.
- **Historical Price Snapshotting**: Rates, distances, and base amounts are snapshotted on booking creation, guaranteeing historical integrity when owner updates future rates.
- **Strict English Owner Alerts**: Customer emails are localized in their chosen language; Owner alert emails are **strictly English**.
- **Admin Control Center**:
  - Secure JWT authentication in HTTP-only cookies with brute-force rate-limiting.
  - Confirm bookings to issue unique Tracking IDs (`TRP-ERD-2026-XXXXXX`).
  - Assign fleet vehicles & drivers.
  - Update milestone checkpoints (e.g., Vehicle Assigned, In Transit, Delivered).
  - Add additional charges (Loading, Unloading, Tolls, Waiting, Discounts) for final amounts.
  - Manage services and pricing rules dynamically.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, TypeScript, React Server & Client Components)
- **Styling**: Tailwind CSS with custom glassmorphism and modern color palette
- **Database & ORM**: PostgreSQL & Prisma ORM
- **Authentication**: Argon2/Bcrypt password hashing, JOSE JWT in HTTP-only cookies
- **Validation**: Zod schema validation
- **Emails**: Nodemailer with responsive HTML templates and delivery logging
- **Maps**: Google Maps Distance Matrix & Places API with built-in Road Matrix fallback
- **Testing**: Vitest automated test suite

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ or 20+
- PostgreSQL (or local instance)

### 2. Installation
```bash
git clone <repo-url>
cd Transport
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

Key variables in `.env`:
```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="your-ultra-secure-jwt-secret-key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-admin-password"
GOOGLE_MAPS_SERVER_API_KEY="your-google-api-key"
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-app-password"
OWNER_EMAIL="admin@example.com"
```

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to database
npx prisma db push

# Seed Admin user, Services, Pricing Rules, Fleet, and Locations
npx tsx prisma/seed.ts
```

### 5. Running the Application
```bash
# Start development server
npm run dev

# Run production build
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Portal Credentials

- **Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: Defined in your `.env` (`ADMIN_EMAIL`)
- **Password**: Defined in your `.env` (`ADMIN_PASSWORD`)

*(Configured securely via environment variables or in Admin Settings)*

---

## 🧪 Automated Testing

To run the automated unit and integration tests:
```bash
npm run test
```

Test coverage includes:
- Pricing engine & load-range matching
- Additional charges & discount calculation
- Booking number & Tracking ID generators
- Bcrypt password hashing & JWT cookie security
- End-to-end guest booking lifecycle and tracking verification

---

## 🗺️ Google Maps API Setup

To enable real-time Google Distance Matrix & Autocomplete:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable:
   - **Places API**
   - **Distance Matrix API**
   - **Geocoding API**
   - **Maps JavaScript API**
3. Create an API Key, restrict it by HTTP referrers or IP address, and set it in `.env` as `GOOGLE_MAPS_SERVER_API_KEY`.
*(Note: A high-precision verified road network fallback is already built-in and works out-of-the-box without an API key).*

---

## 📧 Email Notification Architecture

- **Guest Booking Submitted**:
  - Customer receives localized confirmation email (Tamil, Kannada, Hindi, Malayalam, or English).
  - Owner receives instant dispatch email in **English only**.
- **Admin Confirms Booking**:
  - Unique Tracking ID (`TRP-ERD-2026-XXXXXX`) generated.
  - Customer receives Confirmation Email with direct Tracking URL.

---

## 📁 Directory Structure

```
Transport/
├── app/
│   ├── api/
│   │   ├── admin/             # Secured Admin APIs (Auth, Bookings, Services, Pricing, Settings)
│   │   ├── bookings/          # Public Guest Booking API
│   │   ├── quote/             # Dynamic Quote Calculation API
│   │   ├── services/          # Active Services & Rules API
│   │   ├── tracking/          # Public Shipment Status API
│   │   └── locations/         # Location Search Autocomplete API
│   ├── admin/                 # Admin Portal Pages (Dashboard, Bookings, Services, Fleet, Settings)
│   ├── contact/               # Contact Page with Call & WhatsApp
│   ├── services/              # Services Showcase Page
│   ├── track/                 # Public Tracking Lookup Page
│   ├── layout.tsx             # Root layout with i18n & SEO
│   └── page.tsx               # Homepage with Hero Calculator
├── components/                # Reusable UI components
├── lib/
│   ├── auth.ts                # Bcrypt, JWT & Rate Limiting
│   ├── dataService.ts         # Prisma data access & fallback store
│   ├── email.ts               # Localized & Owner Email dispatcher
│   ├── googleMaps.ts          # Distance calculation & Road Matrix
│   ├── i18n.tsx               # Multilingual context provider
│   ├── locations.ts           # TN, KA, KL district & pincode dataset
│   └── pricing.ts             # Core pricing calculation engine
├── locales/                   # Translation dictionaries (en, ta, kn, hi, ml)
├── prisma/
│   ├── schema.prisma          # PostgreSQL database schema
│   └── seed.ts                # Database seeder
└── test/                      # Vitest automated test suite
```

---

## ⚖️ License

Private and proprietary. Built for Erode Transport & Logistics.

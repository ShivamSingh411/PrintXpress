# PrintXpress ⚡🖨️

> **Instant Campus Stationery & Document-Printing Platform**  
> Order stationery, upload documents for printing, and get everything delivered to your classroom — or pick it up at the counter.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-optional-3ECF8E?logo=supabase&logoColor=white&style=flat-square)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Local Setup](#installation--local-setup)
- [Configuration](#configuration)
- [Application Routes](#application-routes)
- [Demo Credentials](#demo-credentials)
- [Testing Workflows](#testing-workflows)
- [Supabase Database Schema](#supabase-database-schema)
- [License](#license)

---

## Overview

**PrintXpress** is a full-stack web application that brings quick-commerce convenience to campus reprographics. Students can browse and order stationery, upload documents with custom print settings, select classroom delivery or counter pickup, complete a simulated payment, and track their order in real time.

A separate **Operator Console** allows campus print shop staff to manage incoming orders, update order statuses, inspect print jobs, and configure product inventory and printing rates — all from a role-protected admin dashboard.

---

## Features

### Student-Facing

| Feature | Description |
|---------|-------------|
| 🛍️ **Stationery Shop** | Browse categorised stationery (pens, notebooks, geometry sets, files) with search, filters, and live stock counts |
| 🖨️ **Document Printing Studio** | Upload PDF, DOCX, PPTX, or image files with full print settings: B&W / Color, A4 / A3, single / double-sided, copies, page range, spiral or hardcover binding |
| 🛒 **Shopping Cart** | Add stationery and print jobs to a unified cart with real-time price calculation |
| 🚚 **Smart Delivery Form** | Hierarchical campus location picker (academic buildings, hostels, canteens, sports ground) with contextual fields |
| 💳 **Simulated Payment** | Sandboxed payment — UPI, Card, Net Banking, and 1-click Demo mode. **No real transactions occur.** |
| 📦 **Order Tracking** | Live order status timeline: Requested → Processing → Printing Complete → On the Way → Delivered |
| 🎯 **Status Simulator** | Presentation-mode tool on the tracking page to cycle through statuses for demonstrations |
| 👤 **Student Profile** | View and edit name, phone, department, batch, and saved classroom |
| 🌗 **Light / Dark Theme** | System-aware theme switcher persisted to localStorage |

### Operator Console (/admin)

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Summary statistics — pending orders, completed orders, revenue |
| 📋 **Order Queue** | View all orders, inspect print details, update status (Accept → Mark Printed → Dispatch → Delivered) |
| 🏪 **Product Management** | Add, edit, remove stationery products; adjust per-page printing rates (B&W / Color / A3 / binding) |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **UI Framework** | React 19 + TypeScript 6 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 + Custom CSS variables (light/dark themes) |
| **Routing** | React Router v7 |
| **Icons** | Lucide React |
| **Animations** | canvas-confetti |
| **Backend / Auth / Storage** | Supabase (optional — see Configuration) |
| **Linting** | oxlint |
| **Fonts** | Google Fonts — Plus Jakarta Sans, Space Grotesk |

---

## Project Structure

```
PrintXpress/
├── public/                   # Static assets (favicon, icon sprites)
├── src/
│   ├── assets/               # Images and bundled assets
│   ├── components/
│   │   └── common/           # Navbar, Footer, Logo
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx   # Authentication & demo login
│   │   ├── CartContext.tsx   # Shopping cart state
│   │   ├── OrderContext.tsx  # Order management & localStorage persistence
│   │   └── ThemeContext.tsx  # Light / dark theme
│   ├── data/
│   │   └── mockData.ts       # Default products, print rates, sample orders
│   ├── pages/
│   │   ├── admin/            # Operator Console pages
│   │   ├── CartPage.tsx
│   │   ├── DeliveryPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── OrderTrackingPage.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── PrintPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── StationeryPage.tsx
│   ├── services/
│   │   └── supabase.ts       # Supabase client (gracefully no-ops when unconfigured)
│   ├── types/
│   │   └── index.ts          # Shared TypeScript type definitions
│   ├── App.tsx               # Router & provider tree
│   └── main.tsx              # React entry point
├── supabase/
│   └── schema.sql            # PostgreSQL migration for Supabase projects
├── index.html
├── vite.config.ts
├── tsconfig.json
├── .env.example              # Environment variable names (placeholder values only)
└── package.json
```

---

## Prerequisites

- **Node.js** v18 or higher — https://nodejs.org/
- **npm** v9+ (bundled with Node.js), or yarn / pnpm

---

## Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/PrintXpress.git
cd PrintXpress

# 2. Install dependencies
npm install

# 3. (Optional) Configure environment variables
#    The app works fully without a .env file — see Configuration below.

# 4. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

Other available commands:

```bash
npm run build    # Type-check and build for production (output → dist/)
npm run preview  # Preview the production build locally
npm run lint     # Run oxlint static analysis
```

---

## Configuration

### Running Without Supabase (Local Demo Mode)

**No `.env` file is required.** When Supabase credentials are absent, PrintXpress automatically runs in **Local Demo Mode**:

- All orders, products, and print rates are persisted in browser `localStorage`
- Operator Console changes (product edits, rate updates, status changes) take effect immediately on the student side
- Authentication is handled through built-in demo profiles (see Demo Credentials)

### Connecting to Supabase

To connect a real Supabase backend:

1. Create a project at https://supabase.com
2. Open the SQL Editor in your Supabase dashboard and run `supabase/schema.sql`
3. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Restart the dev server — the app detects the credentials and switches to Supabase mode automatically

> **Never commit `.env`** — it is listed in `.gitignore`. Only commit `.env.example` with placeholder values.

---

## Application Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/stationery` | Public | Stationery catalogue & cart |
| `/print` | Public | Document upload & print studio |
| `/cart` | Public | Shopping cart |
| `/checkout/delivery` | Public | Delivery / pickup selection |
| `/checkout/payment` | Public | Payment (simulated) |
| `/order-success` | Public | Order confirmation |
| `/orders` | Public | My orders list |
| `/orders/:id` | Public | Live order tracking |
| `/profile` | Public | Student profile |
| `/login` | Public | Sign in |
| `/register` | Public | Sign up |
| `/forgot-password` | Public | Password reset |
| `/admin` | **Operator only** | Dashboard summary |
| `/admin/orders` | **Operator only** | Order queue & status management |
| `/admin/products` | **Operator only** | Product & rate management |

---

## Demo Credentials

PrintXpress ships with built-in 1-click demo profiles. Use the **navbar profile menu** or the login page shortcuts to switch instantly — no password required.

### Demo Student
- **Email:** `student@college.edu`
- **Role:** Student — can browse, order, and track orders

### Demo Operator
- **Email:** `admin@printxpress.campus.edu`
- **Staff ID:** `STAFF-PX-01`
- **Role:** Operator — full access to all `/admin` routes

> Click **"Demo Student"** or **"Demo Operator"** on the `/login` page to sign in instantly.

---

## Testing Workflows

### Workflow A — Stationery Order with Classroom Delivery
1. Go to `/stationery` → filter by category → click **Add** on any item
2. Open `/cart` → **Proceed to Select Delivery**
3. Choose **Deliver to Classroom** → pick building, floor, and classroom
4. Continue to Payment → **Complete Demo Payment**
5. Confetti confirmation → click **Track Live Order Status**

### Workflow B — Document Upload & Print Job
1. Go to `/print` → drag-and-drop or select a PDF / DOCX / PPTX / image
2. Set: Color mode (B&W Rs.2/page · Color Rs.10/page), paper size, duplex, copies, page range, binding (Spiral +Rs.35 · Hardcover +Rs.120)
3. Real-time price updates as settings change → **Add to Cart** or **Proceed to Delivery**

### Workflow C — Operator Order Management
1. Sign in as Demo Operator → navigate to `/admin/orders`
2. Accept an order → **Mark Printed** → **Dispatch Runner** → **Delivered**
3. Go to `/admin/products` → edit pricing or add a stationery item — changes apply immediately

### Workflow D — Presentation Status Simulator
1. Open any order tracking page (`/orders/:id`)
2. Use the **Status Simulator** banner at the top to jump to any order status
3. The timeline stepper, timestamps, and icons update live — ideal for project demonstrations

---

## Supabase Database Schema

[`supabase/schema.sql`](supabase/schema.sql) contains a production-ready PostgreSQL migration:

| Table | Purpose |
|-------|---------|
| `profiles` | Linked to `auth.users` — stores name, department, phone, saved classroom |
| `products` | Stationery catalogue with category, price, and stock count |
| `print_rates` | Per-page pricing for B&W, Color, A3, and binding options |
| `orders` | Order records with delivery details, payment status, and timestamps |
| `order_items` | Line items for stationery products and print jobs (includes full settings JSON) |

**Row Level Security (RLS)** is enabled: students can only access their own orders and profiles; operators have elevated access.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with React · TypeScript · Vite · Tailwind CSS

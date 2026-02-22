# Next.js 15 Dashboard Starter

A modern dashboard starter template built with Next.js 15, TypeScript, and Tailwind CSS 4. Perfect for users new to Next.js who want to quickly build rich, interactive dashboards.

## Features

- **Next.js 15** with App Router
- **TypeScript** with strict configuration
- **Tailwind CSS 4** with dark mode support
- **Turbopack** for fast development
- **Geist fonts** optimized with `next/font`
- **ESLint** with Next.js configuration
- **Dashboard-ready** structure and components

## Getting Started

1. Fork this repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to see your dashboard

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/
│   ├── layout.tsx                        # Root layout (fonts, sidebar, theme)
│   ├── page.tsx                          # Home dashboard (KPI cards, charts)
│   ├── globals.css                       # Global styles
│   ├── customers/
│   │   ├── page.tsx                      # Customers table (paginated, keyboard nav)
│   │   └── [id]/orders/
│   │       └── page.tsx                  # Customer order details with items
│   └── api/
│       └── customers/
│           ├── route.ts                  # GET /api/customers (paginated query)
│           └── [id]/orders/
│               └── route.ts             # GET /api/customers/:id/orders
├── components/
│   ├── app-sidebar.tsx                   # Sidebar navigation (Home, Customers)
│   ├── analytics/                        # Dashboard chart components
│   └── ui/                               # shadcn/ui components (Table, Card, Button, etc.)
├── lib/
│   ├── db.ts                             # PostgreSQL connection pool (pg)
│   ├── data.ts                           # Sample data for dashboard charts
│   └── utils.ts                          # Utility functions (cn)
├── public/
│   └── sample_data/                      # CSV files (users, orders, order_items, products)
└── hooks/                                # Custom React hooks
```

## Code Overview

### Database Connection

PostgreSQL connection via `pg` library using `DATABASE_URL` from `.env`. Connects to a Supabase-hosted database with SSL.

### Customers Page (`/customers`)

- Fetches paginated data from `/api/customers` with configurable page size (10/20/50/100)
- Server-side pagination using SQL `LIMIT`/`OFFSET`
- Row selection via mouse click or Arrow Up/Down keyboard navigation
- Double-click or Enter key navigates to the selected customer's orders
- Auto-scrolls selected row into view during keyboard navigation

### Customer Orders Page (`/customers/[id]/orders`)

- Displays all orders for a customer in a table
- Each order's items shown in separate Card components with product name, price, and quantity
- Joins `order_items` with `products` table for product details
- Back button to return to the customers list

### Home Dashboard (`/`)

- KPI summary cards
- Charts: orders over time, traffic sources, top countries, order status, demographics, user registrations

## Building Your Dashboard

1. **Start with the homepage**: Modify `app/page.tsx` to create your main dashboard view
2. **Add new pages**: Create folders in `/app` (e.g., `/app/analytics/page.tsx`)
3. **Create components**: Add reusable components to `/components`
4. **Style with Tailwind**: Use utility classes and dark mode variants

## Live Coding with Claude Code

This template is optimized for pair programming with [Claude Code](https://claude.ai/code):

- Small, focused components for easy iteration
- TypeScript interfaces for clear data structures
- Tailwind utilities for rapid styling
- Hot reload for immediate feedback

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/docs) - Typed JavaScript

## Deploy on Squadbase

Click the button to clone this repository and deploy it on Squadbase.

[![Deploy to Squadbase](https://app.squadbase.dev/button.svg)](https://app.squadbase.dev/new/clone?repository-url=https://github.com/squadbase/nextjs-dashboard-starter.git)

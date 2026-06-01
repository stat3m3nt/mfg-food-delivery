# MFG — Mama's Fried Goods 🔥

> A full-stack food delivery ordering platform built for a real UK food business.

**Live Demo:** [mfg-food-delivery.vercel.app](https://mfg-food-delivery.vercel.app)

---

## Overview

MFG (Mama's Fried Goods) is a food delivery web application built for a London-based food business specialising in Nigerian cuisine and diverse comfort food. The platform allows customers to browse a rotating menu, add items to a cart, and complete payments online — while giving the business owner full control over the menu without touching any code.

---

## Features

- 🍽️ **Dynamic rotating menu** — powered by Sanity CMS, the owner adds/removes dishes instantly with no code changes required
- 🛒 **Persistent cart** — client-side cart with localStorage persistence survives page refreshes
- 💳 **Stripe payments** — full UK card payment support with hosted checkout
- 📦 **Order management** — orders saved to PostgreSQL via Supabase with real-time admin dashboard
- 📧 **Automated emails** — customer confirmation and owner notification emails via Resend
- 👩‍🍳 **Admin dashboard** — secret-protected order management page for the business owner
- 🏷️ **Dietary tags** — Halal, Vegan, Vegetarian, Gluten Free, Spicy, Contains Nuts
- ⭐ **Chef's Special** — featured dish highlighting system
- 📱 **Fully responsive** — mobile-first design

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend & API | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| CMS | Sanity.io |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe Checkout |
| Email | Resend |
| State Management | Zustand (with localStorage persistence) |
| Form Validation | React Hook Form + Zod |
| Deployment | Vercel |

---

## Architecture

```
Customer Browser
      │
      ▼
  Next.js (Vercel)
  ├── /app/page.tsx              → Menu page (ISR from Sanity, revalidates every 60s)
  ├── /app/checkout/page.tsx     → Checkout form (zod validation)
  ├── /app/order-confirmation/   → Post-payment success page
  ├── /app/admin/                → Owner order dashboard (secret protected)
  └── /app/api/
      ├── /checkout/route.ts     → Creates Stripe checkout session
      └── /webhook/route.ts      → Stripe webhook → saves order → sends emails
          │
          ├── Sanity CMS ──────── Owner manages menu here
          ├── Supabase DB ─────── Orders stored here
          ├── Stripe ──────────── Payments processed here
          └── Resend ──────────── Emails sent from here
```

---

## Local Development

### Prerequisites
- Node.js v20.19.1+
- A Sanity account
- A Supabase account
- A Stripe account (test mode)
- A Resend account

### Setup

```bash
# Clone the repository
git clone https://github.com/stat3m3nt/mfg-food-delivery.git
cd mfg-food-delivery

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in .env.local with your keys (see .env.example for required variables)

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the customer-facing site.

### Running Sanity Studio

```bash
cd studio
npm install
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) to manage the menu.

### Testing Stripe Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhook
```

Use test card `4242 4242 4242 4242` with any future expiry and CVC.

---

## Database Schema

```sql
CREATE TABLE orders (
  id                UUID PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  customer_name     TEXT NOT NULL,
  customer_email    TEXT NOT NULL,
  customer_phone    TEXT,
  delivery_address  JSONB NOT NULL,
  items             JSONB NOT NULL,
  subtotal          INTEGER NOT NULL,  -- stored in pence
  delivery_fee      INTEGER NOT NULL,
  total             INTEGER NOT NULL,
  status            TEXT DEFAULT 'confirmed',
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

All monetary values are stored in pence to avoid floating point precision issues.

---

## Key Technical Decisions

**Why Next.js App Router?**
Server components allow menu data to be fetched at request time from Sanity without client-side loading states, improving perceived performance and SEO.

**Why Sanity CMS for the menu?**
The client's menu rotates frequently. Sanity gives the owner a clean, non-technical dashboard to manage dishes independently. ISR (Incremental Static Regeneration) with a 60-second revalidation window means new dishes appear quickly without full rebuilds.

**Why store prices in pence?**
Floating point arithmetic in JavaScript means `0.1 + 0.2 !== 0.3`. Storing all monetary values as integers (pence) and converting only for display eliminates this class of bugs entirely — the same approach used by Stripe.

**Why Stripe webhooks instead of redirect-based confirmation?**
Webhooks are more reliable — a customer could close their browser after payment before reaching the success page. The webhook fires server-side regardless, ensuring every successful payment is captured.

---

## Environment Variables

See `.env.example` for all required variables. Never commit `.env.local`.

---

## Deployment

The project is deployed on Vercel with automatic deployments on every push to `main`. Environment variables are configured in the Vercel dashboard.

After deployment, register the webhook endpoint in the Stripe dashboard:
- URL: `https://your-domain.vercel.app/api/webhook`
- Events: `checkout.session.completed`

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Menu page (Server Component)
│   ├── checkout/page.tsx        # Checkout page
│   ├── order-confirmation/      # Success page
│   ├── admin/page.tsx           # Owner dashboard
│   └── api/
│       ├── checkout/route.ts    # Stripe session creation
│       └── webhook/route.ts     # Stripe webhook handler
├── components/
│   ├── layout/                  # Navbar, Footer
│   ├── menu/                    # MenuSection, DishCard, DietaryBadge
│   ├── cart/                    # CartDrawer, CartItem, CartButton
│   └── checkout/                # CheckoutForm, OrderSummary
├── lib/
│   ├── sanity/                  # Sanity client, queries, image helper
│   ├── supabase/                # Browser and server Supabase clients
│   ├── stripe.ts                # Stripe server client
│   └── email.ts                 # Resend email functions
├── store/
│   └── cartStore.ts             # Zustand cart state
├── types/
│   ├── menu.ts                  # Dish, MenuCategory types
│   └── order.ts                 # Order, OrderItem types
└── utils/
    ├── formatPrice.ts           # GBP formatting, pence conversion
    └── cn.ts                    # Tailwind class merge utility
```

---

## Licence

MIT
# MediStock — Healthcare Supply & Inventory Management Platform

> **Live Production Build**: Fully implemented based on `Requirments.md` and designed pixel-to-pixel identical to `Project.png`.

---

## 1. Visual Templates Map (`Project.png`)

All 9 primary screens from `Project.png` have been faithfully created and fully functional:

| # | Screen in `Project.png` | Role / Purpose | Route / View |
|---|---|---|---|
| **1** | **Homepage (Public)** | Public Visitor | `Home` (`/`) |
| **2** | **Product Catalog / Search & Filter** | Public & Healthcare Facilities | `Products` |
| **3** | **User Dashboard (Normal User)** | Normal User (`Rahim Ahmed`) | `User Portal` |
| **4** | **Organization Registration** | Hospital / Pharmacy / Clinic | `Register Org` |
| **5** | **Organization Dashboard (Approved)** | Hospital B2B (`City Hospital`) | `Hospital Portal` |
| **6** | **Admin Dashboard** | System Administrator | `Admin Panel` |
| **7** | **Owner Dashboard** | Super Admin / Governance | `Owner Panel` |
| **8** | **Blood Donation** | Volunteer Donors & Emergency Seekers | `Blood Donation` |
| **9** | **Order Details / Invoice (Example)** | Hospital & Admin Orders | `Order #ORD-0124` |

---

## 2. Technology Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS + Custom MediStock Healthcare Design System
- **Build Tool:** Vite 6
- **Icons:** Lucide React
- **Database & Backend:** Supabase (PostgreSQL, Row Level Security, Storage & Auth) + Resilient Client Layer
- **State Management:** Reactive Store with Persistent Storage (`localStorage` fallback)

---

## 3. Demo Roles & Instant Persona Switcher

You can switch between any of the 4 roles at any time using the **top sandbox switcher bar** or the **user profile dropdown**:

1. **Normal User (Rahim Ahmed):**
   - Browse public medical catalog.
   - Access Blood Donation system, register as donor, toggle availability.
   - Post emergency blood requests.
2. **Organization User (City Hospital - Approved):**
   - Overview stats: Total Orders (12), Pending Orders (3), Total Spent (৳ 24,580).
   - Add medicines to restocking cart and submit B2B supply orders.
   - Open any order to inspect or print official invoices (#ORD-0124) with 4-stage timeline.
   - Submit special supply demand requests for unlisted medicines.
3. **Admin Panel Staff:**
   - Central overview: 28 Organizations, 124 Orders, 5 Pending Approvals, 8 Product Requests.
   - Review pending hospital/pharmacy applications and approve/reject with notes.
   - Add new products, configure SKU, manufacturer, price in BDT (৳), batch number, and expiry date.
   - Adjust stock quantities inline (-50, +100).
   - Update order status: Pending ➔ Confirmed ➔ Processing ➔ Shipped ➔ Delivered ➔ Cancelled.
   - 1-Click Download complete CSV report.
4. **Owner / Super Admin:**
   - Platform Revenue (৳ 86,420), 156 Users, 42 Organizations, 348 Total Orders.
   - Interactive Platform Statistics wave chart (Orders vs Revenue - 7 days).
   - Only Owner can promote eligible users to Admin or demote Admins.
   - View complete system audit trail and activity logs.

---

## 4. Getting Started

### Prerequisites:
- Node.js v18+ or v20+ or v24+
- npm v9+

### Installation & Run:

```bash
# 1. Clone repository
git clone <repo-url>
cd Software-Dev-project2

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build:

```bash
npm run build
npm run preview
```

---

## 5. Supabase PostgreSQL Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy and run the SQL code from [`supabase/schema.sql`](supabase/schema.sql).
4. Copy `.env.example` to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Restart your dev server (`npm run dev`). MediStock will automatically sync with your Supabase database!

---

## 6. Project Directory Structure

```
├── public/                     # Public assets
├── src/
│   ├── components/
│   │   ├── admin/             # Screen 6: Admin Dashboard & Modals
│   │   ├── blood/             # Screen 8: Blood Donation, Requests, Donors
│   │   ├── catalog/           # Screen 2: 14 Categories, Mask Banner, Product Grid
│   │   ├── common/            # Navbar, Footer, Modals (Login, Cart, Details)
│   │   ├── dashboard/         # Screen 3: Normal User Dashboard (Rahim Ahmed)
│   │   ├── home/              # Screen 1: Homepage (Doctor hero, quick cards, categories)
│   │   ├── invoice/           # Screen 9: Order Details / Invoice & Timeline
│   │   ├── organization/      # Screen 4 & 5: Multi-step Reg & Approved Org Portal
│   │   └── owner/             # Screen 7: Owner Dashboard, Stats Wave Chart & RBAC
│   ├── data/
│   │   ├── mockData.ts        # Seed data matching Project.png 100%
│   │   └── store.ts           # Central reactive state & CRUD layer
│   ├── supabase/
│   │   └── client.ts          # Supabase client wrapper & health check
│   ├── types/
│   │   └── index.ts           # Complete TypeScript domain definitions
│   ├── App.tsx                # Universal route & view orchestrator
│   ├── index.css              # Tailwind & print invoice styles
│   └── main.tsx               # React 19 entry point
├── supabase/
│   └── schema.sql             # Full PostgreSQL schema with RLS & Seed
├── Project.png                # Original design template
├── Requirments.md             # Functional requirements
└── package.json
```

---

## 7. License

MediStock Platform © 2026. Built according to DGHS healthcare compliance guidelines.


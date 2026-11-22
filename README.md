# FixMate - Smart Device & Home Appliance Repair Service Platform

FixMate is a full-stack, role-based repair booking platform. Verified technicians list repair services (smartphone, laptop, AC, refrigerator, TV, washing machine, electrical). Customers browse services, send repair requests, track every job step by step and pay online only after the job is completed. Admins approve services, manage users and monitor all jobs and revenue.

**Purpose:** Customers can not trust or track a repair job, and technicians have no structured place to list services and manage jobs. FixMate gives every job a clear status and takes payment only after the work is delivered.

## Live Links

- Live site: https://fixmate-client-two.vercel.app
- Server API: https://fixmate-server-gamma.vercel.app
- Client repository: https://github.com/fahmidulparvezt-pixel/fixmate-client
- Server repository: https://github.com/fahmidulparvezt-pixel/fixmate-server

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@fixmate.com | Admin123 |
| Technician | rahim@fixmate.com | Tech1234 |
| Technician | sumaiya@fixmate.com | Tech1234 |
| Customer | nusrat@fixmate.com | Customer123 |
| Customer | tanvir@fixmate.com | Customer123 |

Stripe test card: `4242 4242 4242 4242`, any future expiry date, any CVC.

## Key Features

- Role-based accounts (Customer, Technician, Admin) with BetterAuth. Admin can not be chosen at sign up.
- Sign up validation: required fields, email format, password with 6+ characters, uppercase and lowercase letters.
- Public pages: Home (hero, latest services, how it works, categories, why choose us), Browse Services, Service Details, How It Works.
- Server-side search, category and service mode filters and sorting. Filters live in the URL and survive reloads.
- Repair request flow with role restrictions, date and problem validation and duplicate active request prevention.
- Job status pipeline: Requested, Accepted, In Progress, Completed (or Rejected / Cancelled), enforced on the server.
- Stripe Checkout (test mode), pay-after-completion, success and cancel pages, idempotent webhook so a payment is never saved twice.
- Technician dashboard: overview chart, add service with ImgBB upload, full CRUD, availability toggle, request management with final amount.
- Customer dashboard: overview chart, bookings with cancel confirmation and Pay Now, payment history.
- Admin dashboard: overview with revenue chart, service approval, user roles, all bookings, transactions.
- JWT verification and role-based Express middlewares (401 / 403) with ownership checks.
- Responsive UI, collapsible dashboard sidebar, loading skeletons, custom 404 and error pages, toasts, empty states, confirmation modals.
- Protected routes that keep logged-in users signed in on reload.

## Tech Stack

Next.js (App Router), React, Tailwind CSS, BetterAuth (MongoDB adapter, JWT plugin), Express.js, MongoDB, Stripe, ImgBB.

## npm Packages

`next`, `react`, `react-dom`, `better-auth`, `mongodb`, `sonner`, `recharts`, `lucide-react`, `react-icons`, `tailwindcss`, `@tailwindcss/postcss`

## Environment Variables (`.env.local`)

```
MONGODB_URI=
DB_NAME=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
```

## Run Locally

```bash
npm install
npm run dev
```
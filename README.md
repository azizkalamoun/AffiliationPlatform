# Affiliation Platform

Multi-role affiliate marketing platform built with Next.js (frontend) and Express.js (backend). Administrators manage companies, URLs, and banners; affiliates promote links and earn commissions on clicks and subscriptions through a tracked referral system.

---

## Architecture Overview

The application follows a **decoupled two-tier architecture** with a standalone Express.js API server and a Next.js frontend consuming it over HTTP.

```
┌─────────────────────┐      HTTP/JSON       ┌─────────────────────┐
│   Next.js 14 App    │ ◄──────────────────► │   Express.js API    │
│   (Port 3000)       │    CORS (origin: *)   │   (Port 3307)       │
│                     │                       │                     │
│  Browser-rendered   │                       │  MySQL (Sequelize)  │
│  Client Components  │                       │  Nodemailer         │
│  React Query cache  │                       │  Swagger docs       │
└─────────────────────┘                       └─────────────────────┘
```

- **Next.js** serves purely as a frontend SPA. All pages use the `"use client"` directive; there are no Server Components, Server Actions, or Route Handlers. It runs on `localhost:3000` during development.
- **Express.js** is a standalone REST API server, not a custom Next.js server. It runs on `localhost:3307` and is mounted under the `/api` prefix. It handles all business logic, authentication, database access, and email dispatch.
- **Data flow**: the browser loads Next.js pages, which call the Express API via Axios. The API is exposed with `CORS origin: *` and `credentials: true`.

---

## Key Features

- **Role-based dashboards**: three distinct portals — Affiliate, Secretary, Admin — each with role-scoped navigation and permissions.
- **Affiliate registration with referral tracking**: new users can register with a `?ref=<affiliateId>` query parameter; the backend records a subscription linking the new user to the referring affiliate.
- **Click tracking**: a middleware on `GET /register` records unique clicks (by IP + URL + affiliate) for each affiliate link visit.
- **Bulk approval workflow**: administrators and secretaries can approve or deny affiliate registration requests and promotion (affiliate–URL pair) requests in batches.
- **Banner management**: secretaries and admins can upload banners (stored in Firebase Storage) and associate them with company URLs. Affiliates can consult banners for their approved links.
- **Password reset flow**: forgot-password and reset-password endpoints use JWT-based reset tokens delivered via Gmail SMTP (Nodemailer).
- **Dashboard analytics**: per-role dashboards display counts for affiliates, clicks, subscriptions, and advertised URLs, with month-over-month percentage change.
- **Feedback submission**: affiliates can submit feedback; secretaries and admins can review and delete it.

---

## Demo

https://github.com/user-attachments/assets/383ecea0-66f1-448e-9998-0153f061f1d2

## Backend Design (Express.js)

### Route Structure

All API routes are prefixed with `/api` (configured in `src/index.ts`). Route files are registered in `src/routes/index.ts`:

| Route file | Endpoints | Auth required |
|---|---|---|
| [`user.ts`](affiliation_platform_backend/src/routes/user.ts) | `POST /register`, `GET /register`, `POST /login`, `POST /forgot-password`, `PUT /reset-password`, `GET /users`, `GET /users/:id`, `PUT /users/:id/edit`, `DELETE /users/:id/delete`, `POST /register-me`, `POST /users/approve-registration`, `POST /users/deny-registration` | Partial |
| [`url.ts`](affiliation_platform_backend/src/routes/url.ts) | `GET /urls`, `POST /urls/new`, `GET /urls/:id`, `PUT /urls/:id/edit`, `DELETE /urls/:id/delete` | All |
| [`affiliateUrl.ts`](affiliation_platform_backend/src/routes/affiliateUrl.ts) | `GET /affiliate-urls`, `GET /affiliate-my-urls`, `POST /affiliate-urls/new`, `GET /affiliate-urls/:affiliate_id/:url_id`, `DELETE /affiliate-urls/:affiliate_id/:url_id/delete`, `PATCH /affiliate-urls/approve`, `PATCH /affiliate-urls/deny` | All |
| [`banner.ts`](affiliation_platform_backend/src/routes/banner.ts) | `POST /banners/new`, `GET /banners`, `GET /banners/:id`, `GET /banners/url/:urlId`, `DELETE /banners/:id/delete` | All |
| [`click.ts`](affiliation_platform_backend/src/routes/click.ts) | `GET /clicks`, `POST /clicks/new`, `GET /clicks/:id`, `DELETE /clicks/:id/delete` | All |
| [`dashboard.ts`](affiliation_platform_backend/src/routes/dashboard.ts) | `GET /dashboard/affiliate-count`, `GET /dashboard/latest-users`, `GET /dashboard/latest-subscriptions`, `GET /dashboard/affiliate-clicks-by-url`, `GET /dashboard/affiliate-subscriptions-by-url`, `GET /dashboard/affiliate-advertised-urls` | All |
| [`feedback.ts`](affiliation_platform_backend/src/routes/feedback.ts) | `POST /feedbacks/new`, `GET /feedbacks`, `GET /feedbacks/:id`, `DELETE /feedbacks/:id/delete` | All |
| [`subscription.ts`](affiliation_platform_backend/src/routes/subscription.ts) | `GET /subscriptions`, `GET /subscriptions/:id`, `DELETE /subscriptions/:id` | All |

### Controllers and Services

Controllers at [`src/controllers/`](affiliation_platform_backend/src/controllers/) handle HTTP request parsing and response formatting. Business logic lives in services at [`src/services/`](affiliation_platform_backend/src/services/). This is a thin-controller, fat-service pattern.

### Middleware

- **`authenticateToken`** ([`middleware/authMiddleware.ts`](affiliation_platform_backend/src/middleware/authMiddleware.ts)): validates `Authorization: Bearer <token>` by verifying the access JWT. Returns `401` if missing, `403` if invalid.
- **`permission(requiredRole[])`**: a higher-order middleware that checks `decodedToken.role` against an allowlist. Used like `permission(["admin", "secretary"])`.
- **`createClickMiddleware`** ([`middleware/createClickMiddleware.ts`](affiliation_platform_backend/src/middleware/createClickMiddleware.ts)): extracts `?ref` from the query, resolves the base URL to a `urlId`, and records a unique click (deduplicated by IP + URL + affiliate). Calls `next()` after execution, so it acts transparently.

### Authentication and Authorization

- **JWT-based** using the `jsonwebtoken` library.
- Three token types, each with its own secret from `.env`:
  - **Access token** (`ACCESS_TOKEN_SECRET`, 86,000 s expiry) — carries `{ id, role }` and is sent on every authenticated request.
  - **Refresh token** (`REFRESH_TOKEN_SECRET`, no expiry) — used by the `refreshToken` endpoint to mint new access tokens.
  - **Reset token** (`RESET_TOKEN_SECRET`, 86,000 s expiry) — used for password reset flow.
- Roles: `affiliate`, `secretary`, `admin`.

### Validation

Request validation is **manual** — controllers check for required fields with `if (!email || !password)` patterns and return `400` responses. There is no schema-based validation library (e.g., Joi, Zod on the backend).

### Error Handling

Consistent try/catch pattern across all controllers. Errors return `{ success: false, message: error.message }` with HTTP 500. Some endpoints log errors with `console.error`. There is no centralized error-handling middleware.

### Database Access Layer

- **ORM**: [Sequelize](https://sequelize.org/) v6 with [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript) decorators.
- **Dialect**: MySQL via the `mysql2` driver (SQLite3 is listed as a dependency but unused in the model configuration).
- **Models**: `User`, `Url`, `AffiliateUrl` (junction table with status), `Click`, `Subscription`, `Banner`, `Feedback`, `Earning`. All use UUID primary keys with `DataType.UUIDV4`.
- **Relationships**: belong-to-many (User ↔ Url through AffiliateUrl), has-many, belongs-to.
- **Sync**: `connection.sync({ force: false, alter: true })` runs on startup, which auto-applies schema changes to MySQL.
- **Seeding**: Earnings table is upserted on startup with default amounts (`subscription: $2.00`, `click: $0.50`).

### Logging

Only `console.log` / `console.error` statements — no structured logging library.

### Security

- **CORS**: configured with `origin: "*"` and `credentials: true` in `src/index.ts`.
- **Helmet**: not used.
- **Rate limiting**: not implemented.
- **Password hashing**: bcrypt with 10 salt rounds.

### API Documentation

[Swagger](https://swagger.io/) (OpenAPI) is configured via `swagger-jsdoc` and served at `/api-docs` using `swagger-ui-express`. Route-level JSDoc annotations would be parsed from `src/routes/*.ts` files.

---

## Frontend Design (Next.js)

### Router

**App Router** (Next.js 14.1.3). The directory tree under `src/app/` maps directly to URL paths:

```
src/app/
├── login/
├── register/
├── forgot-password/
├── reset-password/
├── affiliate/
│   ├── dashboard/
│   ├── links/
│   ├── mylinks/
│   └── subscriptions/
├── secretary/
│   ├── dashboard/
│   ├── affiliates/
│   ├── registration-requests/
│   ├── links/
│   ├── subscriptions/
│   ├── feedbacks/
│   └── banners/
├── admin/
│   ├── dashboard/
│   ├── affiliates/
│   ├── secretaries/
│   ├── administrators/
│   ├── registration-requests/
│   ├── waiting-list/
│   ├── promotion-requests/
│   ├── links/
│   ├── subscriptions/
│   ├── feedbacks/
│   └── banners/
├── layout.tsx
├── page.tsx            (redirects to /login)
├── not-found.tsx
└── providers.tsx
```

### Server Components vs Client Components

Every functional page and layout includes `"use client"` at the top — the application is entirely client-rendered. The only Server Components are the root `layout.tsx` (which wraps children in `<Providers>`) and the root `page.tsx` (which does a server-side redirect).

### Data Fetching

All data fetching happens on the client via [TanStack React Query](https://tanstack.com/query/latest) v5. Each service file exports:
- A **query function** (e.g., `fetchAllUsers`) that calls the Axios instance.
- A **custom hook** (e.g., `useFetchAllUsersQuery`) wrapping `useQuery`.

Mutations use `useMutation` wrapped similarly. This gives the app automatic caching, background refetching, and request deduplication.

The Axios instance at [`src/api/index.ts`](affiliation_platform_frontend/src/api/index.ts) is configured with `baseURL` from `NEXT_PUBLIC_API_URL` and attaches the Bearer token from `localStorage.getItem("accessToken")` on every request.

### State Management

- **Server state**: TanStack React Query.
- **Auth state**: access/refresh tokens stored in both `localStorage` and a cookie (`authTokens`). The cookie is read by Next.js Middleware for route protection.
- **UI state**: React `useState` / `useContext` (search context in layouts).

### Middleware

[`src/middleware.ts`](affiliation_platform_frontend/src/middleware.ts) is a Next.js Edge Middleware that:
1. Decodes the JWT from the `authTokens` cookie.
2. Checks expiry with `dayjs`.
3. Redirects unauthenticated users to `/login` when accessing protected routes.
4. Redirects authenticated users to their role-specific dashboard when accessing login pages.
5. Enforces role-based route access (affiliate cannot access `/admin/*`, etc.).

### Routing Protection

Three route categories are defined in the middleware:
- **Affiliate routes**: `/affiliate/dashboard`, `/affiliate/links`, `/affiliate/mylinks`, `/affiliate/subscriptions`
- **Secretary routes**: `/secretary/dashboard`, `/secretary/affiliates`, `/secretary/registration-requests`, `/secretary/links`, `/secretary/subscriptions`, `/secretary/feedbacks`, `/secretary/banners`
- **Admin routes**: `/admin/dashboard`, `/admin/affiliates`, `/admin/secretaries`, `/admin/administrators`, `/admin/registration-requests`, `/admin/links`, `/admin/subscriptions`, `/admin/feedbacks`, `/admin/banners`, `/admin/waiting-list`, `/admin/promotion-requests`

### UI Composition

- **Component library**: [shadcn/ui](https://ui.shadcn.com/) (Radix primitives + Tailwind CSS).
- **Icons**: Lucide React, Tabler Icons, Font Awesome.
- **Charts**: Chart.js, Recharts, ApexCharts with React bindings.
- **Forms**: React Hook Form with Zod resolvers for schema validation.
- **Layout**: role-based sidebar with collapsible navigation groups ("Marketing Tools", "User Management").
- **Styling**: Tailwind CSS with CSS variables for theming.

### Performance Optimizations

- React Query's `staleTime: 60 * 1000` (1 minute) in the default query client reduces redundant network requests.
- No ISR, SSG, or streaming — all pages are fully client-side rendered.

### SEO and Metadata

Minimal — the root layout sets a static `<title>Affiliation Platform</title>`. There is no per-page metadata generation.

---

## API Design and Data Flow

### How Next.js Consumes the API

1. The browser loads a Next.js page (e.g., `/admin/dashboard`).
2. The page is a Client Component; on mount, a custom React Query hook fires.
3. The query function calls the Axios instance (`src/api/index.ts`), which:
   - Reads `NEXT_PUBLIC_API_URL` (default `http://localhost:3307/api`).
   - Attaches `Authorization: Bearer <token>` from `localStorage`.
4. Express receives the request at `http://localhost:3307/api/<endpoint>`.
5. The response flows back as JSON.

### Authentication Flow

1. User submits credentials to `POST /api/login`.
2. Backend verifies password with bcrypt, checks affiliate status (`waiting list` / `denied` blocks login).
3. On success, returns `{ accessToken, refreshToken, role }`.
4. Frontend stores tokens in `localStorage` and in a cookie `authTokens` (30-day expiry, `SameSite: Strict`).
5. Next.js Middleware reads the cookie on every navigation to enforce route protection.
6. When the access token expires, the backend returns `401`. The frontend currently has a no-op handler in the Axios response interceptor (intended for refresh logic but not implemented).

### Response Structure

Most endpoints follow:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "Human-readable error" }
```

Some endpoints (login, dashboard counts) use a flat structure.

### CORS Configuration

```ts
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true
}
```

The wildcard origin combined with `credentials: true` is a known browser restriction — the frontend is expected to be accessed from a single origin in production.

---

## Technologies and Dependencies

### Backend (`affiliation_platform_backend/package.json`)

| Dependency | Version | Purpose |
|---|---|---|
| [express](https://expressjs.com/) | ^4.18.2 | HTTP server and routing |
| [sequelize](https://sequelize.org/) | ^6.35.2 | ORM for MySQL |
| [sequelize-typescript](https://www.npmjs.com/package/sequelize-typescript) | ^2.1.6 | TypeScript decorators for Sequelize models |
| [mysql2](https://github.com/sidorares/node-mysql2) | ^3.7.0 | MySQL database driver |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | ^9.0.2 | JWT creation and verification |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | ^5.1.1 | Password hashing |
| [cors](https://github.com/expressjs/cors) | ^2.8.5 | Cross-Origin Resource Sharing |
| [nodemailer](https://nodemailer.com/) | ^6.9.13 | Email transport (Gmail SMTP) |
| [dotenv](https://github.com/motdotla/dotenv) | ^16.3.1 | Environment variable loading |
| [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) | ^6.2.8 | OpenAPI spec generation |
| [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) | ^5.0.0 | Swagger UI serving |
| moment | ^2.29.4 | Date manipulation (dashboard queries) |

### Frontend (`affiliation_platform_frontend/package.json`)

| Dependency | Version | Purpose |
|---|---|---|
| [next](https://nextjs.org/) | 14.1.3 | React framework (App Router) |
| [react](https://react.dev/) / [react-dom](https://react.dev/) | ^18 | UI library |
| [@tanstack/react-query](https://tanstack.com/query/latest) | ^5.37.1 | Server state management, caching, data fetching |
| [axios](https://axios-http.com/) | ^1.6.7 | HTTP client with interceptors |
| [zod](https://zod.dev/) | ^3.23.8 | Schema validation for forms |
| [react-hook-form](https://react-hook-form.com/) | ^7.51.5 | Form state management |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | ^3.4.2 | Zod integration for react-hook-form |
| [cookies-next](https://github.com/andreizanik/cookies-next) | ^4.2.1 | Cookie read/write in client and server |
| [jwt-decode](https://github.com/auth0/jwt-decode) | ^4.0.0 | JWT payload decoding (middleware) |
| [dayjs](https://day.js.org/) | ^1.11.11 | Token expiry comparison |
| [firebase](https://firebase.google.com/) | ^10.12.2 | Firebase Storage (banner image uploads) |
| [tailwindcss](https://tailwindcss.com/) | ^3.3.0 | Utility-first CSS framework |
| [class-variance-authority](https://cva.style/) | ^0.7.0 | Component variant management |
| [clsx](https://github.com/lukeed/clsx) | ^2.1.0 | Conditional class name merging |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | ^2.2.2 | Tailwind class conflict resolution |
| [lucide-react](https://lucide.dev/) | ^0.364.0 | Icon set |
| [@tabler/icons-react](https://tabler-icons.io/) | ^3.5.0 | Icon set |
| [apexcharts](https://apexcharts.com/) / [react-apexcharts](https://github.com/apexcharts/react-apexcharts) | ^3.49.1 / ^1.4.1 | Charting library |
| [recharts](https://recharts.org/) | ^2.12.7 | Charting library |
| [chart.js](https://www.chartjs.org/) | ^4.4.3 | Charting library |
| [date-fns](https://date-fns.org/) | ^3.6.0 | Date utilities |
| [shadcn/ui](https://ui.shadcn.com/) (via components.json) | — | Component primitives (Radix + Tailwind) |

---

## Notable Implementation Techniques

- **Click tracking middleware**: `createClickMiddleware` on `GET /register` intercepts the request, resolves the `?ref` affiliate and base URL, inserts a click record with IP address, then calls `next()` — keeping tracking transparent to the route handler.
- **Referral subscription on registration**: when a new user registers with `?ref=<affiliateId>`, the backend creates a `Subscription` record linking the new user (as `subId`), the referring affiliate, and the URL derived from the `baseUrl` body field.
- **Affiliate–URL junction with approval workflow**: the `AffiliateUrl` many-to-many junction table has a `status` column (`pending` / `approved` / `denied`). Frontend forms submit requests; admins approve/deny in batches via `PATCH /affiliate-urls/approve` and `PATCH /affiliate-urls/deny`.
- **Next.js Middleware role guard**: a single Edge Middleware file handles authentication, token expiry, and role-based route access without any backend call — it decodes the JWT cookie directly.
- **React Query custom hooks per resource**: every API resource has a dedicated React Query hook (`useFetchAllUrlsQuery`, `useApproveRegistrationMutation`, etc.), following a consistent `queryKey` + `queryFn` pattern.
- **Firebase Storage for banners**: banner images are uploaded directly from the browser to Firebase Storage via `uploadBytesResumable`; the returned download URL is then persisted to the `banners` table via the Express API.

---

## Project Structure

```
AffiliationPlatform/
├── affiliation_platform_backend/          # Express.js API server
│   ├── src/
│   │   ├── index.ts                       # App entry point, Express setup, CORS, DB sync
│   │   ├── swagger.ts                     # Swagger/OpenAPI configuration
│   │   ├── controllers/                   # Request handlers
│   │   │   ├── user.ts                    # Login, register, CRUD, approve/deny
│   │   │   ├── url.ts                     # URL CRUD
│   │   │   ├── affiliateUrl.ts            # Affiliate-URL relationship management
│   │   │   ├── banner.ts                  # Banner CRUD
│   │   │   ├── click.ts                   # Click CRUD
│   │   │   ├── dashboard.ts              # Aggregated statistics
│   │   │   ├── feedback.ts               # Feedback CRUD
│   │   │   └── subscription.ts           # Subscription CRUD
│   │   ├── services/                      # Business logic layer
│   │   │   ├── auth.ts                    # JWT generation, verification, email dispatch
│   │   │   ├── user.ts                    # User queries, password update
│   │   │   ├── url.ts                     # URL queries, advertised URL fetch
│   │   │   ├── affiliateUrl.ts            # Affiliate-URL approve/deny logic
│   │   │   ├── banner.ts                  # Banner queries
│   │   │   ├── click.ts                   # Click queries
│   │   │   ├── earning.ts                 # Earning amount lookup
│   │   │   ├── feedback.ts               # Feedback queries
│   │   │   └── subscription.ts           # Subscription queries
│   │   ├── middleware/                    # Express middleware
│   │   │   ├── authMiddleware.ts          # JWT auth + role-based permission guard
│   │   │   └── createClickMiddleware.ts   # Click tracking on registration page
│   │   ├── models/                        # Sequelize model definitions
│   │   │   ├── index.ts                   # Sequelize connection, earnings seeding
│   │   │   ├── user.model.ts
│   │   │   ├── url.model.ts
│   │   │   ├── affiliateUrl.model.ts
│   │   │   ├── banner.model.ts
│   │   │   ├── click.model.ts
│   │   │   ├── earning.model.ts
│   │   │   ├── feedback.model.ts
│   │   │   └── subscription.model.ts
│   │   ├── routes/                        # Express route definitions
│   │   │   ├── index.ts                   # Router aggregator
│   │   │   ├── user.ts
│   │   │   ├── url.ts
│   │   │   ├── affiliateUrl.ts
│   │   │   ├── banner.ts
│   │   │   ├── click.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── feedback.ts
│   │   │   └── subscription.ts
│   │   └── types/                         # TypeScript type definitions
│   │       ├── index.ts
│   │       ├── affiliateUrl.ts
│   │       ├── banner.ts
│   │       ├── click.ts
│   │       ├── earning.ts
│   │       ├── feedback.ts
│   │       ├── subscription.ts
│   │       ├── url.ts
│   │       └── user.ts
│   ├── .env                               # Environment variables (secrets, DB config)
│   ├── .eslintrc
│   ├── .prettierrc.json
│   ├── nodemon.json
│   ├── package.json
│   ├── tsconfig.json
│   └── .vscode/
│       └── settings.json
│
├── affiliation_platform_frontend/         # Next.js application
│   ├── src/
│   │   ├── app/                           # Next.js App Router pages
│   │   │   ├── layout.tsx                 # Root layout (Rubik font, Providers wrapper)
│   │   │   ├── page.tsx                   # Root redirect to /login
│   │   │   ├── providers.tsx              # React Query client provider
│   │   │   ├── globals.css                # Tailwind CSS + custom variables
│   │   │   ├── not-found.tsx              # 404 page
│   │   │   ├── [...not_found]/page.ts     # Catch-all 404
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   ├── affiliate/
│   │   │   │   ├── layout.tsx             # Sidebar, edit profile, feedback modals
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── links/page.tsx
│   │   │   │   ├── mylinks/page.tsx
│   │   │   │   └── subscriptions/page.tsx
│   │   │   ├── secretary/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── affiliates/page.tsx
│   │   │   │   ├── registration-requests/page.tsx
│   │   │   │   ├── links/page.tsx
│   │   │   │   ├── subscriptions/page.tsx
│   │   │   │   ├── feedbacks/page.tsx
│   │   │   │   └── banners/page.tsx
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── dashboard/page.tsx
│   │   │       ├── affiliates/page.tsx
│   │   │       ├── secretaries/page.tsx
│   │   │       ├── administrators/page.tsx
│   │   │       ├── registration-requests/page.tsx
│   │   │       ├── waiting-list/page.tsx
│   │   │       ├── promotion-requests/page.tsx
│   │   │       ├── links/page.tsx
│   │   │       ├── subscriptions/page.tsx
│   │   │       ├── feedbacks/page.tsx
│   │   │       └── banners/page.tsx
│   │   ├── api/
│   │   │   └── index.ts                   # Axios instance with Bearer interceptor
│   │   ├── services/                      # React Query hooks + API call functions
│   │   │   ├── user.ts
│   │   │   ├── url.ts
│   │   │   ├── affiliateUrl.ts
│   │   │   ├── banner.ts
│   │   │   ├── click.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── feedback.ts
│   │   │   └── subscription.ts
│   │   ├── types/                         # Frontend TypeScript type definitions
│   │   │   ├── index.ts
│   │   │   ├── affiliateUrl.ts
│   │   │   ├── banner.ts
│   │   │   ├── click.ts
│   │   │   ├── countries.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── feedback.ts
│   │   │   ├── subscription.ts
│   │   │   ├── url.ts
│   │   │   └── user.ts
│   │   ├── components/ui/                 # shadcn/ui component primitives
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── table.tsx
│   │   ├── lib/
│   │   │   ├── utils.ts                   # cn() helper (clsx + tailwind-merge)
│   │   │   └── firebaseUtils.ts           # Firebase Storage upload/delete
│   │   ├── constants/
│   │   │   └── index.ts                   # Countries list
│   │   ├── hooks/
│   │   │   └── index.ts                   # Empty (placeholder)
│   │   ├── assets/images/                 # SVG illustrations
│   │   ├── utils/
│   │   │   ├── auth.ts                    # Token decoding utility
│   │   │   └── index.ts
│   │   └── middleware.ts                  # Next.js Edge Middleware (auth + role guard)
│   ├── public/                            # Static assets
│   ├── .env.development
│   ├── .env.production
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── components.json                    # shadcn/ui configuration
│   ├── package.json
│   └── tsconfig.json
```

### Directory Descriptions

- **`affiliation_platform_backend/`**: Express.js API server. Routes are organized by resource; business logic is separated into services; Sequelize models define the MySQL schema using TypeScript decorators.
- **`affiliation_platform_backend/src/controllers/`**: Thin request handlers that parse input, delegate to services, and format HTTP responses.
- **`affiliation_platform_backend/src/services/`**: Pure business logic — database queries, token generation, email dispatch. Controllers never call models directly.
- **`affiliation_platform_backend/src/middleware/`**: Express middleware for authentication (`authenticateToken`, `permission`) and the click-tracking interceptor.
- **`affiliation_platform_backend/src/models/`**: Sequelize model classes with table definitions, column types, and relationship decorators.
- **`affiliation_platform_frontend/`**: Next.js 14 App Router application. All pages are Client Components consuming the Express API.
- **`affiliation_platform_frontend/src/app/`**: Route segments mirroring the URL hierarchy. Each role (affiliate, secretary, admin) has a layout with sidebar navigation and scoped pages.
- **`affiliation_platform_frontend/src/services/`**: Per-resource modules exporting React Query hooks (`useQuery` / `useMutation`) with typed Axios API calls.
- **`affiliation_platform_frontend/src/middleware.ts`**: Next.js Edge Middleware that reads the JWT cookie and enforces role-based route access.

---

## Development Notes

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [MySQL](https://www.mysql.com/) server
- npm (or yarn/pnpm)

### Running the Backend

```bash
cd affiliation_platform_backend
npm install
# Configure .env with your MySQL credentials and JWT secrets
npm run dev        # starts with nodemon on port 3307
npm run build      # compiles TypeScript to dist/
npm start          # runs compiled dist/index.js
```

### Running the Frontend

```bash
cd affiliation_platform_frontend
npm install
npm run dev        # starts Next.js dev server on port 3000
npm run build      # production build
npm start          # starts production server
```

### Environment Variables

**Backend** (`.env`):
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 3307) |
| `HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `PASSWORD` | MySQL password |
| `DB` | MySQL database name |
| `ACCESS_TOKEN_SECRET` | JWT secret for access tokens |
| `REFRESH_TOKEN_SECRET` | JWT secret for refresh tokens |
| `RESET_TOKEN_SECRET` | JWT secret for password reset tokens |
| `FRONTEND_URL` | Frontend origin for password reset links |
| `EMAIL_USER` | Gmail address for Nodemailer |
| `EMAIL_PASSWORD` | Gmail app password |

**Frontend** (`.env.development` / `.env.production`):
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API (e.g., `http://localhost:3307/api`) |

### API Documentation

When the backend is running, interactive API docs are available at:
```
http://localhost:3307/api-docs
```

### No test suite

Neither project includes test configuration or test files.

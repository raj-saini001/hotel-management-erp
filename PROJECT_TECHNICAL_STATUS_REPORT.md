# Hotel Management ERP — Technical Status & Architecture Audit Report

**Document Version:** 1.0.0  
**Audit Date:** August 16, 2026  
**Auditor:** DeepMind Antigravity Technical Audit Engine  
**Project Name:** `hotel-booking-admin` (Grand Stay Resort & Spa / Vijay Shree ERP)  
**Workspace Directory:** `d:\VijayShree\dashboard`  
**Audit Scope:** Full repository source code inspection (Read-Only Technical Audit)

---

## 1. Project Overview

### 1.1 Project Purpose
The project is a specialized **Hotel Operations, Booking Management, and Administrative ERP (Enterprise Resource Planning) Dashboard** designed for internal hotel staff, front-desk managers, accountants, and super administrators. It streamlines guest check-ins/check-outs, reservation tracking, payment record keeping, automated tax invoice (GST/VAT) generation, analytical dashboards, operational reports, staff user management, and activity audit logging.

### 1.2 Project Type
- **Type:** Single Page Application (SPA) Client-Side Dashboard.
- **Client Runtime:** Modern web browser (Desktop and Mobile responsive).

### 1.3 Current Development Status
- **Current Phase:** **Complete Frontend Prototype with Client-Side Persistence (`localStorage`)**.
- The user interface, forms, modal dialogs, data visualization charts, filtering, search, and PDF generation pipelines are **fully developed and functional on the client side**.
- **Backend & Database Status:** **Not Implemented**. There is no live server, no API backend, and no external SQL/NoSQL database connected.
- **Supabase Integration Status:** **Supabase integration is currently not implemented.** (Previous experiments have been reverted; zero active Supabase client or database bindings exist in the source code).

### 1.4 Architecture Summary Matrix

| Layer | Current Status | Implemented vs Planned |
| :--- | :--- | :--- |
| **Frontend UI / UX** | ✅ Fully Implemented | Complete responsive UI with Tailwind CSS, Lucide icons, Recharts, and Framer Motion. |
| **Client Routing & Guards** | ✅ Fully Implemented | React Router v6 with `PrivateRoute` token-checking wrapper and nested `DashboardLayout`. |
| **Client State Management** | ✅ Fully Implemented | React Context API (`AuthContext`, `BookingContext`, `SettingsContext`, `ThemeContext`) + Custom Hooks. |
| **Service Abstraction** | ✅ Fully Implemented | Modular service files (`bookingService`, `authService`, `userService`, `settingsService`, `reportService`, `activityService`). |
| **Data Persistence** | 🔵 Mock / `localStorage` | Client browser `localStorage` acting as mock datastore with simulated async network latency (`delay()`). |
| **Backend API Server** | 🔴 Not Implemented | Currently this project does not have a real backend. |
| **Relational Database** | 🔴 Not Implemented | No SQL/NoSQL database. Supabase/PostgreSQL is not connected. |
| **Production Authentication** | 🔴 Not Implemented | Frontend simulation using mock JWT string stored in `localStorage`. |

---

## 2. Technology Stack

### 2.1 Core Framework & Tooling

| Technology | Version / Spec | Usage in Project |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | Core UI library (`react`, `react-dom`). |
| **Vite** | `^5.4.10` | Fast dev server, bundler, and ES module builder (`@vitejs/plugin-react` `^4.3.3`). Port configured to `3000`. |
| **Language** | JavaScript (ES Module) + JSX | Standard modern JavaScript (ES6+) with JSX syntax across all 80+ source files. |
| **TypeScript** | Types only (`@types/react`, `@types/react-dom`) | Used for IDE type definitions; codebase is written in `.jsx` and `.js`. |

### 2.2 Styling & Design System

| Library / Tool | Version | Verification & Usage |
| :--- | :--- | :--- |
| **Tailwind CSS** | `^3.4.14` | Configured in `tailwind.config.js` and `src/index.css`. Uses custom brand palettes (`brand-50` to `brand-950`, `navy-800` to `navy-950`), custom glassmorphism (`glass-panel`), and custom shadows (`shadow-card`, `shadow-card-hover`). |
| **PostCSS & Autoprefixer**| `^8.4.47` / `^10.4.20` | CSS processing pipeline in `postcss.config.js`. |
| **Dark Mode** | Tailwind `class` strategy | Managed via `ThemeContext` updating `<html class="dark">` with persistence in `localStorage`. |
| **Google Fonts** | `Inter` (300 to 800) | Linked in `index.html` as the primary typography family. |

### 2.3 UI Libraries & Components

| Library | Version | Actual Usage in Codebase |
| :--- | :--- | :--- |
| **Lucide React** | `^0.460.0` | Comprehensive icon suite used across navigation, status badges, forms, actions, and KPI metric cards. |
| **Framer Motion** | `^11.11.0` | Available in dependencies for transitions and micro-interactions. |
| **React Hot Toast** | `^2.4.1` | Global toast notification system mounted in `App.jsx` (`<Toaster position="top-right" />`). |

### 2.4 Form Handling & Validation

| Library | Version | Actual Usage in Codebase |
| :--- | :--- | :--- |
| **React Hook Form** | `^7.53.0` | Powers form state in `BookingForm.jsx`, `Login.jsx`, `Settings.jsx`, and `AdminFormModal.jsx`. |
| **Zod** | `^3.23.8` | Schema validation definitions in `src/utils/validationSchemas.js`. |
| **@hookform/resolvers** | `^3.9.0` | `zodResolver` bridge integrating Zod validation into React Hook Form. |

### 2.5 Data Visualization & Charts

| Library | Version | Actual Usage in Codebase |
| :--- | :--- | :--- |
| **Recharts** | `^2.13.0` | Responsive charts in `BookingChart.jsx` (AreaChart), `RevenueChart.jsx` (BarChart), `StatusChart.jsx` (PieChart/Donut), and `RevenueAnalytics.jsx` (AreaChart). |

### 2.6 PDF & Document Generation

| Library | Version | Actual Usage in Codebase |
| :--- | :--- | :--- |
| **jsPDF** | `^2.5.2` | Programmatic PDF creation in `src/utils/invoiceGenerator.js`. |
| **html2canvas** | `^1.4.1` | Rasterizes HTML DOM elements (`#printable-invoice-card`, `#report-container-card`) into high-resolution canvas images for PDF rendering. |

### 2.7 Routing & HTTP Packages

| Library | Version | Actual Usage in Codebase |
| :--- | :--- | :--- |
| **react-router-dom** | `^6.28.0` | Client-side routing (`BrowserRouter`, `Routes`, `Route`, `Navigate`, `Outlet`, `useNavigate`, `useLocation`, `useParams`). |
| **axios** | `^1.7.7` | Instantiated in `src/services/api.js` (`axios.create({ baseURL: '/api/v1' })`). Interceptors and auth headers are configured, but **no REST endpoint calls are actually dispatched**; only the exported `delay()` utility is consumed by mock services. |
| **@supabase/supabase-js**| `^2.109.0` | **Present in `package.json` dependencies ONLY.** Zero active imports or calls exist anywhere in `src/`. Reverted from earlier exploration. |

---

## 3. Folder & File Structure

```
d:\VijayShree\dashboard\
├── dist/                              # Production build artifact folder
├── node_modules/                      # Installed npm packages
├── public/                            # (Directory absent; static assets served from root/src)
├── src/
│   ├── components/
│   │   ├── activity/
│   │   │   └── ActivityTable.jsx      # Audit logs table with status badges & IP addresses
│   │   ├── analytics/
│   │   │   ├── BookingTrends.jsx      # Historical booking volume trend graph
│   │   │   ├── OccupancyMetrics.jsx   # Occupancy rate, RevPAR, average stay cards
│   │   │   └── RevenueAnalytics.jsx   # Actual vs forecasted revenue area graph
│   │   ├── booking/
│   │   │   ├── BookingDetailsModal.jsx# Full view modal for single reservation
│   │   │   ├── BookingFilter.jsx      # Search, status, payment & date filter bar
│   │   │   ├── BookingForm.jsx        # Master booking creation/editing form
│   │   │   ├── BookingInfoSection.jsx # Sub-form: Stay dates, room type, adults/children
│   │   │   ├── BookingRow.jsx         # Individual table row with inline actions
│   │   │   ├── BookingTable.jsx       # Reusable reservation data table
│   │   │   ├── CustomerInfoSection.jsx# Sub-form: Guest name, mobile, email, ID proof
│   │   │   ├── InvoicePreview.jsx     # Printable tax invoice view with GST calculation
│   │   │   └── PaymentInfoSection.jsx # Sub-form: Total, advance, remaining, method
│   │   ├── common/
│   │   │   ├── Badge.jsx              # Status color pill (Paid, Partial, Confirmed, etc.)
│   │   │   ├── Breadcrumb.jsx         # Dynamic breadcrumb navigation bar
│   │   │   ├── Button.jsx             # Reusable button with variants, sizes & loader
│   │   │   ├── Card.jsx               # Container card with title, subtitle & action slot
│   │   │   ├── ConfirmDialog.jsx      # Generic confirmation modal
│   │   │   ├── DatePicker.jsx         # Native HTML5 date input component
│   │   │   ├── DeleteDialog.jsx       # Destructive action warning modal
│   │   │   ├── EmptyState.jsx         # Fallback placeholder when no data exists
│   │   │   ├── Input.jsx              # Form text/number/password input with icon & error
│   │   │   ├── Loader.jsx             # Animated loading spinner (inline & fullPage)
│   │   │   ├── Modal.jsx              # Backdrop dialog modal container
│   │   │   ├── PageHeader.jsx         # Page title, subtitle & action button header
│   │   │   ├── Pagination.jsx         # Numerical pagination bar with next/prev controls
│   │   │   ├── SearchBar.jsx          # Search input with clear button
│   │   │   ├── Select.jsx             # Dropdown select input with icon & error
│   │   │   └── Table.jsx              # Standard styled HTML table wrapper
│   │   ├── dashboard/
│   │   │   ├── BookingChart.jsx       # Recharts area graph for monthly bookings
│   │   │   ├── DashboardCards.jsx     # 8 KPI metric cards with icons & subtext
│   │   │   ├── QuickActionCards.jsx   # 4 shortcut action buttons (New booking, Reports, etc.)
│   │   │   ├── RevenueChart.jsx       # Recharts bar graph for monthly income
│   │   │   ├── StatusChart.jsx        # Recharts donut chart for status distribution
│   │   │   └── UpcomingWidget.jsx     # Upcoming check-ins summary widget
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx    # Master shell: Sidebar + Navbar + Outlet + SearchModal
│   │   │   ├── GlobalSearchModal.jsx  # Ctrl+K modal for rapid booking/module navigation
│   │   │   ├── Navbar.jsx             # Top bar: Mobile menu, search, theme toggle, alerts, profile
│   │   │   └── Sidebar.jsx            # Left navigation drawer with collapsible submenus
│   │   ├── reports/
│   │   │   ├── ReportFilter.jsx       # Daily, monthly, yearly & date-range selector + export
│   │   │   ├── ReportSummaryCards.jsx # Report KPI summary cards (Gross, collected, pending)
│   │   │   └── ReportTable.jsx        # Tabular statement of bookings in report window
│   │   ├── settings/
│   │   │   ├── GeneralSettings.jsx    # Hotel profile info (name, address, phone, email)
│   │   │   ├── SystemSettings.jsx     # Theme mode & email notification preferences
│   │   │   └── TaxBillingSettings.jsx # GSTIN, tax rate (%), invoice prefix, currency symbol
│   │   └── users/
│   │       ├── AdminFormModal.jsx     # Add/edit staff modal with permission checkboxes
│   │       ├── AdminTable.jsx         # Staff administrators list table
│   │       └── RolePermissionsBadge.jsx # Color badge for Super Admin, Manager, Receptionist
│   ├── context/
│   │   ├── AuthContext.jsx            # User authentication state & login/logout methods
│   │   ├── BookingContext.jsx         # Global booking list, stats & CRUD dispatchers
│   │   ├── SettingsContext.jsx        # Hotel profile & tax settings state
│   │   └── ThemeContext.jsx           # Dark/Light theme mode state
│   ├── hooks/
│   │   ├── useAuth.js                 # Hook to consume AuthContext
│   │   ├── useBookings.js             # Hook to consume BookingContext
│   │   ├── useDebounce.js             # Debounce utility hook for instant search queries
│   │   ├── useSettings.js             # Hook to consume SettingsContext
│   │   └── useTheme.js                # Hook to consume ThemeContext
│   ├── lib/                           # (Empty directory reserved for future client instances)
│   ├── pages/
│   │   ├── activity/
│   │   │   └── ActivityLogs.jsx       # Staff audit trail log page
│   │   ├── analytics/
│   │   │   └── Analytics.jsx          # Business intelligence & occupancy metrics page
│   │   ├── auth/
│   │   │   └── Login.jsx              # Glassmorphic login page with demo quick-fills
│   │   ├── booking/
│   │   │   ├── AddBooking.jsx         # Form page to create or update reservation
│   │   │   ├── BookingHistory.jsx     # Master booking table with filtering & pagination
│   │   │   ├── CancelledBookings.jsx  # Filtered view for cancelled stays
│   │   │   ├── CompletedBookings.jsx  # Filtered view for checked-out guests
│   │   │   ├── Invoice.jsx            # Single booking printable invoice page
│   │   │   └── UpcomingBookings.jsx   # Filtered view for confirmed upcoming arrivals
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx          # Main operations overview page
│   │   ├── profile/
│   │   │   └── Profile.jsx            # Current logged-in admin profile & password page
│   │   ├── reports/
│   │   │   └── Reports.jsx            # Financial reports & CSV/PDF export page
│   │   ├── settings/
│   │   │   └── Settings.jsx           # System configuration & tax parameters page
│   │   ├── users/
│   │   │   ├── AddAdmin.jsx           # Create staff member page
│   │   │   └── AdminList.jsx          # Staff members list and permissions page
│   │   └── NotFound.jsx               # 404 error fallback page
│   ├── routes/
│   │   ├── AppRoutes.jsx              # Master route tree definitions
│   │   └── PrivateRoute.jsx           # Auth guard protecting private routes
│   ├── services/
│   │   ├── activityService.js         # Audit log service reading/writing to localStorage
│   │   ├── api.js                     # Axios instance & simulated network delay helper
│   │   ├── authService.js             # Auth service matching demo credentials
│   │   ├── bookingService.js          # Booking CRUD & financial metric calculations
│   │   ├── mockData.js                # Seed data & localStorage initialize/get/set helpers
│   │   ├── reportService.js           # Date-filtered report aggregation logic
│   │   ├── settingsService.js         # Settings fetch/update logic
│   │   └── userService.js             # Staff admin CRUD logic
│   ├── utils/
│   │   ├── constants.js               # Seed hotel info, room types, statuses & roles
│   │   ├── dateFormatter.js           # Date, time, currency & stay day formatting helpers
│   │   ├── helpers.js                 # ID generator, invoice number formatter & CSV exporter
│   │   ├── invoiceGenerator.js        # html2canvas + jsPDF canvas-to-PDF export utility
│   │   └── validationSchemas.js       # Zod validation schemas for forms
│   ├── App.jsx                        # Application root wrapping providers & toaster
│   ├── index.css                      # Tailwind base, utilities, scrollbar & print styles
│   └── main.jsx                       # React DOM root entry point
├── .gitignore                         # Git ignore file
├── index.html                         # HTML5 shell with Google Font links
├── package.json                       # Project manifests and dependencies
├── package-lock.json                  # Locked dependency graph
├── postcss.config.js                  # PostCSS Tailwind plugin config
├── tailwind.config.js                 # Tailwind CSS design system theme tokens
└── vite.config.js                     # Vite build and dev server configuration
```

---

## 4. Frontend Architecture

### 4.1 Component Architecture & Reusability
The frontend follows a clean **Presentational and Container Component Pattern**:
- **Atomic Common Components (`src/components/common/`):** 16 highly reusable UI building blocks (`Button`, `Input`, `Select`, `DatePicker`, `Badge`, `Modal`, `Table`, `Card`, `Loader`, `EmptyState`, `Pagination`, `SearchBar`, `Breadcrumb`, `PageHeader`, `ConfirmDialog`, `DeleteDialog`). All components accept standard props, forward refs where necessary, and adhere strictly to Tailwind design tokens.
- **Domain-Specific Feature Components (`src/components/[feature]/`):** Grouped by business domain (`booking/`, `dashboard/`, `analytics/`, `reports/`, `settings/`, `users/`, `activity/`).
- **Composite Pages (`src/pages/`):** Coordinate data from hooks and render layout sections.

### 4.2 Layout & Navigation Hierarchy
- **Master Shell (`DashboardLayout.jsx`):** Renders the persistent `Sidebar` and `Navbar`, wraps main page content inside responsive margins with dynamic `Breadcrumb` navigation, and mounts the global keyboard search shortcut listener (`Ctrl + K`).
- **Sidebar (`Sidebar.jsx`):** Supports desktop collapsing (icon-only mode) and mobile slide-out drawer mode. Includes expandable submenus for "Booking Management" and "User Management" with active route highlighting.
- **Navbar (`Navbar.jsx`):** Contains global search trigger, light/dark theme toggle, interactive notification dropdown preview, and staff user profile menu with one-click logout.
- **Global Search Modal (`GlobalSearchModal.jsx`):** Listens for `Ctrl+K` keypresses across the application to provide real-time searching through reservations and instant navigation to any module.

### 4.3 State Management Layer
Client state is separated into 4 dedicated React Context providers in `src/context/`:
1. **`AuthContext.jsx`:** Stores active user identity, token verification state, and exposes `login()` and `logout()` functions.
2. **`BookingContext.jsx`:** Holds the live reservation array, computed KPI statistics, loading flags, and delegates CRUD mutations (`addBooking`, `updateBooking`, `deleteBooking`, `refreshBookings`).
3. **`SettingsContext.jsx`:** Stores global hotel profile parameters, tax rates, GSTIN, and currency symbols across the entire application.
4. **`ThemeContext.jsx`:** Controls `dark` vs `light` mode by synchronizing HTML class attributes with `localStorage`.

---

## 5. Backend Audit

### 5.1 Real Backend Status
> **BACKEND STATUS: NOT IMPLEMENTED**  
> **"Currently this project does not have a real backend."**

### 5.2 Deep Technical Findings
1. **No Backend Framework / Server:** There is no Node.js, Express, Fastify, NestJS, Python/Django/FastAPI, or serverless endpoint implementation in this repository.
2. **No API Routes:** There are no backend API endpoints or route handlers.
3. **HTTP Client Configuration vs Usage:** While `src/services/api.js` initializes an `axios` instance with a base URL of `/api/v1` and authorization header interceptors, **no service file makes any `api.get()`, `api.post()`, or `api.put()` calls**.
4. **Network Simulation:** Service files only import the `delay()` helper from `api.js` (e.g. `await delay(300)`) to simulate realistic network latency while reading from or writing to `localStorage`.
5. **No Server-Side Validation:** All form constraints are evaluated solely on the client browser using Zod and React Hook Form.

---

## 6. Database Audit

### 6.1 Database Status
> **DATABASE STATUS: NOT IMPLEMENTED**  
> **Supabase integration is currently not implemented.**  
> No SQL database (PostgreSQL, MySQL, SQLite) or NoSQL database (MongoDB, Firebase Firestore) exists.

### 6.2 Data Storage Mechanism: Browser `localStorage`
All application state is stored, queried, mutated, and deleted exclusively inside the browser's `window.localStorage`.

#### Detailed `localStorage` Schema & Key Inventory

| Storage Key | Data Structure | Initialization Source | Files Reading / Writing Key |
| :--- | :--- | :--- | :--- |
| `hotel_bookings` | Array of Booking Objects | `INITIAL_BOOKINGS` in `mockData.js` (7 initial seed records) | `mockData.js`, `bookingService.js`, `reportService.js` |
| `hotel_admins` | Array of Admin User Objects | `INITIAL_ADMINS` in `mockData.js` (3 initial seed accounts) | `mockData.js`, `authService.js`, `userService.js` |
| `hotel_activity_logs` | Array of Audit Log Objects | `INITIAL_ACTIVITY_LOGS` in `mockData.js` (5 initial seed events) | `mockData.js`, `activityService.js`, `bookingService.js`, `settingsService.js`, `userService.js` |
| `hotel_settings` | Single Settings Object | `HOTEL_INFO` in `constants.js` | `mockData.js`, `settingsService.js` |
| `hotel_admin_token` | String (`jwt-token-demo-<timestamp>`) | Generated upon successful login | `authService.js`, `api.js`, `AuthContext.jsx` |
| `hotel_admin_user` | Stringified User Object | Serialized user object upon login | `authService.js`, `api.js`, `AuthContext.jsx` |
| `hotel_admin_theme` | String (`'light'` or `'dark'`) | System preference fallback | `ThemeContext.jsx` |

#### Client-Side Data Lifecycle Flow
- **Initialization:** The helper function `initStorage()` in `src/services/mockData.js` checks for the presence of each key. If absent, it populates `localStorage` with initial seed constants.
- **Read Operations:** `getStorageItem(key, fallback)` parses JSON strings back into JavaScript objects.
- **Write/Update Operations:** `setStorageItem(key, value)` serializes objects into JSON strings and commits them to `localStorage`.
- **Delete Operations:** Array filtering methods (`filter(b => b.id !== id)`) followed by `setStorageItem`.

---

## 7. Authentication Audit

### 7.1 Current Authentication Flow
1. **User Navigation:** Unauthenticated user arrives at `/login` (or is redirected from a protected route by `PrivateRoute`).
2. **Form Input:** User enters username/email and password (or clicks the "One-Click Quick Fill" demo buttons for Super Admin or Manager).
3. **Service Execution (`authService.login`):**
   - Retrieves the `hotel_admins` list from `localStorage`.
   - Checks if the input email matches any stored admin or if username is `'admin'`.
   - **Important:** Password validation is mocked—any password satisfying the minimum Zod schema length is accepted.
4. **Token Generation:** A pseudo-token is generated via `const token = 'jwt-token-demo-' + Date.now()`.
5. **Session Storage:** `hotel_admin_token` and `hotel_admin_user` are written to `localStorage`.
6. **State Update:** `AuthContext` updates its `user` state and sets `isAuthenticated` to `true`.
7. **Redirection:** React Router navigates to `/dashboard`.

### 7.2 Route Protection Mechanism
- Guarded routes are wrapped inside `<Route element={<PrivateRoute />}>` in `src/routes/AppRoutes.jsx`.
- `PrivateRoute.jsx` verifies `const { isAuthenticated, loading } = useAuth()`.
- If `loading` is true, renders `<Loader fullPage />`.
- If `isAuthenticated` is true, renders `<Outlet />` (which loads `DashboardLayout`); otherwise, redirects via `<Navigate to="/login" replace />`.

### 7.3 Roles & Permissions Model (Client-Side)
- Defined roles: `super_admin`, `manager`, `receptionist`, `accountant` in `src/utils/constants.js`.
- Defined permission scopes: `manage_bookings`, `view_reports`, `view_analytics`, `manage_admins`, `manage_settings`.
- **Limitation:** Roles and permissions are displayed visually on user badges (`RolePermissionsBadge.jsx`), but **fine-grained route-level or button-level access control enforcement is currently not implemented** (all logged-in users have access to all routes).

---

## 8. Routing Audit

All application routes are defined in `src/routes/AppRoutes.jsx`:

| Route Path | Component / Page | Access Level | Purpose & Functionality |
| :--- | :--- | :--- | :--- |
| `/login` | `Login.jsx` | **Public** | Staff authentication form with demo accounts quick-fill. |
| `/` | Redirect (`Navigate`) | **Protected** | Auto-redirects authenticated staff to `/dashboard`. |
| `/dashboard` | `Dashboard.jsx` | **Protected** | Executive summary, KPI cards, charts, and recent reservations table. |
| `/bookings/add` | `AddBooking.jsx` | **Protected** | Form to create a new reservation or edit an existing one. |
| `/bookings/history` | `BookingHistory.jsx` | **Protected** | Complete reservation database with multi-filter, search & pagination. |
| `/bookings/upcoming` | `UpcomingBookings.jsx`| **Protected** | Filtered list showing only confirmed upcoming guest arrivals. |
| `/bookings/completed`| `CompletedBookings.jsx`| **Protected** | Filtered list showing historical checked-out reservations. |
| `/bookings/cancelled`| `CancelledBookings.jsx`| **Protected** | Filtered list showing cancelled reservations. |
| `/bookings/invoice/:id`| `Invoice.jsx` | **Protected** | Printable tax invoice page with GST calculation and PDF export. |
| `/reports` | `Reports.jsx` | **Protected** | Financial statements, date-range filtering, and CSV/PDF export. |
| `/analytics` | `Analytics.jsx` | **Protected** | Occupancy metrics, RevPAR, average stay length & forecasting graphs. |
| `/users/add` | `AddAdmin.jsx` | **Protected** | Form to register a new staff administrator with roles & permissions. |
| `/users/list` | `AdminList.jsx` | **Protected** | Table of all staff users with edit/delete modals. |
| `/activity` | `ActivityLogs.jsx` | **Protected** | Chronological audit trail of all actions performed in the system. |
| `/settings` | `Settings.jsx` | **Protected** | Hotel profile, GSTIN, invoice prefix, tax rate, and currency configuration. |
| `/profile` | `Profile.jsx` | **Protected** | Personal account details, avatar display, and password update form. |
| `*` | `NotFound.jsx` | **Public** | 404 error fallback page with button returning to dashboard. |

---

## 9. Feature Status Matrix

| Feature Module | Status | Frontend | Data Source | Persistence | Backend | Database | Technical Notes |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Authentication & Login** | 🔵 / ⚠️ | ✅ Complete | `authService.js` | `localStorage` | 🔴 None | 🔴 None | Uses demo accounts and client token; requires backend JWT/OAuth. |
| **Operations Dashboard** | 🔵 | ✅ Complete | `BookingContext` | `localStorage` | 🔴 None | 🔴 None | Renders 8 KPI metric cards and 3 Recharts data charts. |
| **New Booking Registration** | 🔵 | ✅ Complete | `BookingForm.jsx` | `localStorage` | 🔴 None | 🔴 None | Auto-calculates total stay days, room prices, and balance due. |
| **Booking History & Audit** | 🔵 | ✅ Complete | `bookingService.js`| `localStorage` | 🔴 None | 🔴 None | Search, status filtering, date-range filtering & pagination. |
| **Upcoming Check-ins** | 🔵 | ✅ Complete | `bookingService.js`| `localStorage` | 🔴 None | 🔴 None | Filtered view for `bookingStatus === 'Confirmed'`. |
| **Completed Stays** | 🔵 | ✅ Complete | `bookingService.js`| `localStorage` | 🔴 None | 🔴 None | Filtered view for `bookingStatus === 'Checked Out'`. |
| **Cancelled Bookings** | 🔵 | ✅ Complete | `bookingService.js`| `localStorage` | 🔴 None | 🔴 None | Filtered view for `bookingStatus === 'Cancelled'`. |
| **Invoice Generator (PDF)** | 🔵 | ✅ Complete | `InvoicePreview.jsx`| `localStorage` | 🔴 None | 🔴 None | Dynamic GST calculation (CGST/SGST), print CSS & jsPDF download. |
| **Financial Reports** | 🔵 | ✅ Complete | `reportService.js` | `localStorage` | 🔴 None | 🔴 None | Aggregates revenue; exports reports to CSV and PDF format. |
| **Business Analytics** | 🔵 | ✅ Complete | `OccupancyMetrics`| `localStorage` | 🔴 None | 🔴 None | Computes occupancy %, RevPAR, stay duration & revenue forecast. |
| **Hotel System Settings** | 🔵 | ✅ Complete | `SettingsContext` | `localStorage` | 🔴 None | 🔴 None | Configures hotel profile, GSTIN, tax rate %, prefix & currency. |
| **Staff User Management** | 🔵 | ✅ Complete | `userService.js` | `localStorage` | 🔴 None | 🔴 None | Add, edit, delete staff accounts; toggle permission checkboxes. |
| **Activity Audit Logging** | 🔵 | ✅ Complete | `activityService.js`| `localStorage` | 🔴 None | 🔴 None | Automatically logs booking additions, edits, deletes & settings changes. |
| **Global Quick Search (Ctrl+K)**| 🔵 | ✅ Complete | `GlobalSearchModal`| In-Memory | 🔴 None | 🔴 None | Rapid keyboard-driven modal searching reservations and routes. |
| **Dark / Light Theme** | ✅ Fully Implemented | ✅ Complete | `ThemeContext.jsx`| `localStorage` | N/A | N/A | Fully working CSS class toggle synchronized with browser storage. |

**Status Key:**  
✅ Fully implemented & functional | 🔵 Client/`localStorage` mock-based | 🔴 Not implemented | ⚠️ Requires backend & database for production

---

## 10. Current Data Flow Architecture

The current architecture is **100% client-contained**. Below is the exact data flow for key actions:

### 10.1 Authentication Flow
```
[Login.jsx Form Submit]
       │
       ▼
[AuthContext.login(username, password)]
       │
       ▼
[authService.login] ──(reads)──► [localStorage: 'hotel_admins']
       │
       ▼ (generates mock token)
[localStorage: 'hotel_admin_token' & 'hotel_admin_user']
       │
       ▼
[AuthContext: user state updated] ──► [Navigate to /dashboard]
```

### 10.2 Booking Creation Flow
```
[AddBooking.jsx / BookingForm.jsx Submit]
       │
       ▼
[BookingContext.addBooking(formData)]
       │
       ▼
[bookingService.createBooking]
       ├──► [Reads next sequence & prefix from 'hotel_settings']
       ├──► [Generates BK-XXXX ID and INV-GS-XXXXX number]
       ├──► [Prepends new booking into 'hotel_bookings' in localStorage]
       └──► [Dispatches activityService.logActivity('Booking Added')]
                 │
                 ▼
       [Writes new log into 'hotel_activity_logs' in localStorage]
       │
       ▼
[BookingContext.fetchBookings()] ──► [UI re-renders across all views]
```

### 10.3 Settings Update Flow
```
[Settings.jsx Form Submit]
       │
       ▼
[SettingsContext.updateSettings(formData)]
       │
       ▼
[settingsService.updateSettings]
       ├──► [Merges with existing settings]
       ├──► [Saves updated object to 'hotel_settings' in localStorage]
       └──► [Dispatches activityService.logActivity('Settings Saved')]
                 │
                 ▼
       [Writes new log into 'hotel_activity_logs' in localStorage]
       │
       ▼
[SettingsContext: settings state updated] ──► [Propagated to Invoice & Header]
```

---

## 11. Services Audit

| Service File | Primary Functions | Data Source | API Usage | `localStorage` Key | Backend Migration Readiness |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **`authService.js`** | `login`, `logout`, `getCurrentUser` | `hotel_admins` | ❌ Simulated (`delay`) | `hotel_admins`, `hotel_admin_token`, `hotel_admin_user` | **High:** Ready to replace inner logic with `api.post('/auth/login')` or Supabase `auth.signInWithPassword()`. |
| **`bookingService.js`**| `getAllBookings`, `getBookingById`, `createBooking`, `updateBooking`, `deleteBooking`, `getStats` | `hotel_bookings`, `hotel_settings` | ❌ Simulated (`delay`) | `hotel_bookings`, `hotel_settings`, `hotel_activity_logs` | **High:** Clean CRUD interface; replace `getStorageItem` with SQL/REST calls. |
| **`userService.js`** | `getAllAdmins`, `createAdmin`, `updateAdmin`, `deleteAdmin` | `hotel_admins` | ❌ Simulated (`delay`) | `hotel_admins`, `hotel_activity_logs` | **High:** Drop-in replacement for user management endpoints or auth tables. |
| **`settingsService.js`**| `getSettings`, `updateSettings` | `hotel_settings` | ❌ Simulated (`delay`) | `hotel_settings`, `hotel_activity_logs` | **High:** Straightforward key-value or row-level settings fetch/patch. |
| **`reportService.js`** | `getReportData` (daily/monthly/yearly/custom) | `hotel_bookings` | ❌ Simulated (`delay`) | `hotel_bookings` | **High:** Ready for database aggregation queries (`SUM`, `COUNT`, date groupings). |
| **`activityService.js`**| `getActivityLogs`, `logActivity` | `hotel_activity_logs`| ❌ Simulated (`delay`) | `hotel_activity_logs` | **High:** Ready to insert into audit log database table. |
| **`api.js`** | Axios instance, headers, response interceptors, `delay(ms)` helper | N/A | Configured (`/api/v1`) | Reads `hotel_admin_token` | **Ready:** Interceptor logic already exists for JWT bearer token transmission. |
| **`mockData.js`** | `initStorage`, `getStorageItem`, `setStorageItem`, seed constants | Hardcoded arrays | ❌ None | All keys | **Deprecate upon migration:** To be replaced by database seed migrations. |

---

## 12. Invoice System

### 12.1 Generation Architecture
- **Component:** `src/components/booking/InvoicePreview.jsx` and `src/pages/booking/Invoice.jsx`.
- **Libraries Used:** `html2canvas` (`^1.4.1`) rasterizes the DOM card (`#printable-invoice-card`) at `scale: 2` (retina resolution); `jspdf` (`^2.5.2`) compiles the canvas into an A4 multi-page PDF document.
- **Print Support:** `@media print` CSS rules in `src/index.css` hide navigation bars (`.no-print`) and render clean black-and-white or styled receipts directly via browser `window.print()`.

### 12.2 Financial & Tax Calculation Logic
The invoice system dynamically calculates taxes from global settings:
- **Subtotal:** Base accommodation charge (`totalAmount`).
- **GST Rate:** Sourced from `SettingsContext` (default `18%`).
- **CGST Split:** `Subtotal * ((taxRate / 2) / 100)`.
- **SGST Split:** `Subtotal * ((taxRate / 2) / 100)`.
- **Grand Total:** `Subtotal + CGST + SGST`.
- **Balance Due:** `Grand Total - Advance Paid`.

### 12.3 Invoice Numbering & Persistence
- **Prefix:** Sourced from `hotel_settings.invoicePrefix` (default: `'INV-GS-'`).
- **Numbering:** Auto-formatted via `formatInvoiceNo(seq, prefix)` producing zero-padded strings such as `INV-GS-01008`.
- **Persistence:** Invoice numbers are stored as an attribute of the booking record inside `hotel_bookings`. Dedicated separate invoice history tables do not currently exist.

---

## 13. Settings System

The settings module (`src/pages/settings/Settings.jsx` and `src/services/settingsService.js`) provides comprehensive property configuration:

| Setting Parameter | Configuration Field | Current Storage Location | Downstream Usage |
| :--- | :--- | :--- | :--- |
| **Hotel Name** | `hotelName` (string) | `localStorage: 'hotel_settings'` | Top navbar brand, sidebar header, login screen, invoice header, PDF receipts. |
| **Tagline / Slogan** | `tagline` (string) | `localStorage: 'hotel_settings'` | Invoice header subtitle. |
| **Property Address** | `address` (string) | `localStorage: 'hotel_settings'` | Invoice billing header, booking forms. |
| **Contact Phone / Email**| `phone`, `email` (string) | `localStorage: 'hotel_settings'` | Invoice footer authorization and guest inquiry notices. |
| **GSTIN Registration** | `gstin` (string) | `localStorage: 'hotel_settings'` | Tax invoice compliance header. |
| **Invoice Prefix** | `invoicePrefix` (string) | `localStorage: 'hotel_settings'` | Automated booking sequence prefix generator (`INV-GS-`). |
| **Tax Rate (%)** | `taxRate` (number, default 18%)| `localStorage: 'hotel_settings'` | Invoice CGST / SGST split computations. |
| **Currency Symbol** | `currencySymbol` (default `$`) | `localStorage: 'hotel_settings'` | Form inputs, KPI metric cards, invoice tables, financial reports, analytics. |
| **System Alerts** | `emailAlerts` (boolean) | `localStorage: 'hotel_settings'` | Notification preference toggle. |

---

## 14. Security Audit (Read-Only Review)

> [!WARNING]
> The current system has been designed for prototyping and demonstration purposes. Before moving to production with real guest and financial data, the following security limitations must be addressed.

1. **Frontend-Only Authentication:** Authentication is verified solely within the client browser. No backend validates user identity or verifies token signatures.
2. **Plaintext Credential Matching:** Credentials in demo mode are matched against plaintext objects in `localStorage`.
3. **Forged Session Tokens:** The session token is a simple string (`jwt-token-demo-<timestamp>`) rather than a cryptographically signed HMAC/RSA JWT from a secure backend.
4. **Lack of Server-Side Validation:** While Zod validates input format on the client, without a backend API, data could be submitted or altered directly via browser developer tools.
5. **No Data Encryption at Rest:** All guest personal details (passports, national IDs, addresses, phone numbers) are stored unencrypted in browser `localStorage`.
6. **No Multi-User Isolation:** Anyone with access to the browser session can modify any record. There is no row-level security (RLS) or database-level access control.
7. **Environment Secrets:** No `.env` files are present; no active production API secrets are exposed in client-side bundles.

---

## 15. Current Technical Limitations

1. **No Backend API:** All business logic runs exclusively inside the browser JavaScript engine.
2. **No Persistent Central Database:** Changes made in one browser are not synchronized with other devices or staff members.
3. **Storage Quotas:** Browser `localStorage` has a storage limit (typically ~5MB), which will fail once several thousand bookings or high-res images are accumulated.
4. **Cache/Storage Clearance Risk:** If a user clears their browser history or cookies, all booking records, settings, and logs will be permanently erased.
5. **Simulated Concurrent Access:** Real-time room availability conflicts (double booking of the same room on overlapping dates) are not prevented across concurrent users.

---

## 16. Completed Work Checklist

```
[✅] Complete Component Design System (Buttons, Modals, Inputs, Cards, Tables, Badges, Loaders)
[✅] Application Routing Architecture with PrivateRoute Guards
[✅] Executive Operations Dashboard (8 KPI Metric Cards, 3 Interactive Recharts)
[✅] Master Reservation Form with Multi-Section Breakdown & Zod Validation
[✅] Automatic Stay Duration, Room Rate, and Remaining Balance Calculations
[✅] Booking Management Views (All History, Upcoming, Completed, Cancelled)
[✅] Interactive Global Quick Search Modal (Ctrl + K shortcut)
[✅] Tax Invoice Generator with Real-Time CGST/SGST Breakdown & Print Styles
[✅] High-Resolution Canvas PDF Export for Invoices and Reports (jsPDF + html2canvas)
[✅] Comprehensive Financial Statements & Reports Module with CSV Export
[✅] Business Intelligence Analytics (Occupancy Rate, RevPAR, Forecasting)
[✅] Hotel Property & GST Tax System Settings
[✅] Staff Administrator Management & Permission Scope Assigning
[✅] Chronological Activity Audit Trail Logging
[✅] Dark / Light Theme Mode with Smooth Transitions
[❌] Real Backend API Server
[❌] Relational Database Connection (Supabase / PostgreSQL)
[❌] Secure Server-Side Authentication & Session Management
[❌] Multi-Device Real-Time Synchronization
```

---

## 17. Remaining Work Roadmap

```
PHASE 1 — Authentication & Identity
  ├── Set up Supabase Auth or custom Node.js / Express JWT auth service.
  ├── Implement secure password hashing (bcrypt / Argon2) and refresh token rotation.
  └── Connect login/logout hooks to live authentication endpoints.

PHASE 2 — Database Schema & Relational Models
  ├── Provision PostgreSQL database (e.g. Supabase project).
  ├── Create database tables: `profiles`, `rooms`, `bookings`, `invoices`, `settings`, `activity_logs`.
  └── Configure foreign keys, indexes, and automated timestamps.

PHASE 3 — Data Layer & Service Integration
  ├── Replace `localStorage` calls in `bookingService.js` with database queries.
  ├── Replace `userService.js` with live admin management endpoints.
  └── Replace `settingsService.js` with remote configuration queries.

PHASE 4 — Room Availability & Conflict Prevention
  ├── Implement database-level room availability checking to prevent double-booking.
  └── Add check-in / check-out date collision constraints.

PHASE 5 — Payment Gateway & Receipts
  ├── Integrate payment gateway (Stripe, Razorpay, or UPI webhook verification).
  └── Store transaction references and payment ledger records in database.

PHASE 6 — Settings & Dynamic Customization Persistence
  ├── Persist property profile, tax slabs, and numbering sequences remotely.
  └── Support multi-property or custom branch configurations.

PHASE 7 — Real-Time Subscriptions & Notifications
  ├── Enable WebSocket / Supabase Realtime for instant booking updates across front-desk terminals.
  └── Implement email/SMS notifications for guest booking confirmations.

PHASE 8 — Advanced Reports & Server-Side Aggregation
  ├── Implement SQL aggregation views for revenue, tax returns, and occupancy statements.
  └── Server-side PDF invoice compilation and delivery.

PHASE 9 — Role-Based Access Control (RBAC) & Security Policies
  ├── Implement PostgreSQL Row Level Security (RLS) policies based on user roles.
  └── Restrict admin configuration routes to `super_admin` role.

PHASE 10 — Security Hardening & Input Sanitization
  ├── Implement rate limiting, CORS configuration, and security headers (Helmet).
  └── Ensure strict server-side validation against all API endpoints.

PHASE 11 — Production Deployment & CI/CD
  ├── Configure environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` or API URLs).
  ├── Deploy frontend to Vercel / Netlify / Cloudflare Pages.
  └── Set up automated CI/CD test and build pipelines.
```

---

## 18. Recommended Future Architecture

> [!NOTE]
> Below is the recommended production architecture designed to scale seamlessly with the existing modular React codebase.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REACT FRONTEND (Vite SPA)                      │
│                                                                        │
│   ┌───────────────────┐    ┌───────────────────┐   ┌───────────────┐   │
│   │ UI Components     │    │  Custom Hooks     │   │ Context State │   │
│   │ & Dashboard Views │◄───┤ (useAuth, etc.)   │◄──┤ (Auth, Book)  │   │
│   └───────────────────┘    └───────────────────┘   └───────────────┘   │
│                                      │                                 │
│                                      ▼                                 │
│                         ┌─────────────────────────┐                    │
│                         │ Service Abstraction     │                    │
│                         │ (bookingService, etc.)  │                    │
│                         └────────────┬────────────┘                    │
└──────────────────────────────────────┼─────────────────────────────────┘
                                       │ HTTPS / WSS
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SUPABASE / BACKEND SERVICE LAYER                     │
│                                                                        │
│   ┌────────────────────┐   ┌────────────────────┐  ┌───────────────┐   │
│   │ Supabase Auth /    │   │ PostgREST API /    │  │ Realtime      │   │
│   │ JWT Token Engine   │   │ Express Server     │  │ WebSockets    │   │
│   └─────────┬──────────┘   └─────────┬──────────┘  └───────┬───────┘   │
└─────────────┼────────────────────────┼─────────────────────┼───────────┘
              │                        │                     │
              ▼                        ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 POSTGRESQL RELATIONAL DATABASE                         │
│                                                                        │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│   │  `bookings`  │  │   `rooms`    │  │  `profiles`  │  │ `settings`│  │
│   └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘  │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │ Row Level Security (RLS) & Role-Based Access Policies           │  │
│   └─────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 19. Migration Plan (Current to Future)

### Comparison: Current vs. Target Architecture

```
CURRENT ARCHITECTURE:
React Components ──► Context / Hooks ──► Services ──► localStorage / Mock Data

FUTURE ARCHITECTURE:
React Components ──► Context / Hooks ──► Services ──► Supabase SDK / REST API ──► PostgreSQL (with RLS)
```

### Migration Execution Steps
1. **Zero Frontend UI Disruption:** Because the frontend is cleanly decoupled using service files (`bookingService`, `authService`, `settingsService`, etc.), **zero changes to UI components or page files are required**.
2. **Service Layer Swap:** Replace internal `localStorage` helper functions inside the `services/` directory with asynchronous Supabase client queries (`supabase.from('bookings').select()`) or Axios API calls (`api.get('/bookings')`).
3. **Context Pass-Through:** `BookingContext` and `SettingsContext` will receive live database records and update the UI identically.

---

## 20. Final System Status Table

| Area | Current Status | Technology Used | Backend Connection | Database Connection | Next Recommended Step |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Frontend UI** | ✅ Complete | React 18, Tailwind CSS, Lucide | N/A | N/A | Production UI ready. |
| **Routing & Navigation** | ✅ Complete | React Router DOM v6 | N/A | N/A | Production ready. |
| **Authentication** | 🔵 Mock / Client | `AuthContext` + `localStorage` | 🔴 Not Connected | 🔴 Not Connected | Connect Supabase Auth / JWT API. |
| **Bookings & CRUD** | 🔵 Complete Client | `BookingContext` + `bookingService`| 🔴 Not Connected | 🔴 Not Connected | Connect to PostgreSQL `bookings` table. |
| **Room Management** | 🔵 Static Constants | `constants.js` | 🔴 Not Connected | 🔴 Not Connected | Create dynamic `rooms` table. |
| **Invoice Generator** | ✅ Complete | `jsPDF`, `html2canvas` | N/A | 🔴 Not Connected | Save generated invoice records to DB. |
| **Reports & Exports** | ✅ Complete | CSV Blob helper + `reportService` | 🔴 Not Connected | 🔴 Not Connected | Switch to SQL aggregation queries. |
| **Analytics Engine** | ✅ Complete | `Recharts` + `OccupancyMetrics` | 🔴 Not Connected | 🔴 Not Connected | Compute metrics from live DB queries. |
| **Settings System** | 🔵 Complete Client | `SettingsContext` + `settingsService`| 🔴 Not Connected | 🔴 Not Connected | Persist settings in `hotel_settings` table.|
| **User Management** | 🔵 Complete Client | `userService.js` + Modals | 🔴 Not Connected | 🔴 Not Connected | Bind to Supabase user management. |
| **Activity Audit Logs** | 🔵 Complete Client | `activityService.js` | 🔴 Not Connected | 🔴 Not Connected | Stream audit logs to database. |
| **Security & Auth Guard**| ⚠️ Client-Only | `PrivateRoute.jsx` | 🔴 None | 🔴 None | Implement PostgreSQL Row-Level Security. |
| **Deployment** | 🔵 Local Dev Ready | Vite Bundler (`npm run dev`) | 🔴 None | 🔴 None | Setup environment variables & Vercel. |

---

*Report concluded. Generated by DeepMind Antigravity Technical Audit Engine.*

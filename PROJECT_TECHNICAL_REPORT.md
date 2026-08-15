# Technical Audit & Architecture Report: Grand Stay Hotel Admin ERP Portal

**Project Directory:** `d:/VijayShree/dashboard`  
**Generated Date:** August 12, 2026  
**Auditor:** Antigravity AI Code Analysis Engine  

---

## 1. PROJECT OVERVIEW

### Executive Summary
The **Grand Stay Hotel Admin ERP Portal** (internal package name `hotel-booking-admin`) is a modern, responsive **Frontend-Only Single Page Application (SPA)** built with **React 18**, **Vite**, **Tailwind CSS**, and **JavaScript (ES6+)**. The system is designed to provide hotel staff, receptionists, and management with a dashboard for operational workflows including reservation creation, check-in/check-out tracking, financial reporting, occupancy analytics, GST tax invoice generation (with PDF download), staff user administration, system activity audit logging, and hotel property settings configuration.

The project currently operates as a **fully functional client-side prototype / demo application**. It lacks a real backend server (Express/NestJS/Node) and a real database engine (PostgreSQL/MongoDB/MySQL). All data persistence, simulated API latency, and session management are handled client-side using browser `localStorage` wrapped in mock service modules.

---

### Key Project Metadata
- **Project Name:** `hotel-booking-admin` (from `package.json`), titled as **Grand Stay Hotel | Admin ERP Portal**
- **Project Type:** Single Page Application (SPA) Web Application
- **Main Purpose:** Internal Hotel Management ERP for reservations, billing, guest tracking, reports, and staff management
- **Architecture Stack:** Frontend-only (No backend server or database present)
- **Current Development Status:** Client-side prototype with complete UI/UX workflows backed by `localStorage` mock data
- **Primary Domain Entity:** Guest Reservations / Bookings

---

### Feature Implementation Status Breakdown

#### Major Modules Fully Implemented (Client-Side)
1. **Operations & Revenue Dashboard:** Metric summary cards, Recharts visualizations (Booking Trends, Revenue Growth, Status Distribution), Upcoming Check-in widget, and Recent Guest Reservations live table.
2. **Booking Management Engine:** Full CRUD (Create, Read, Update, Delete) operations for hotel reservations with automatic stay day calculation, dynamic remaining balance calculation, search filters, status/payment filters, date-range filters, and pagination.
3. **Pre-filtered Booking Views:** Dedicated views for Upcoming Check-ins, Completed Stays, and Cancelled Reservations.
4. **GST Tax Invoice Generator & PDF System:** Printable tax invoice preview featuring itemized room charges, 18% GST calculation (split into 9% CGST + 9% SGST), scan-to-pay QR code representation, browser print styling, and high-resolution PDF download using `html2canvas` and `jspdf`.
5. **Financial & Operations Reports:** Monthly, daily, yearly, and custom date-range financial reporting with CSV export via browser Blob API and PDF summary download.
6. **Business Intelligence & Analytics:** Visual charts for occupancy rates, monthly revenue growth trends, room category demand distributions, and key performance indicators (RevPAR, ADR, Occupancy %).
7. **Staff Administrator Management:** Admin staff list table, user creation/editing modal with role selection and granular permission checkboxes, and user removal with confirmation dialogs.
8. **System Activity Audit Logging:** Searchable, timestamped audit log table capturing staff actions (logins, booking additions, updates, settings changes).
9. **Hotel ERP System Settings:** Form interface for configuring hotel profile details (name, tagline, address, phone, email, GSTIN, invoice prefix, tax rate, currency symbol) with immediate application across all invoice and header components.
10. **Authentication & Guarded Routing:** Login form with pre-filled demo accounts, mock JWT token generation stored in `localStorage`, and route protection via `<PrivateRoute>`.
11. **Global Search Modal:** Keyboard shortcut (`Ctrl+K`) modal enabling instant lookup of guest bookings and quick navigation shortcuts.
12. **Theme Customization:** Light / Dark mode toggle persisting user preference (`hotel_admin_theme`) in `localStorage` and toggling the `dark` class on the root HTML element.

#### Major Modules Partially Implemented
1. **Global Search Modal Navigation:** Quick search filters bookings accurately, but clicking a matching guest record navigates to `/bookings/history` without auto-opening that specific booking's detail modal.
2. **Invoice Route Deep Linking (`/bookings/invoice/:id`):** Direct navigation to `/bookings/invoice/:id` retrieves the booking matching `:id` or falls back to the first booking record in context, but transient un-saved form state passed via router state is lost if refreshed.
3. **Role-Based Access Control (RBAC):** Admin roles (`super_admin`, `manager`, `receptionist`, `accountant`) and permission arrays are defined and managed on staff objects, but individual route guards do not restrict page access based on user role (all logged-in admins can access all routes).

#### Major Missing / Incomplete Functionality
1. **Backend Server API:** No backend framework (Express, NestJS, Fastify, Python Django/FastAPI) exists in the repository.
2. **Real Database:** No database server (PostgreSQL, MySQL, MongoDB, SQLite) or ORM (Prisma, Mongoose, TypeORM) is integrated.
3. **Server-Side Authentication:** Password verification, real JWT signing/verification, refresh tokens, and HTTP-only cookies are absent.
4. **Real File & Image Storage:** Profile avatars rely on static external URLs (Unsplash); no file upload handler or cloud storage integration exists.
5. **Real Network Transport:** An Axios client is configured (`src/services/api.js`), but service modules bypass Axios entirely to read and write directly to `localStorage`.

---

## 2. TECHNOLOGY STACK

### Exact Technologies & Found Locations

#### Frontend Stack
| Layer / Category | Technology | Version | Location Found in Codebase |
| font | Inter (Google Fonts) | Web font | `index.html` lines 8-10, `tailwind.config.js` line 31 |
| Core Framework | React | `^18.3.1` | `package.json` line 19, `src/main.jsx` |
| DOM Renderer | React DOM | `^18.3.1` | `package.json` line 20, `src/main.jsx` |
| Build Tool & Dev Server | Vite | `^5.4.10` | `package.json` line 34, `vite.config.js` |
| React Plugin for Vite | `@vitejs/plugin-react` | `^4.3.3` | `package.json` line 30, `vite.config.js` |
| Language | JavaScript (ES6+ / JSX) | ES module | All `.js` and `.jsx` files in `src/` |
| CSS Framework | Tailwind CSS | `^3.4.14` | `package.json` line 33, `tailwind.config.js` |
| CSS Post-Processor | PostCSS & Autoprefixer | `^8.4.47` / `^10.4.20` | `package.json` lines 31-32, `postcss.config.js` |
| UI Component Architecture | Custom Components + Tailwind | N/A | `src/components/` |
| Icon Library | Lucide React | `^0.460.0` | `package.json` line 18, imported across components |
| Routing Library | React Router DOM | `^6.28.0` | `package.json` line 23, `src/routes/AppRoutes.jsx` |
| State Management | React Context API | Native | `src/context/` (`Auth`, `Booking`, `Settings`, `Theme`) |
| Form Management | React Hook Form | `^7.53.0` | `package.json` line 21, `src/pages/auth/Login.jsx`, `src/components/booking/BookingForm.jsx` |
| Form Validation | Zod | `^3.23.8` | `package.json` line 25, `src/utils/validationSchemas.js` |
| Validation Resolver | `@hookform/resolvers` | `^3.9.0` | `package.json` line 13, `zodResolver` bindings |
| HTTP Client (Unused) | Axios | `^1.7.7` | `package.json` line 14, `src/services/api.js` |
| Data Visualization | Recharts | `^2.13.0` | `package.json` line 24, `src/components/dashboard/`, `src/components/analytics/` |
| Animation Library (Unused) | Framer Motion | `^11.11.0` | `package.json` line 15 (Not imported in `src/`) |
| Notifications | React Hot Toast | `^2.4.1` | `package.json` line 22, `src/App.jsx` line 17 |
| PDF Generation | `jspdf` | `^2.5.2` | `package.json` line 17, `src/utils/invoiceGenerator.js` |
| DOM Canvas Rasterizer | `html2canvas` | `^1.4.1` | `package.json` line 16, `src/utils/invoiceGenerator.js` |

#### Backend Stack
- **Status:** **Not Found / Cannot Be Determined**
- **Explanation:** No backend files, Node/Express/NestJS runtime, Python/Java server, authentication middleware, or API endpoint routes exist anywhere in the repository.

#### Database Stack
- **Status:** **Not Found / Cannot Be Determined (Mock Persistence Only)**
- **Engine:** Browser `localStorage` API (`window.localStorage`)
- **Location:** `src/services/mockData.js`, `src/services/bookingService.js`, `src/services/authService.js`, `src/services/settingsService.js`, `src/services/userService.js`, `src/services/activityService.js`

#### Infrastructure & Environment Configuration
- **Development Server:** Vite dev server on port `3000` with auto-open browser (`vite.config.js` lines 12-15)
- **Path Aliasing:** `@` mapped to `./src` (`vite.config.js` lines 8-10)
- **Environment Variables:** **Not Found** (No `.env` or `.env.example` file present)
- **Build Output Directory:** `./dist` (`package.json` script `build: vite build`)
- **Docker / Containerization:** **Not Found**
- **CI/CD Pipelines:** **Not Found**

---

## 3. COMPLETE FOLDER STRUCTURE

```
d:/VijayShree/dashboard/
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── dist/                          [Production build output directory]
└── src/
    ├── App.jsx                    [Main Root Application Component]
    ├── index.css                  [Global Tailwind Directives & Custom Styles]
    ├── main.jsx                   [React 18 DOM Mounting Entry Point]
    ├── components/
    │   ├── activity/
    │   │   └── ActivityTable.jsx  [Audit Logs Data Table Component]
    │   ├── analytics/
    │   │   ├── BookingTrends.jsx  [Bar Chart Component for Monthly Trends]
    │   │   ├── OccupancyMetrics.jsx [KPI Cards for RevPAR, ADR, Occupancy]
    │   │   └── RevenueAnalytics.jsx [Area Chart Component for Revenue Growth]
    │   ├── booking/
    │   │   ├── BookingDetailsModal.jsx [Modal View for Complete Reservation Info]
    │   │   ├── BookingFilter.jsx  [Search, Status, Payment & Date Filter Bar]
    │   │   ├── BookingForm.jsx    [Multi-Section Reservation Form Engine]
    │   │   ├── BookingInfoSection.jsx [Stay Dates & Room Selection Section]
    │   │   ├── BookingRow.jsx     [Individual Booking Table Row Component]
    │   │   ├── BookingTable.jsx   [Interactive Reservations Table Component]
    │   │   ├── CustomerInfoSection.jsx [Guest Identity & Contact Form Section]
    │   │   ├── InvoicePreview.jsx [Printable GST Tax Invoice Document Preview]
    │   │   └── PaymentInfoSection.jsx [Financial Amounts & Payment Status Section]
    │   ├── common/
    │   │   ├── Badge.jsx          [Status Pill Badge Component]
    │   │   ├── Breadcrumb.jsx     [Dynamic Router Path Navigation Bar]
    │   │   ├── Button.jsx         [Reusable Button Component with Variants]
    │   │   ├── Card.jsx           [Container Card Wrapper Component]
    │   │   ├── ConfirmDialog.jsx  [Generic Confirmation Dialog Modal]
    │   │   ├── DatePicker.jsx     [Styled Native Date Input Component]
    │   │   ├── DeleteDialog.jsx   [Destructive Action Confirmation Modal]
    │   │   ├── EmptyState.jsx     [Zero Data State Fallback Display]
    │   │   ├── Input.jsx          [Form Text/Password/Number Input Component]
    │   │   ├── Loader.jsx         [Spinner Loading Indicator Component]
    │   │   ├── Modal.jsx          [Accessible Backdrop Modal Dialog]
    │   │   ├── PageHeader.jsx     [Title, Subtitle & Action Bar Component]
    │   │   ├── Pagination.jsx     [Table Pagination Control Bar]
    │   │   ├── SearchBar.jsx      [Search Input Component with Clear Icon]
    │   │   ├── Select.jsx         [Styled Dropdown Select Component]
    │   │   └── Table.jsx          [Base Reusable Data Table Structure]
    │   ├── dashboard/
    │   │   ├── BookingChart.jsx   [Monthly Reservations Line/Bar Chart]
    │   │   ├── DashboardCards.jsx [4-Grid Primary KPI Stat Cards]
    │   │   ├── QuickActionCards.jsx [Shortcut Buttons for Common Tasks]
    │   │   ├── RevenueChart.jsx   [Monthly Revenue Area Chart Component]
    │   │   ├── StatusChart.jsx    [Booking Status Distribution Pie Chart]
    │   │   └── UpcomingWidget.jsx [Upcoming Check-ins Summary List]
    │   ├── layout/
    │   │   ├── DashboardLayout.jsx [Authenticated Shell with Sidebar & Navbar]
    │   │   ├── GlobalSearchModal.jsx [Ctrl+K Quick Search Command Modal]
    │   │   ├── Navbar.jsx         [Header Navigation Bar with Theme & Profile]
    │   │   └── Sidebar.jsx        [Collapsible Navigation Menu Sidebar]
    │   ├── reports/
    │   │   ├── ReportFilter.jsx   [Report Type & Date Selector Filter Bar]
    │   │   ├── ReportSummaryCards.jsx [Financial Metrics Stat Cards]
    │   │   └── ReportTable.jsx    [Financial Statements Summary Data Table]
    │   ├── settings/
    │   │   ├── GeneralSettings.jsx [Hotel Name, Address & Contact Settings]
    │   │   ├── SystemSettings.jsx [System Toggles & Email Alert Settings]
    │   │   └── TaxBillingSettings.jsx [GSTIN, Tax Rate & Invoice Prefix Form]
    │   └── users/
    │       ├── AdminFormModal.jsx [Staff Admin Add/Edit Form Modal]
    │       ├── AdminTable.jsx     [Staff Admin User List Table]
    │       └── RolePermissionsBadge.jsx [Role & Permission Pills Renderer]
    ├── context/
    │   ├── AuthContext.jsx        [User Authentication Provider & State]
    │   ├── BookingContext.jsx     [Reservations CRUD Provider & State]
    │   ├── SettingsContext.jsx    [Hotel ERP Settings Provider & State]
    │   └── ThemeContext.jsx       [Light/Dark Theme Switcher Provider]
    ├── hooks/
    │   ├── useAuth.js             [Hook to Access AuthContext]
    │   ├── useBookings.js         [Hook to Access BookingContext]
    │   ├── useDebounce.js         [Debounce Hook for Input Search Filtering]
    │   ├── useSettings.js         [Hook to Access SettingsContext]
    │   └── useTheme.js            [Hook to Access ThemeContext]
    ├── pages/
    │   ├── NotFound.jsx           [404 Fallback Error Page Component]
    │   ├── activity/
    │   │   └── ActivityLogs.jsx   [System Audit Logs View Page]
    │   ├── analytics/
    │   │   └── Analytics.jsx      [Business Intelligence & Analytics Page]
    │   ├── auth/
    │   │   └── Login.jsx          [Staff Login Portal Page]
    │   ├── booking/
    │   │   ├── AddBooking.jsx     [Create / Edit Reservation Form Page]
    │   │   ├── BookingHistory.jsx [Complete Reservations Audit List Page]
    │   │   ├── CancelledBookings.jsx [Filtered Cancelled Reservations Page]
    │   │   ├── CompletedBookings.jsx [Filtered Checked Out Stays Page]
    │   │   ├── Invoice.jsx        [Tax Invoice Generator View Page]
    │   │   └── UpcomingBookings.jsx [Filtered Upcoming Check-ins Page]
    │   ├── dashboard/
    │   │   └── Dashboard.jsx      [Main Hotel Operations Dashboard Page]
    │   ├── profile/
    │   │   └── Profile.jsx        [Admin Profile & Account Settings Page]
    │   ├── reports/
    │   │   └── Reports.jsx        [Financial & Operations Reports Page]
    │   ├── settings/
    │   │   └── Settings.jsx       [Hotel ERP System Settings Page]
    │   └── users/
    │       ├── AddAdmin.jsx       [Add Staff Admin Account Page]
    │       └── AdminList.jsx      [Staff Administrator Management Page]
    ├── routes/
    │   ├── AppRoutes.jsx          [Central Route Definitions & Hierarchy]
    │   └── PrivateRoute.jsx       [Authentication Guard Outlet Wrapper]
    ├── services/
    │   ├── activityService.js     [Audit Logging Mock Service API]
    │   ├── api.js                 [Axios Instance Configuration & Delay Helper]
    │   ├── authService.js         [Authentication & Storage Session Service]
    │   ├── bookingService.js      [Bookings CRUD Mock Service API]
    │   ├── mockData.js            [Initial Mock Seed Data & Storage Helpers]
    │   ├── reportService.js       [Financial Reports Aggregation Service]
    │   ├── settingsService.js     [Hotel System Settings Mock Service API]
    │   └── userService.js         [Admin User Management Mock Service API]
    └── utils/
        ├── constants.js           [Static Master Data & Hotel Information]
        ├── dateFormatter.js       [Date Formatting & Day Calculation Helpers]
        ├── helpers.js             [ID Generation & CSV Export Utility]
        ├── invoiceGenerator.js    [jsPDF & html2canvas PDF Export Engine]
        └── validationSchemas.js   [Zod Form Validation Schemas]
```

---

## 4. FRONTEND ARCHITECTURE

```
                               ┌─────────────────────────┐
                               │       main.jsx          │
                               └───────────┬─────────────┘
                                           │
                               ┌───────────▼─────────────┐
                               │        App.jsx          │
                               └───────────┬─────────────┘
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         │                          BrowserRouter                            │
         └─────────────────────────────────┬─────────────────────────────────┘
                                           │
 ┌─────────────────────────────────────────┴─────────────────────────────────────────┐
 │ ThemeProvider → AuthProvider → SettingsProvider → BookingProvider → Toaster      │
 └─────────────────────────────────────────┬─────────────────────────────────────────┘
                                           │
                               ┌───────────▼─────────────┐
                               │      AppRoutes.jsx      │
                               └───────────┬─────────────┘
                                           │
                 ┌─────────────────────────┴─────────────────────────┐
                 │                                                   │
      ┌──────────▼──────────┐                             ┌──────────▼──────────┐
      │   Public Route      │                             │   Guarded Route     │
      │    (/login)         │                             │   <PrivateRoute>    │
      └─────────────────────┘                             └──────────┬──────────┘
                                                                     │
                                                          ┌──────────▼──────────┐
                                                          │   DashboardLayout   │
                                                          └──────────┬──────────┘
                                                                     │
                                        ┌────────────────────────────┴────────────────────────────┐
                                        │                                                         │
                             ┌──────────▼──────────┐                                   ┌──────────▼──────────┐
                             │  Sidebar / Navbar   │                                   │    Page Component   │
                             └─────────────────────┘                                   │ (/dashboard, etc.)  │
                                                                                       └──────────┬──────────┘
                                                                                                  │
                                                                                       ┌──────────▼──────────┐
                                                                                       │   Services Layer    │
                                                                                       └──────────┬──────────┘
                                                                                                  │
                                                                                       ┌──────────▼──────────┐
                                                                                       │ window.localStorage │
                                                                                       └─────────────────────┘
```

### Component & Data Architecture Communication Flow
1. **Entry Point & Provider Tree (`main.jsx` & `App.jsx`):**  
   React 18 mounts `<App />` on `<div id="root">`. `App.jsx` constructs a global React Context provider tree wrapping `BrowserRouter`:
   - `ThemeProvider`: Controls light/dark HTML class and `localStorage` theme state.
   - `AuthProvider`: Manages current user session (`user`, `isAuthenticated`) via `authService`.
   - `SettingsProvider`: Loads and persists hotel details via `settingsService`.
   - `BookingProvider`: Manages bookings array and statistics via `bookingService`.
   - `Toaster`: Mounts global toast notification container.

2. **Routing & Route Protection (`AppRoutes.jsx` & `PrivateRoute.jsx`):**  
   `AppRoutes.jsx` specifies all route endpoints. `/login` is public. All administrative routes are wrapped inside `<PrivateRoute>`, which checks `useAuth().isAuthenticated`. Unauthenticated users are redirected to `/login`.

3. **Layout Shell (`DashboardLayout.jsx`):**  
   Guarded routes render within `<DashboardLayout>`, which features:
   - `<Sidebar>`: Dynamic width layout sidebar supporting mobile drawers and submenus.
   - `<Navbar>`: Top header containing mobile menu toggle, desktop collapse toggle, `Ctrl+K` global search button, theme toggle, notification bell dropdown, and user profile popup.
   - `<Breadcrumb>`: Auto-generated breadcrumb trail derived from `useLocation()`.
   - `<Outlet>`: Mounts child page components.
   - `<GlobalSearchModal>`: Global search overlay triggered by `Ctrl+K` or search button.

4. **Form Management & Validation Architecture:**  
   Forms (Login, Booking creation, Admin registration, System settings) utilize `react-hook-form` paired with `zod` schemas via `@hookform/resolvers/zod`. Validation rules are centralized in `src/utils/validationSchemas.js`.

5. **Services & Mock Data Layer:**  
   Services (`bookingService.js`, `settingsService.js`, `userService.js`, `activityService.js`, `authService.js`, `reportService.js`) interface with `src/services/mockData.js`. On first load, `initStorage()` checks if `localStorage` has seed keys (`hotel_bookings`, `hotel_admins`, `hotel_activity_logs`, `hotel_settings`). If missing, default mock datasets are seeded into `localStorage`. Async delays (`delay(300)`) simulate network latency.

---

## 5. FRONTEND PAGE MAP

| Page Name | Route Path | Purpose | Components Used | Data Displayed | User Actions | Backend/API Dependency | Auth Req | Role Req |
|---|---|---|---|---|---|---|---|---|
| **Login** | `/login` | Staff authentication portal | `Input`, `Button`, `Building2` icon | Hotel branding, username/password fields, quick demo account fillers | Login submit, quick fill accounts, forgot password toast | `authService.login()` -> `localStorage` | No | Public |
| **Dashboard** | `/dashboard` | Central operations & revenue hub | `PageHeader`, `QuickActionCards`, `DashboardCards`, `BookingChart`, `RevenueChart`, `StatusChart`, `UpcomingWidget`, `BookingTable`, `BookingDetailsModal`, `DeleteDialog` | Today's check-ins, upcoming/completed/cancelled counts, total revenue, line/bar/area/pie charts, recent 5 bookings | Create booking, view details, edit booking, download invoice PDF, delete booking | `BookingContext`, `bookingService` | Yes | All Admins |
| **Add / Edit Booking** | `/bookings/add` | Reservation creation & editing form | `PageHeader`, `BookingForm`, `CustomerInfoSection`, `BookingInfoSection`, `PaymentInfoSection` | Guest contact details, stay dates, room type, pricing, payment status | Submit form, reset form, generate invoice preview | `BookingContext.addBooking()`, `updateBooking()` | Yes | All Admins |
| **Booking History** | `/bookings/history` | Complete reservation audit & list | `PageHeader`, `BookingFilter`, `BookingTable`, `Pagination`, `BookingDetailsModal`, `DeleteDialog` | Paginated list of all reservations, filter counts | Search guest/invoice/room, filter status/payment/date, page navigation, view, edit, delete | `BookingContext`, `bookingService` | Yes | All Admins |
| **Upcoming Bookings** | `/bookings/upcoming` | Pre-filtered view of confirmed future check-ins | `PageHeader`, `BookingTable`, `BookingDetailsModal` | Bookings with `bookingStatus === 'Confirmed'` | View booking, edit booking, download PDF | `BookingContext` | Yes | All Admins |
| **Completed Bookings** | `/bookings/completed` | Pre-filtered view of checked-out stays | `PageHeader`, `BookingTable`, `BookingDetailsModal` | Bookings with `bookingStatus === 'Checked Out'` | View booking, edit booking, download PDF | `BookingContext` | Yes | All Admins |
| **Cancelled Bookings** | `/bookings/cancelled` | Log of cancelled reservations | `PageHeader`, `BookingTable`, `BookingDetailsModal` | Bookings with `bookingStatus === 'Cancelled'` | View booking, edit booking, download PDF | `BookingContext` | Yes | All Admins |
| **Invoice Generator** | `/bookings/invoice/:id` | Printable GST tax invoice view | `PageHeader`, `InvoicePreview` | Itemized room breakdown, 18% GST (CGST/SGST), QR scan box, guest details | Print invoice, download PDF | `BookingContext`, `settingsService` | Yes | All Admins |
| **Reports** | `/reports` | Financial & operations reporting | `PageHeader`, `ReportFilter`, `ReportSummaryCards`, `ReportTable` | Total revenue, paid revenue, pending revenue, filterable booking list | Change period (daily/monthly/yearly/custom), export CSV, export PDF | `reportService.getReportData()` | Yes | All Admins |
| **Analytics** | `/analytics` | Business intelligence charts | `PageHeader`, `OccupancyMetrics`, `RevenueAnalytics`, `BookingTrends` | RevPAR, ADR, Occupancy %, monthly revenue area chart, demand bar chart | View metrics & visual trends | `BookingContext` | Yes | All Admins |
| **Add Admin** | `/users/add` | Add new staff administrator page | `PageHeader`, `AdminFormModal` | Staff user form fields, role dropdown, permissions checkboxes | Create admin user, cancel/navigate back | `userService.createAdmin()` | Yes | Super Admin |
| **Admin List** | `/users/list` | Staff user management page | `PageHeader`, `AdminTable`, `AdminFormModal`, `DeleteDialog` | List of all staff admins, role badges, permissions, status | Add staff, edit staff, delete staff user | `userService` | Yes | Super Admin |
| **Activity Logs** | `/activity` | System audit trail page | `PageHeader`, `SearchBar`, `ActivityTable` | Chronological list of staff actions, timestamps, IP addresses | Search logs by staff name or action | `activityService.getActivityLogs()` | Yes | All Admins |
| **Settings** | `/settings` | Hotel ERP system configuration | `PageHeader`, `GeneralSettings`, `TaxBillingSettings`, `SystemSettings` | Hotel profile, GSTIN, tax rate, invoice prefix, email alerts toggle | Update and save system settings | `SettingsContext`, `settingsService` | Yes | Super Admin |
| **Profile** | `/profile` | Admin profile & account settings | `PageHeader`, `Card`, `Badge`, `Input`, `Button` | Logged-in admin details, avatar, role badge, password fields | Update account info (mock toast) | `AuthContext` | Yes | All Admins |
| **404 Not Found** | `*` | Fallback route error display | `Button`, `AlertCircle` icon | 404 error message | Return to dashboard button | None | No | Public |

---

## 6. BACKEND ARCHITECTURE

- **Status:** **NOT IMPLEMENTED / NOT FOUND**
- **Explanation:** The repository is exclusively a client-side React application. There are no backend controller files, route handlers, server scripts, ORM models, or database drivers.
- **Client-Side Simulation Layer:**
  Instead of an HTTP API, components communicate with React Contexts, which invoke service functions in `src/services/`. These services query or update JSON arrays stored in `window.localStorage` after a `setTimeout` delay:

```
[React Page / Component]
          │
          ▼
[React Context (e.g. BookingContext)]
          │
          ▼
[Service Module (e.g. bookingService.js)]
          │
          ▼  (Simulated Delay via setTimeout)
[Mock Data Utility (mockData.js)]
          │
          ▼
[Browser window.localStorage]
```

---

## 7. API INVENTORY

### Real Backend Endpoints
- **Implemented Endpoints:** **0** (No real server endpoints exist).

### Axios Configuration (`src/services/api.js`)
- `baseURL: '/api/v1'`
- `timeout: 10000`
- `headers: { 'Content-Type': 'application/json' }`
- **Request Interceptor:** Reads `hotel_admin_token` from `localStorage` and appends `Authorization: Bearer <token>`.
- **Response Interceptor:** Intercepts `401 Unauthorized` responses, clears tokens from `localStorage`, and redirects to `/login`.
- **Usage:** `api.js` is imported by service files solely for its exported `delay()` function (`const delay = (ms = 300) => new Promise(...)`). No actual HTTP calls (`api.get`, `api.post`, etc.) are executed.

### Inventory of Implemented Mock Service Methods

| Service Module | Method Name | Simulated Latency | Data Source / Action | Storage Key |
|---|---|---|---|---|
| `authService` | `login(username, password)` | 400ms | Matches credentials in `hotel_admins` array; returns mock token & user | `hotel_admin_token`, `hotel_admin_user` |
| `authService` | `logout()` | 200ms | Clears session token & user from storage | `hotel_admin_token`, `hotel_admin_user` |
| `authService` | `getCurrentUser()` | Synchronous | Parses `hotel_admin_user` string from storage | `hotel_admin_user` |
| `bookingService` | `getAllBookings()` | 300ms | Returns array of bookings sorted by creation/booking date descending | `hotel_bookings` |
| `bookingService` | `getBookingById(id)` | 200ms | Finds booking matching `id` or `invoiceNo` | `hotel_bookings` |
| `bookingService` | `createBooking(data)` | 400ms | Generates `BK-10xx` ID & `INV-GS-010xx` invoice number; logs activity | `hotel_bookings`, `hotel_activity_logs` |
| `bookingService` | `updateBooking(id, data)` | 300ms | Merges fields into targeted booking record; logs activity | `hotel_bookings`, `hotel_activity_logs` |
| `bookingService` | `deleteBooking(id)` | 300ms | Filters out targeted booking record; logs activity | `hotel_bookings`, `hotel_activity_logs` |
| `bookingService` | `getStats()` | 200ms | Computes counts for today, upcoming, completed, cancelled, revenue, & pending balances | `hotel_bookings` |
| `userService` | `getAllAdmins()` | 300ms | Returns array of staff admin user records | `hotel_admins` |
| `userService` | `createAdmin(data)` | 400ms | Generates `ADM-xxx` ID; appends new staff admin; logs activity | `hotel_admins`, `hotel_activity_logs` |
| `userService` | `updateAdmin(id, data)`| 300ms | Updates staff admin role/permissions; logs activity | `hotel_admins`, `hotel_activity_logs` |
| `userService` | `deleteAdmin(id)` | 300ms | Removes staff admin record; logs activity | `hotel_admins`, `hotel_activity_logs` |
| `activityService` | `getActivityLogs()` | 200ms | Returns array of audit logs sorted by timestamp descending | `hotel_activity_logs` |
| `activityService` | `logActivity(...)` | Synchronous | Appends new audit log with `ACT-5xxx` ID & timestamp | `hotel_activity_logs` |
| `reportService` | `getReportData(...)` | 300ms | Filters bookings by date range; calculates total revenue, paid, & pending | `hotel_bookings` |
| `settingsService` | `getSettings()` | 200ms | Returns normalized hotel settings merged with constants fallback | `hotel_settings` |
| `settingsService` | `updateSettings(data)`| 400ms | Merges and persists system settings; logs activity | `hotel_settings`, `hotel_activity_logs` |

---

## 8. DATABASE ARCHITECTURE

### Database Overview
- **Database Engine:** **Not Found (Browser `localStorage` API used as mock database)**
- **Initialization & Persistence Utility:** `src/services/mockData.js` initializes storage schemas upon first access via `initStorage()`.

### Storage Entities & Data Models

```
┌────────────────────────────────┐       ┌────────────────────────────────┐
│         hotel_admins           │       │         hotel_bookings         │
├────────────────────────────────┤       ├────────────────────────────────┤
│ id (PK)           : String     │       │ id (PK)           : String     │
│ name              : String     │       │ invoiceNo (Unique): String     │
│ email             : String     │       │ customerName      : String     │
│ role              : String     │       │ mobile            : String     │
│ status            : String     │       │ alternateMobile   : String     │
│ avatar            : String     │       │ email             : String     │
│ permissions       : Array[Str] │       │ address           : String     │
│ createdAt         : ISO Date   │       │ idProofType       : String     │
└───────────────┬────────────────┘       │ idNumber          : String     │
                │                        │ bookingDate       : Date (YYYY)│
                │ (Implicit Audit)       │ checkIn           : Date (YYYY)│
                ▼                        │ checkOut          : Date (YYYY)│
┌────────────────────────────────┐       │ totalDays         : Number     │
│      hotel_activity_logs       │       │ adults            : Number     │
├────────────────────────────────┤       │ children          : Number     │
│ id (PK)           : String     │       │ roomNumber        : String     │
│ adminName         : String     │       │ roomType          : String     │
│ action            : String     │       │ totalAmount       : Number     │
│ details           : String     │       │ advanceAmount     : Number     │
│ ipAddress         : String     │       │ remainingAmount   : Number     │
│ timestamp         : ISO Date   │       │ paymentMethod     : String     │
└────────────────────────────────┘       │ transactionId     : String     │
                                         │ paymentStatus     : String     │
┌────────────────────────────────┐       │ bookingStatus     : String     │
│         hotel_settings         │       │ notes             : String     │
├────────────────────────────────┤       │ createdAt         : ISO Date   │
│ hotelName / name  : String     │       └────────────────────────────────┘
│ tagline           : String     │
│ address           : String     │
│ phone             : String     │
│ email             : String     │
│ gstin             : String     │
│ invoicePrefix     : String     │
│ taxRate           : Number     │
│ currencySymbol    : String     │
│ emailAlerts       : Boolean    │
└────────────────────────────────┘
```

---

## 9. AUTHENTICATION & AUTHORIZATION

### Authentication Flow
```
User Enters Credentials on /login
              │
              ▼
    Form Validation (Zod)
              │
              ▼
   authService.login(username, password)
              │
              ▼
Lookup matching email/username in hotel_admins array
              │
              ▼
Generate Mock Token (`jwt-token-demo-${Date.now()}`)
              │
              ▼
Save token & user object to window.localStorage
('hotel_admin_token', 'hotel_admin_user')
              │
              ▼
  Set user state in AuthContext
              │
              ▼
  Navigate to /dashboard
```

### Authentication Details
- **Login Credentials:**
  - Super Admin: `admin@grandstay.com` / `admin123`
  - Manager: `sarah.manager@grandstay.com` / `manager123`
- **Password Hashing:** **Not Found** (Stored in plain text within client-side code).
- **Token Mechanism:** Synthetic token string generated via `Date.now()`. No signature, expiration timestamp, or cryptographic validation.
- **Session Persistence:** `localStorage.getItem('hotel_admin_token')` and `localStorage.getItem('hotel_admin_user')`.

### Authorization & RBAC
- **Roles Defined (`constants.js`):**
  - `super_admin`: Super Admin
  - `manager`: Manager
  - `receptionist`: Receptionist
  - `accountant`: Accountant
- **Permissions Defined (`constants.js`):**
  - `manage_bookings`: Create & Manage Bookings
  - `view_reports`: View & Export Reports
  - `view_analytics`: View Revenue & Analytics
  - `manage_admins`: Manage Staff Admins
  - `manage_settings`: Configure System Settings
- **Route Guard Protection:** `<PrivateRoute>` checks `isAuthenticated` state. However, individual routes do not check specific permission arrays (e.g., any logged-in user can navigate to `/settings` or `/users/list`).

---

## 10. COMPLETE APPLICATION WORKFLOWS

### 1. Staff Login Workflow
1. User navigates to `/login`.
2. User fills credentials or clicks a quick-fill demo account button (Super Admin / Manager).
3. React Hook Form validates inputs against `loginSchema` (Zod).
4. `authService.login()` executes a 400ms delay, checks `hotel_admins` in `localStorage`, generates a token, and saves session info.
5. `AuthContext` updates user state; `<PrivateRoute>` unlocks guarded routes.
6. App navigates to `/dashboard` displaying welcome toast notification.

### 2. Dashboard Operations & Loading Workflow
1. User visits `/dashboard`.
2. `BookingContext` calls `bookingService.getAllBookings()` and `bookingService.getStats()`.
3. Metric Cards display total revenue, today's check-ins, upcoming stays, completed stays, cancelled stays, and pending payment totals.
4. Charts render revenue trends, booking counts, and status distribution via Recharts.
5. Live Recent Bookings table displays the latest 5 reservations with action controls for View, Edit, PDF Invoice Download, and Delete.

### 3. Add Guest Reservation Workflow
1. User clicks **"Create New Booking"** on Dashboard or Navigates to `/bookings/add`.
2. Form fields render across 3 sections: Customer Information, Stay & Room Details, Payment & Status Information.
3. User selects Check-in and Check-out dates; `calculateDays()` automatically computes `totalDays`.
4. User enters Total Amount and Advance Paid; `useEffect` automatically calculates `remainingAmount`.
5. Form submit validates inputs against `bookingFormSchema`.
6. `bookingService.createBooking()` generates a new ID (`BK-1008`), formats invoice number (`INV-GS-01008`), prepends to `hotel_bookings` in `localStorage`, and logs activity to `hotel_activity_logs`.
7. App navigates to `/bookings/history` with a success toast.

### 4. Edit Guest Reservation Workflow
1. Staff member clicks **Edit** on a booking row.
2. Router navigates to `/bookings/add` passing the target booking object via `location.state`.
3. `BookingForm` populates with existing values.
4. Staff edits room number, stay dates, or payment status and clicks **"Save Booking Record"**.
5. `bookingService.updateBooking()` updates the record in `localStorage` and writes an audit log entry.
6. Router navigates back to `/bookings/history`.

### 5. Invoice Generation & PDF Export Workflow
1. User clicks **Invoice** icon on a booking row or visits `/bookings/invoice/:id`.
2. `InvoicePreview.jsx` renders the printable invoice template with hotel profile settings (Name, Tagline, Address, GSTIN), guest info, itemized room charges, 18% GST (9% CGST + 9% SGST), grand total, advance paid, balance due, and a scan QR box.
3. Clicking **"Print Invoice"** executes `window.print()` (applying `@media print` CSS rules hiding navigation elements).
4. Clicking **"Download PDF"** invokes `downloadInvoicePdf()`, using `html2canvas` to render `#printable-invoice-card` into a canvas element and `jspdf` to compile a downloadable PDF file (`INV-GS-01001.pdf`).

---

## 11. BOOKING SYSTEM ANALYSIS

### Data Field Breakdown & Storage Specifications
- **Booking ID (`id`):** Primary Key string generated as `BK-10xx`.
- **Invoice Number (`invoiceNo`):** Unique formatted string `INV-GS-010xx` generated via `formatInvoiceNo()`.
- **Guest Identity:** `customerName`, `mobile`, `alternateMobile`, `email`, `address`, `idProofType` (Aadhar Card, Passport, Driving License, Voter ID Card, National ID), `idNumber`.
- **Stay & Room Details:** `bookingDate`, `checkIn`, `checkOut`, `totalDays` (computed auto-difference), `adults`, `children`, `roomNumber`, `roomType` (Standard Room, Deluxe Suite, Executive Suite, Family Suite, Presidential Suite).
- **Financial Details:** `totalAmount`, `advanceAmount`, `remainingAmount` (`totalAmount - advanceAmount`), `paymentMethod` (Cash, Card, UPI, Net Banking), `transactionId`, `paymentStatus` (Paid, Partial, Pending).
- **Reservation Status:** `bookingStatus` (Confirmed, Checked In, Checked Out, Cancelled).
- **System Timestamps:** `createdAt` (ISO 8601 string).

### Search, Filtering & Pagination Architecture
- **Debounced Search (`useDebounce`):** 250ms debounce delay filters bookings by guest name, invoice number, room number, or mobile number.
- **Filters (`BookingFilter.jsx`):** Status Filter (All, Confirmed, Checked In, Checked Out, Cancelled), Payment Filter (All, Paid, Partial, Pending), Date Range Filter (`startDate`, `endDate`).
- **Pagination (`Pagination.jsx`):** Client-side slicing using `pageSize = 8`.

---

## 12. SETTINGS MODULE ANALYSIS

### Configuration Architecture
- **Settings UI (`Settings.jsx`):** Composed of 3 sub-form components:
  - `GeneralSettings.jsx`: Hotel Name, Tagline, Contact Phone, Email, Physical Address.
  - `TaxBillingSettings.jsx`: GSTIN / Tax Identification Number, Tax Rate %, Currency Symbol, Invoice Prefix.
  - `SystemSettings.jsx`: Automated Email Alerts Toggle, Nightly Backup Toggle.
- **Validation:** Validated using `hotelSettingsSchema` (Zod).
- **Persistence:** Saved in `localStorage` under `hotel_settings`. Loaded by `SettingsContext` on app initialization and consumed dynamically across the Navbar, Sidebar, Login page, and Invoice components.

---

## 13. INVOICE SYSTEM

### Tax & Financial Calculations (`InvoicePreview.jsx`)
- **Subtotal:** Base total amount of room stay (`booking.totalAmount`).
- **Tax Rate:** Configured via System Settings (Default: 18% GST).
- **CGST:** `subtotal * ((taxRate / 2) / 100)` (9%).
- **SGST:** `subtotal * ((taxRate / 2) / 100)` (9%).
- **Grand Total:** `subtotal + CGST + SGST`.
- **Advance Paid:** Subtracted from Grand Total to compute **Balance Due**.

### PDF Generation Mechanics (`invoiceGenerator.js`)
- `html2canvas` captures `#printable-invoice-card` DOM element at `scale: 2` with white background.
- `jspdf` generates an A4 PDF document (`210mm x 297mm`), calculates proportional image height, handles page splits for long documents, and triggers browser download.

---

## 14. SECURITY AUDIT

| Risk Category | Severity | Findings & Evidence in Codebase | Recommended Mitigation |
|---|---|---|---|
| **Password Hashing** | **CRITICAL** | Passwords are stored in plain text in `mockData.js` (`admin123`, `manager123`) and compared directly as string literals. | Implement bcrypt / Argon2 password hashing on a real backend. |
| **Data Persistence & Storage** | **HIGH** | All customer reservations, admin account info, and audit logs are stored unencrypted in browser `localStorage`. | Migrate data storage to a secure backend database (PostgreSQL/MongoDB). |
| **Authentication Tokens** | **HIGH** | `authService.login()` generates synthetic un-signed tokens (`jwt-token-demo-177...`). No signature or expiration check occurs. | Implement secure OAuth2 / JSON Web Tokens signed with HMAC/RSA on server. |
| **Role-Based Access Control** | **MEDIUM** | Admin roles and permission arrays exist on user objects, but route guards (`PrivateRoute.jsx`) only verify authentication status, allowing any user to access `/settings` and `/users/list`. | Implement granular RBAC guards on routes and UI action buttons. |
| **API Transport Security** | **LOW / NA** | Axios client is configured with Bearer headers in `api.js`, but services bypass Axios entirely and do not send network traffic. | Connect services to HTTPS REST endpoints protected by CORS and Rate Limiting. |
| **Input Validation** | **LOW (Good)** | Forms use strict Zod schemas preventing malicious payload formats on client inputs. | Maintain Zod schemas and add server-side validation. |

---

## 15. CODE ARCHITECTURE QUALITY

| Quality Category | Rating | Justification & Evidence |
|---|---|---|
| **Component Reusability** | **EXCELLENT** | Extensive set of common UI primitives (`Button`, `Input`, `Select`, `Modal`, `Card`, `Table`, `Badge`, `PageHeader`, `Pagination`) used consistently across all pages. |
| **Folder Organization** | **EXCELLENT** | Clean domain-driven structure dividing components and pages by feature area (`booking`, `analytics`, `reports`, `users`, `settings`, `activity`, `layout`). |
| **Naming Conventions** | **EXCELLENT** | Clear, self-documenting component, function, and variable names (e.g., `calculateDays`, `formatInvoiceNo`, `downloadInvoicePdf`). |
| **Separation of Concerns** | **GOOD** | Clear separation between visual components, state contexts, custom hooks, and service logic modules. |
| **State Management** | **GOOD** | Effective use of Context API (`Auth`, `Booking`, `Settings`, `Theme`) for shared domain state without over-complicating local component state. |
| **API Separation** | **NEEDS IMPROVEMENT** | `api.js` defines an Axios instance that is never used by services; service files duplicate direct `localStorage` calls. |
| **Scalability** | **NEEDS IMPROVEMENT** | Storing all data in `localStorage` JSON arrays will crash or slow down browser performance as dataset size grows. Requires backend API migration. |

---

## 16. CURRENT PROBLEMS

### Problem Categorization & Analysis

#### CRITICAL
1. **No Backend or Real Database:**  
   - **File:** `src/services/*`, `src/services/mockData.js`  
   - **Impact:** All data is confined to the local browser instance. Refreshing or switching devices resets or isolates data, preventing multi-user hotel staff operation.

2. **Insecure Plain-Text Passwords & Mock Tokens:**  
   - **File:** `src/services/authService.js`, `src/services/mockData.js`  
   - **Impact:** Zero authentication security; credentials and session tokens are unencrypted and trivial to forge.

#### HIGH
1. **Unused Dependencies in `package.json`:**  
   - **File:** `package.json` (line 15: `"framer-motion": "^11.11.0"`)  
   - **Impact:** `framer-motion` is included in project dependencies but never imported in any source component, inflating bundle size unnecessarily.

2. **Axios Client Configuration Bypassed:**  
   - **File:** `src/services/api.js`  
   - **Impact:** `axios.create()` and request/response interceptors are configured but unused by service modules, creating dead code and misleading architectural intent.

#### MEDIUM
1. **Global Search Result Click Navigation Handling:**  
   - **File:** `src/components/layout/GlobalSearchModal.jsx` (line 70)  
   - **Impact:** Clicking a matching booking search result navigates to `/bookings/history` without automatically focusing or opening the targeted booking's detail modal.

2. **Un-Guarded Role Permissions:**  
   - **File:** `src/routes/AppRoutes.jsx`, `src/routes/PrivateRoute.jsx`  
   - **Impact:** Receptionist accounts can access `/settings` and `/users/list` pages because `<PrivateRoute>` only checks login status, not specific user roles or permission lists.

#### LOW
1. **Hardcoded IP Address in Activity Audit Logs:**  
   - **File:** `src/services/activityService.js` (line 18)  
   - **Impact:** Audit logs hardcode IP address `'192.168.1.105'` for all staff actions rather than capturing actual network client IPs.

---

## 17. IMPLEMENTED VS NOT IMPLEMENTED FEATURE MATRIX

| ERP Feature / Module | Status | Frontend Implementation | Backend Implementation | Database Persistence |
|---|---|---|---|---|
| **Dashboard Operations Hub** | ✅ Fully Implemented | Complete UI, Stat Cards & Recharts | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **Reservation CRUD Engine** | ✅ Fully Implemented | Complete Forms, Modals & Tables | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **GST Tax Invoice Generator** | ✅ Fully Implemented | 18% Tax Calculation, Print & PDF | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **Financial & Operations Reports** | ✅ Fully Implemented | Filter Cards, CSV & PDF Exports | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **Business Intelligence Analytics** | ✅ Fully Implemented | Recharts RevPAR, ADR & Trends | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **Staff & Admin Management** | ✅ Fully Implemented | User Table, Role & Permission Modal | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **System Activity Audit Trail** | ✅ Fully Implemented | Searchable Log Table & Timestamps | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **Hotel ERP System Settings** | ✅ Fully Implemented | Profile, GSTIN, Tax & Prefix Forms | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **Staff Authentication Portal** | 🟡 Partially Implemented | Login Form, Demo Account Buttons | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **Role-Based Access Control (RBAC)** | 🟡 Partially Implemented | Role Badges & Permissions Data | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **Global Search Command (`Ctrl+K`)** | 🟡 Partially Implemented | Modal & Debounced Search | ❌ Not Implemented | ⚠️ Mock (`localStorage`) |
| **Real Database Integration** | ❌ Not Implemented | N/A | ❌ Not Implemented | ❌ Not Implemented |
| **Multi-Property Multi-Tenant Support**| ❌ Not Implemented | N/A | ❌ Not Implemented | ❌ Not Implemented |
| **Payment Gateway Integration** | ❌ Not Implemented | Scan QR Placeholder Only | ❌ Not Implemented | ❌ Not Implemented |

---

## 18. DEPENDENCY ANALYSIS

| Package Name | Version | Scope / Purpose | Classified Role | Notes / Recommendations |
|---|---|---|---|---|
| `react` | `^18.3.1` | Core UI Framework | Frontend Dependency | Up to date, stable React 18 release |
| `react-dom` | `^18.3.1` | React DOM Renderer | Frontend Dependency | Matches `react` version |
| `vite` | `^5.4.10` | Build Tool & Dev Server | Dev Dependency | Fast HMR build tool |
| `@vitejs/plugin-react` | `^4.3.3` | React Plugin for Vite | Dev Dependency | Enables Fast Refresh |
| `react-router-dom` | `^6.28.0` | Client-side Routing | Frontend Dependency | Core router for SPA navigation |
| `tailwindcss` | `^3.4.14` | CSS Framework | Dev Dependency | Utility-first styling framework |
| `postcss` | `^8.4.47` | CSS Tooling | Dev Dependency | Tool for transforming CSS |
| `autoprefixer` | `^10.4.20` | CSS Vendor Prefixing | Dev Dependency | Parses CSS and adds vendor prefixes |
| `lucide-react` | `^0.460.0` | UI Icons Library | Frontend Dependency | Modern SVG icons |
| `react-hook-form` | `^7.53.0` | Form State Management | Frontend Dependency | Performant form state handling |
| `zod` | `^3.23.8` | Schema Validation | Frontend Dependency | TypeScript-first schema validation |
| `@hookform/resolvers` | `^3.9.0` | Form Resolver Adapter | Frontend Dependency | Connects Zod validation to React Hook Form |
| `recharts` | `^2.13.0` | Data Visualization Charts | Frontend Dependency | SVG chart components |
| `jspdf` | `^2.5.2` | PDF Generation Engine | Frontend Dependency | Client-side PDF creation |
| `html2canvas` | `^1.4.1` | DOM Element Screen Capture | Frontend Dependency | Rasterizes HTML DOM to canvas for PDF |
| `react-hot-toast` | `^2.4.1` | Toast Notification Library | Frontend Dependency | Lightweight toast alerts |
| `axios` | `^1.7.7` | HTTP Request Client | Frontend Dependency | **Currently Unused** in actual service layer |
| `framer-motion` | `^11.11.0` | Animation Library | Frontend Dependency | **Unused Dependency** (Not imported in `src/`) |

---

## 19. DATA FLOW DIAGRAMS

### 1. Reservation Creation Data Flow
```
User Fills Booking Form
          │
          ▼
Zod Schema Validation (bookingFormSchema)
          │
          ▼
AddBooking Component → useBookings().addBooking()
          │
          ▼
BookingContext Executing addBooking()
          │
          ▼
bookingService.createBooking(bookingData)
          │  ├── Generates ID (BK-1008) & Invoice No (INV-GS-01008)
          │  ├── Calculates totalStayDays & remainingBalance
          │  └── Triggers activityService.logActivity()
          ▼
Updates hotel_bookings JSON Array in window.localStorage
          │
          ▼
BookingContext Triggers fetchBookings() & Fires Toast Alert
          │
          ▼
UI Renders Updated Bookings List across Dashboard & History Tables
```

---

## 20. PROJECT ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             BROWSER CLIENT SPA                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        React 18 Component Tree                        │  │
│  │                                                                       │  │
│  │  [ Login / Auth ]   [ Dashboard ]   [ Bookings ]   [ Reports/Admin ]  │  │
│  │           │               │              │                 │          │  │
│  └───────────┼───────────────┼──────────────┼─────────────────┼──────────┘  │
│              │               │              │                 │             │
│  ┌───────────▼───────────────▼──────────────▼─────────────────▼──────────┐  │
│  │                         React Context Layer                           │  │
│  │                                                                       │  │
│  │     ThemeContext  │  AuthContext  │  BookingContext  │ SettingsContext│  │
│  └───────────┬───────────────┬──────────────┬─────────────────┬──────────┘  │
│              │               │              │                 │             │
│  ┌───────────▼───────────────▼──────────────▼─────────────────▼──────────┐  │
│  │                       Mock Services Layer                             │  │
│  │                                                                       │  │
│  │   authService  │  bookingService  │  userService  │  settingsService  │  │
│  └───────────┬───────────────┬──────────────┬─────────────────┬──────────┘  │
│              │               │              │                 │             │
│              └───────────────┼──────────────┴─────────────────┘             │
│                              │                                              │
│                              ▼                                              │
│                ┌──────────────────────────┐                                 │
│                │   src/services/mockData  │                                 │
│                └─────────────┬────────────┘                                 │
│                              │                                              │
│                              ▼                                              │
│                ┌──────────────────────────┐                                 │
│                │   window.localStorage    │                                 │
│                └──────────────────────────┘                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 21. FINAL TECHNICAL SUMMARY

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Lucide React icons, React Router DOM 6. Clean, responsive, glassmorphism design with Light/Dark theme persistence.
- **Backend:** **Not Implemented** (No server, controllers, or API endpoints exist).
- **Database:** **Not Implemented** (Browser `localStorage` utilized for seed data and mock JSON persistence).
- **Authentication:** Client-side mock auth with pre-filled credentials, synthetic tokens in `localStorage`, and route protection via `<PrivateRoute>`.
- **API:** Axios configured in `src/services/api.js` but bypassed in favor of direct `localStorage` mock methods.
- **PDF & Printing:** Dynamic client-side GST tax invoice preview with native browser printing and high-res PDF export using `html2canvas` + `jspdf`.
- **State Management:** React Context API (`Auth`, `Booking`, `Settings`, `Theme`) + React Hook Form with Zod validation.
- **UI / UX:** Premium modern dashboard layout featuring Recharts visualizations, debounced search filters, action modals, and toast alerts.
- **Deployment:** Production build configured via `vite build` (compiles output to `./dist`).

---

## 22. PROJECT MATURITY SCORE

### Final Score: **68 / 100**

```
┌────────────────────────────────────────────────────────────┐
│                    PROJECT MATURITY RADAR                  │
├─────────────────────────────┬────────┬─────────────────────┤
│ Category                    │ Score  │ Rating              │
├─────────────────────────────┼────────┼─────────────────────┤
│ Architecture & Design       │ 85/100 │ Very Good           │
│ UI / UX Aesthetics          │ 95/100 │ Excellent           │
│ Frontend Implementation     │ 90/100 │ Excellent           │
│ Backend Implementation      │ 0/100  │ Not Implemented     │
│ Database Architecture       │ 10/100 │ Mock Only           │
│ Security Implementation     │ 30/100 │ Poor / Critical Risk│
│ Code Quality & Organization │ 88/100 │ Very Good           │
│ Scalability                 │ 40/100 │ Needs Refactoring   │
│ Error Handling & Feedback   │ 85/100 │ Very Good           │
│ Production Readiness        │ 55/100 │ Prototype Only      │
├─────────────────────────────┼────────┼─────────────────────┤
│ OVERALL MATURITY SCORE      │ 68/100 │ Functional Prototype│
└─────────────────────────────┴────────┴─────────────────────┘
```

### Category Justifications
1. **Architecture & Design (85/100):** Clean component hierarchy, well-structured React Context providers, reusable UI components, and modular routing.
2. **UI / UX Aesthetics (95/100):** Wows at first glance with curated brand colors, sleek glassmorphism, responsive Tailwind layouts, interactive Recharts visualizations, and seamless dark mode toggling.
3. **Frontend Implementation (90/100):** High quality React Hook Form implementation, Zod validations, debounced search filtering, toast alerts, dynamic stay/balance calculations, and PDF invoice generation.
4. **Backend Implementation (0/100):** Completely missing; no real API server or backend framework code exists.
5. **Database Architecture (10/100):** No real database engine or ORM exists; relies entirely on browser `localStorage`.
6. **Security Implementation (30/100):** Passwords stored in plain text, tokens generated synthetically without cryptographic verification, sensitive user data stored unencrypted in browser storage, and un-guarded route permissions.
7. **Code Quality & Organization (88/100):** Follows consistent naming conventions, clear directory separation, clean formatting, and modular code.
8. **Scalability (40/100):** Frontend architecture is solid, but reliance on `localStorage` prevents multi-user scalability and data synchronization.
9. **Error Handling & Feedback (85/100):** Excellent toast notifications, loading spinners, form error messages, and 404 fallbacks.
10. **Production Readiness (55/100):** Ready as a high-fidelity frontend prototype/demo, but requires backend API integration before handling live hotel operational data.

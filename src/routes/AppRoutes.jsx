import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { AddBooking } from '../pages/booking/AddBooking';
import { BookingHistory } from '../pages/booking/BookingHistory';
import { UpcomingBookings } from '../pages/booking/UpcomingBookings';
import { CompletedBookings } from '../pages/booking/CompletedBookings';
import { CancelledBookings } from '../pages/booking/CancelledBookings';
import { Invoice } from '../pages/booking/Invoice';
import { Reports } from '../pages/reports/Reports';
import { Analytics } from '../pages/analytics/Analytics';
import { AddAdmin } from '../pages/users/AddAdmin';
import { AdminList } from '../pages/users/AdminList';
import { ActivityLogs } from '../pages/activity/ActivityLogs';
import { Settings } from '../pages/settings/Settings';
import { Profile } from '../pages/profile/Profile';
import { NotFound } from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Private Guarded Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Booking Routes */}
          <Route path="/bookings/add" element={<AddBooking />} />
          <Route path="/bookings/history" element={<BookingHistory />} />
          <Route path="/bookings/upcoming" element={<UpcomingBookings />} />
          <Route path="/bookings/completed" element={<CompletedBookings />} />
          <Route path="/bookings/cancelled" element={<CancelledBookings />} />
          <Route path="/bookings/invoice/:id" element={<Invoice />} />

          {/* Reports & Analytics */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* User Management */}
          <Route path="/users/add" element={<AddAdmin />} />
          <Route path="/users/list" element={<AdminList />} />

          {/* Activity & Settings */}
          <Route path="/activity" element={<ActivityLogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

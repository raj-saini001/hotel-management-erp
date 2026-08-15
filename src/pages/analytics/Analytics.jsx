import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { OccupancyMetrics } from '../../components/analytics/OccupancyMetrics';
import { RevenueAnalytics } from '../../components/analytics/RevenueAnalytics';
import { BookingTrends } from '../../components/analytics/BookingTrends';

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Intelligence & Analytics"
        subtitle="Deep analysis of revenue growth targets, demand trends, and room occupancy rates"
      />

      <OccupancyMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueAnalytics />
        <BookingTrends />
      </div>
    </div>
  );
};

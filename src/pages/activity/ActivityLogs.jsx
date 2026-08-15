import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { SearchBar } from '../../components/common/SearchBar';
import { ActivityTable } from '../../components/activity/ActivityTable';
import { activityService } from '../../services/activityService';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';

export const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await activityService.getActivityLogs();
        setLogs(data);
      } catch (err) {
        toast.error('Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      l.adminName.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Activity & Audit Logs"
        subtitle="Chronological audit history of actions performed by staff members"
        action={
          <div className="w-full sm:w-64">
            <SearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="Search logs by staff or action..."
            />
          </div>
        }
      />

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <ActivityTable logs={filteredLogs} />
      </div>
    </div>
  );
};

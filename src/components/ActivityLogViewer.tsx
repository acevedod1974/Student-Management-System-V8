import React, { useState, useEffect } from 'react';
import { useActivityLog } from '../hooks/useActivityLog';
import { LoadingState } from './LoadingState';
import { ActivityLog } from '../services/activityLog';

const ITEMS_PER_PAGE = 20;

interface FilterState {
  entityType: ActivityLog['entityType'] | 'all';
  startDate: string;
  endDate: string;
}

interface LogOptions {
  limit: number;
  offset: number;
  entityType?: ActivityLog['entityType'];
  startDate?: Date;
  endDate?: Date;
}

export function ActivityLogViewer() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    entityType: 'all',
    startDate: '',
    endDate: '',
  });

  const { getActivityLogs } = useActivityLog();

  const fetchLogs = React.useCallback(async () => {
    setLoading(true);
    try {
      const options: LogOptions = {
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
      };

      if (filters.entityType !== 'all') {
        options.entityType = filters.entityType;
      }
      if (filters.startDate) {
        options.startDate = new Date(filters.startDate);
      }
      if (filters.endDate) {
        options.endDate = new Date(filters.endDate);
      }

      const data = await getActivityLogs(options);
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, getActivityLogs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const renderEntityBadge = (type: ActivityLog['entityType']) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      course: 'bg-green-100 text-green-800',
      grade: 'bg-purple-100 text-purple-800',
      system: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={filters.entityType}
            onChange={(e) => handleFilterChange('entityType', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">All Types</option>
            <option value="student">Student</option>
            <option value="course">Course</option>
            <option value="grade">Grade</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Timestamp</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Action</th>
                  <th className="px-4 py-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-2">{formatDate(log.timestamp!)}</td>
                    <td className="px-4 py-2">{renderEntityBadge(log.entityType)}</td>
                    <td className="px-4 py-2">{log.action}</td>
                    <td className="px-4 py-2">
                      {log.details && (
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={logs.length < ITEMS_PER_PAGE}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
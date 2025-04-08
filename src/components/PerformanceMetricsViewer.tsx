import React, { useState, useEffect, useMemo } from "react";
import { performanceMonitor } from "../services/performance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FilterState {
  type: "render" | "api" | "interaction" | "all";
  component?: string;
  timeRange: "5min" | "15min" | "1hour" | "all";
}

interface MetricOptions {
  type?: "render" | "api" | "interaction";
  component?: string;
  startTime?: number;
  endTime?: number;
}

interface AggregatedMetric {
  action: string;
  averageDuration: number;
  count: number;
}

export function PerformanceMetricsViewer() {
  const [metrics, setMetrics] = useState<AggregatedMetric[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    timeRange: "15min",
  });

  const timeRangeToMs = useMemo(
    () => ({
      "5min": 5 * 60 * 1000,
      "15min": 15 * 60 * 1000,
      "1hour": 60 * 60 * 1000,
      all: Infinity,
    } as const),
    []
  );

  useEffect(() => {
    const updateMetrics = () => {
      const options: MetricOptions = {};

      if (filters.type !== "all") {
        options.type = filters.type;
      }

      if (filters.component) {
        options.component = filters.component;
      }

      if (filters.timeRange !== "all") {
        const timeRange = timeRangeToMs[filters.timeRange];
        options.startTime = Date.now() - timeRange;
      }

      const aggregatedMetrics = performanceMonitor.getAverageMetrics(options);

      setMetrics(
        aggregatedMetrics.map((metric) => ({
          ...metric,
          averageDuration: Math.round(metric.averageDuration),
        }))
      );
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [filters, timeRangeToMs]);

  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const formatDuration = (duration: number) => {
    return duration > 1000
      ? `${(duration / 1000).toFixed(2)}s`
      : `${Math.round(duration)}ms`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="all">All Types</option>
            <option value="render">Render</option>
            <option value="api">API Calls</option>
            <option value="interaction">User Interactions</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time Range</label>
          <select
            value={filters.timeRange}
            onChange={(e) => handleFilterChange("timeRange", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="5min">Last 5 minutes</option>
            <option value="15min">Last 15 minutes</option>
            <option value="1hour">Last hour</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Average Duration by Action</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="action"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis
                label={{
                  value: "Duration (ms)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                formatter={(value: number) => formatDuration(value)}
                labelFormatter={(label: string) =>
                  label.split(":").pop() || label
                }
              />
              <Line
                type="monotone"
                dataKey="averageDuration"
                stroke="#4f46e5"
                name="Average Duration"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Detailed Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Average Duration</th>
                <th className="px-4 py-2 text-left">Count</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.action} className="border-t">
                  <td className="px-4 py-2">{metric.action}</td>
                  <td className="px-4 py-2">
                    {formatDuration(metric.averageDuration)}
                  </td>
                  <td className="px-4 py-2">{metric.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

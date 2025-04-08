// Define allowed metadata value types
type MetadataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | { [key: string]: MetadataValue }
  | MetadataValue[];

interface PerformanceMetric {
  type: "render" | "api" | "interaction";
  component?: string;
  action: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, MetadataValue>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000;

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackRender(
    component: string,
    duration: number,
    metadata?: Record<string, MetadataValue>
  ) {
    this.addMetric({
      type: "render",
      component,
      action: "render",
      duration,
      timestamp: Date.now(),
      metadata,
    });
  }

  trackApiCall(
    action: string,
    duration: number,
    metadata?: Record<string, MetadataValue>
  ) {
    this.addMetric({
      type: "api",
      action,
      duration,
      timestamp: Date.now(),
      metadata,
    });
  }

  trackInteraction(
    action: string,
    duration: number,
    metadata?: Record<string, MetadataValue>
  ) {
    this.addMetric({
      type: "interaction",
      action,
      duration,
      timestamp: Date.now(),
      metadata,
    });
  }

  getMetrics(options?: {
    type?: PerformanceMetric["type"];
    component?: string;
    action?: string;
    startTime?: number;
    endTime?: number;
  }): PerformanceMetric[] {
    let filteredMetrics = this.metrics;

    if (options) {
      filteredMetrics = this.metrics.filter((metric) => {
        if (options.type && metric.type !== options.type) return false;
        if (options.component && metric.component !== options.component)
          return false;
        if (options.action && metric.action !== options.action) return false;
        if (options.startTime && metric.timestamp < options.startTime)
          return false;
        if (options.endTime && metric.timestamp > options.endTime) return false;
        return true;
      });
    }

    return filteredMetrics;
  }

  getAverageMetrics(options?: {
    type?: PerformanceMetric["type"];
    component?: string;
    action?: string;
    startTime?: number;
    endTime?: number;
  }): { action: string; averageDuration: number; count: number }[] {
    const metrics = this.getMetrics(options);
    const groupedMetrics: Record<string, { total: number; count: number }> = {};

    metrics.forEach((metric) => {
      const key = `${metric.type}:${metric.component || ""}:${metric.action}`;
      if (!groupedMetrics[key]) {
        groupedMetrics[key] = { total: 0, count: 0 };
      }
      groupedMetrics[key].total += metric.duration;
      groupedMetrics[key].count++;
    });

    return Object.entries(groupedMetrics).map(([key, { total, count }]) => ({
      action: key,
      averageDuration: total / count,
      count,
    }));
  }

  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift(); // Remove oldest metric
    }

    // Log slow operations (over 1 second)
    if (metric.duration > 1000) {
      console.warn("Slow operation detected:", {
        ...metric,
        timestamp: new Date(metric.timestamp).toISOString(),
      });
    }
  }

  clearMetrics() {
    this.metrics = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

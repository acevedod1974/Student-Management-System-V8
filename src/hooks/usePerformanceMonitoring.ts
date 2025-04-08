import { useEffect, useRef } from "react";
import { performanceMonitor } from "../services/performance";

export function usePerformanceMonitoring(componentName: string) {
  const renderStartTime = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();

    return () => {
      const duration = performance.now() - renderStartTime.current;
      performanceMonitor.trackRender(componentName, duration);
    };
  });

  const trackInteraction = (
    action: string,
    callback: () => void | Promise<void>
  ) => {
    const startTime = performance.now();

    const execute = async () => {
      try {
        await callback();
      } finally {
        const duration = performance.now() - startTime;
        performanceMonitor.trackInteraction(action, duration, {
          component: componentName,
        });
      }
    };

    execute();
  };

  return { trackInteraction };
}

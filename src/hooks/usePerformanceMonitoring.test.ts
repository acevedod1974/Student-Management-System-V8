import { renderHook, act } from "@testing-library/react";
import { usePerformanceMonitoring } from "./usePerformanceMonitoring";
import { performanceMonitor } from "../services/performance";

jest.mock("../services/performance", () => ({
  performanceMonitor: {
    trackRender: jest.fn(),
    trackInteraction: jest.fn(),
  },
}));

describe("usePerformanceMonitoring", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("tracks component render time", () => {
    const { unmount } = renderHook(() =>
      usePerformanceMonitoring("TestComponent")
    );

    // Simulate some time passing
    jest.advanceTimersByTime(100);

    unmount();

    expect(performanceMonitor.trackRender).toHaveBeenCalledWith(
      "TestComponent",
      expect.any(Number)
    );
  });

  it("tracks interaction duration", async () => {
    const { result } = renderHook(() =>
      usePerformanceMonitoring("TestComponent")
    );

    const callback = jest.fn().mockResolvedValue(undefined);

    await act(async () => {
      result.current.trackInteraction("test-action", callback);
      jest.advanceTimersByTime(100);
    });

    expect(performanceMonitor.trackInteraction).toHaveBeenCalledWith(
      "test-action",
      expect.any(Number),
      { component: "TestComponent" }
    );
    expect(callback).toHaveBeenCalled();
  });

  it("handles async interactions", async () => {
    const { result } = renderHook(() =>
      usePerformanceMonitoring("TestComponent")
    );

    const asyncCallback = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

    await act(async () => {
      result.current.trackInteraction("async-action", asyncCallback);
      jest.advanceTimersByTime(1000);
    });

    expect(performanceMonitor.trackInteraction).toHaveBeenCalledWith(
      "async-action",
      expect.any(Number),
      { component: "TestComponent" }
    );
    expect(asyncCallback).toHaveBeenCalled();
  });
});

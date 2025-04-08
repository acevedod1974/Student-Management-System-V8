import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PerformanceMetricsViewer } from "./PerformanceMetricsViewer";
import { performanceMonitor } from "../services/performance";
import "@testing-library/jest-dom";

jest.mock("../services/performance", () => ({
  performanceMonitor: {
    getMetrics: jest.fn(),
    getAverageMetrics: jest.fn(),
  },
}));

describe("PerformanceMetricsViewer", () => {
  const mockMetrics = [
    {
      action: "render:TestComponent:render",
      averageDuration: 50,
      count: 5,
    },
    {
      action: "api:fetchData",
      averageDuration: 200,
      count: 3,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (performanceMonitor.getMetrics as jest.Mock).mockReturnValue([]);
    (performanceMonitor.getAverageMetrics as jest.Mock).mockReturnValue(
      mockMetrics
    );
  });

  it("renders metrics table correctly", async () => {
    render(<PerformanceMetricsViewer />);

    await waitFor(() => {
      expect(screen.getByText("Performance Metrics")).toBeInTheDocument();
      expect(
        screen.getByText("render:TestComponent:render")
      ).toBeInTheDocument();
      expect(screen.getByText("api:fetchData")).toBeInTheDocument();
    });
  });

  it("formats durations correctly", async () => {
    render(<PerformanceMetricsViewer />);

    await waitFor(() => {
      expect(screen.getByText("50ms")).toBeInTheDocument();
      expect(screen.getByText("200ms")).toBeInTheDocument();
    });
  });

  it("handles filter changes", async () => {
    render(<PerformanceMetricsViewer />);

    const typeSelect = screen.getByLabelText("Type");
    fireEvent.change(typeSelect, { target: { value: "render" } });

    await waitFor(() => {
      expect(performanceMonitor.getAverageMetrics).toHaveBeenCalledWith(
        expect.objectContaining({ type: "render" })
      );
    });
  });

  it("updates metrics periodically", async () => {
    jest.useFakeTimers();

    render(<PerformanceMetricsViewer />);

    expect(performanceMonitor.getAverageMetrics).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);

    expect(performanceMonitor.getAverageMetrics).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it("applies time range filter correctly", async () => {
    render(<PerformanceMetricsViewer />);

    const timeRangeSelect = screen.getByLabelText("Time Range");
    fireEvent.change(timeRangeSelect, { target: { value: "5min" } });

    await waitFor(() => {
      expect(performanceMonitor.getAverageMetrics).toHaveBeenCalledWith(
        expect.objectContaining({
          startTime: expect.any(Number),
        })
      );
    });
  });
});

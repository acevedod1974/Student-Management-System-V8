/**
 *
 * Student Management System
 *
 * Description: The Student Management System is a comprehensive web application designed to manage student data efficiently.
 * Built with modern web technologies, this system offers a robust and user-friendly interface for managing courses, students, and their performance.
 *
 * Technologies Used:
 * - React
 * - TypeScript
 * - Zustand (State Management)
 * - Tailwind CSS (Styling)
 * - Vite (Building and Serving)
 *
 * Author: Daniel Acevedo Lopez
 * GitHub: https://github.com/acevedod1974/Student-Management-System-V4
 *
 * Copyright © 2023 Daniel Acevedo Lopez. All rights reserved.
 *
 * This project is licensed under the MIT License. See the LICENSE file for more details.
 */

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { 
  ChartEvent, 
  ActiveElement,
  TooltipItem
} from "chart.js";
import { usePerformanceMonitoring } from "../hooks/usePerformanceMonitoring";

interface Props {
  grades: number[];
  title?: string;
}

export function GradeDistributionChart({
  grades,
  title = "Grade Distribution",
}: Props) {
  const { trackInteraction } = usePerformanceMonitoring(
    "GradeDistributionChart"
  );

  const data = useMemo(() => {
    const distribution = Array(10).fill(0); // 0-9, 10-19, ..., 90-99

    grades.forEach((grade) => {
      const index = Math.min(Math.floor(grade / 10), 9);
      distribution[index]++;
    });

    return {
      labels: [
        "0-9",
        "10-19",
        "20-29",
        "30-39",
        "40-49",
        "50-59",
        "60-69",
        "70-79",
        "80-89",
        "90-100",
      ],
      datasets: [
        {
          label: "Number of Students",
          data: distribution,
          backgroundColor: "rgba(79, 70, 229, 0.6)",
          borderColor: "rgb(79, 70, 229)",
          borderWidth: 1,
        },
      ],
    };
  }, [grades]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: Boolean(title),
        text: title,
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<"bar">[]) => {
            const item = tooltipItems[0];
            return `Grade Range: ${item.label}`;
          },
          label: (context: TooltipItem<"bar">) => {
            return `Students: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        const { index } = elements[0];
        trackInteraction("chart-click", () => {
          console.log(`Clicked grade range: ${data.labels[index]}`);
        });
      }
    },
  };

  return (
    <div className="w-full h-[300px]">
      <Bar data={data} options={options} />
    </div>
  );
}

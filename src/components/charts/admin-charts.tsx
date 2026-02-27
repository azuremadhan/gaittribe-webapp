"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export function RegistrationBarChart({ labels, values }: { labels: string[]; values: number[] }) {
  return (
    <Bar
      data={{
        labels,
        datasets: [{ label: "Registrations", data: values, backgroundColor: "#1E3A8A" }],
      }}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  );
}

export function EventTypePieChart({ fitness, trip }: { fitness: number; trip: number }) {
  return (
    <Pie
      data={{
        labels: ["FITNESS", "TRIP"],
        datasets: [{ data: [fitness, trip], backgroundColor: ["#1E3A8A", "#F97316"] }],
      }}
      options={{ responsive: true }}
    />
  );
}


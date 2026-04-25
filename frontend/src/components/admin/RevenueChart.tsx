import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  type: 'bar' | 'line';
  data: number[];
  labels: string[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ type, data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue ($)',
        data,
        backgroundColor: '#FF5F1F',
        borderColor: '#FF5F1F',
        borderWidth: 2,
        borderRadius: 8,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (type === 'bar') {
    return <Bar data={chartData} options={options} />;
  }

  return <Line data={chartData} options={options} />;
};

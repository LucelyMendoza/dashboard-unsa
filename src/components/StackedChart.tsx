'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import '@/lib/chart-setup';
import { rate } from '@/lib/data-utils';
import type { GroupedTotals } from '@/lib/data-utils';

export default function GroupedBarChart({
  groups,
}: {
  groups: GroupedTotals[];
}) {
  const labels = groups.map((g) => g.k);

  return (
    <div className="h-64 sm:h-80">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Aprobados',
              data: groups.map((g) => rate(g.a, g.m)),
              backgroundColor: '#2563eb',
            },
            {
              label: 'Desaprobados',
              data: groups.map((g) => rate(g.d, g.m)),
              backgroundColor: '#d97706',
            },
            {
              label: 'Retiro',
              data: groups.map((g) => rate(g.r, g.m)),
              backgroundColor: '#800080',
            },
            {
              label: 'Abandono',
              data: groups.map((g) => rate(g.b, g.m)),
              backgroundColor: '#ef4444',
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,

          scales: {
            x: {
              stacked: false,
              grid: {
                display: false,
              },
            },
            y: {
              stacked: false,
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (value) => `${value}%`,
              },
            },
          },

          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 11,
                },
              },
            },

            tooltip: {
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${Number(context.parsed.y).toFixed(2)}%`,
              },
            },
          },
        }}
      />
    </div>
  );
}
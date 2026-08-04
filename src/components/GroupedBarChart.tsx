'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import '@/lib/chart-setup';
import { rate } from '@/lib/data-utils';
import type { GroupedTotals } from '@/lib/data-utils';

export default function GroupedBarChart({ groups }: { groups: GroupedTotals[] }) {
  const labels = groups.map((g) => g.k);
  const COLORS = { apr: '#2563eb', des: '#d97706', ret: '#7A02FA', abn: '#FA0202' };

  return (
    <div className="h-64 sm:h-80">
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Aprobados',
              data: groups.map((g) => rate(g.a, g.m)),
              backgroundColor: COLORS.apr,
              stack: 's',
            },
            {
              label: 'Desaprobados',
              data: groups.map((g) => rate(g.d, g.m)),
              backgroundColor: COLORS.des,
              stack: 's',
            },
            {
              label: 'Retiro',
              data: groups.map((g) => rate(g.r, g.m)),
              backgroundColor: COLORS.ret,
              stack: 's',
            },
            {
              label: 'Abandono',
              data: groups.map((g) => rate(g.b, g.m)),
              backgroundColor: COLORS.abn,
              stack: 's',
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
            },
            y: {
              stacked: true,
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
                label: (context) => `${context.dataset.label}: ${Number(context.parsed.y).toFixed(2)}%`,
              },
            },
          },
        }}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import '@/lib/chart-setup';
import { rate } from '@/lib/data-utils';
import type { GroupedTotals, FilterState } from '@/lib/data-utils';

interface Props {
  groups: GroupedTotals[];
  indicador: FilterState['indicador'];
}

const COLORS = { apr: '#2563eb', des: '#d97706', nc: '#475569', ret: '#7c3aed', abn: '#dc2626' };

export default function TrendChart({ groups, indicador }: Props) {
  const labels = groups.map((g) => g.k);

  let datasets;
  if (indicador === 'all') {
    datasets = [
      { label: 'Aprobación', data: groups.map((g) => rate(g.a, g.m)), borderColor: COLORS.apr, backgroundColor: COLORS.apr + '22', fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2 },
      { label: 'Desaprobación', data: groups.map((g) => rate(g.d, g.m)), borderColor: COLORS.des, backgroundColor: COLORS.des + '22', fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2 },
      { label: 'No Culm.', data: groups.map((g) => rate(g.r + g.b, g.m)), borderColor: COLORS.nc, backgroundColor: COLORS.nc + '22', fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2 },
    ];
  } else if (indicador === 'nc') {
    datasets = [{ label: 'No Culminación', data: groups.map((g) => rate(g.r + g.b, g.m)), borderColor: COLORS.nc, backgroundColor: COLORS.nc + '22', fill: true, tension: 0.3, pointRadius: 4, borderWidth: 2 }];
  } else {
    const fn = indicador === 'apr' ? (g: GroupedTotals) => rate(g.a, g.m) : (g: GroupedTotals) => rate(g.d, g.m);
    datasets = [
      {
        label: indicador === 'apr' ? 'Aprobación' : 'Desaprobación',
        data: groups.map(fn),
        borderColor: COLORS[indicador],
        backgroundColor: COLORS[indicador] + '22',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        borderWidth: 2,
      },
    ];
  }

  return (
    <div className="h-64 sm:h-80">
      <Line
        data={{ labels, datasets }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { ticks: { callback: (v) => v + '%' } },
            x: { grid: { display: false } },
          },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${(c.parsed.y as number).toFixed(2)}%` } },
            legend: { position: 'top', labels: { font: { size: 11 } } },
          },
        }}
      />
    </div>
  );
}

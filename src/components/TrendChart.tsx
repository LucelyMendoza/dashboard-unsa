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

const COLORS = { apr: '#2563eb', des: '#d97706', ret: '#7A02FA', abn: '#FA0202' };

export default function TrendChart({ groups, indicador }: Props) {
  const labels = groups.map((g) => g.k);

  let datasets;
  if (indicador === 'all') {
    datasets = [
      { label: 'Aprobados', data: groups.map((g) => rate(g.a, g.m)), borderColor: COLORS.apr, backgroundColor: COLORS.apr + '22', fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2 },
      { label: 'Desaprobados', data: groups.map((g) => rate(g.d, g.m)), borderColor: COLORS.des, backgroundColor: COLORS.des + '22', fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2 },
      { label: 'Retiro', data: groups.map((g) => rate(g.r, g.m)), borderColor: COLORS.ret, backgroundColor: COLORS.ret + '22', fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2 },
      { label: 'Abandono', data: groups.map((g) => rate(g.b, g.m)), borderColor: COLORS.abn, backgroundColor: COLORS.abn + '22', fill: false, tension: 0.3, pointRadius: 3, borderWidth: 2 },
    ];
  } else if (indicador === 'ret') {
    datasets = [{ label: 'Retiro', data: groups.map((g) => rate(g.r, g.m)), borderColor: COLORS.ret, backgroundColor: COLORS.ret + '22', fill: true, tension: 0.3, pointRadius: 4, borderWidth: 2 }];
  } else if (indicador === 'abn') {
    datasets = [{ label: 'Abandono', data: groups.map((g) => rate(g.b, g.m)), borderColor: COLORS.abn, backgroundColor: COLORS.abn + '22', fill: true, tension: 0.3, pointRadius: 4, borderWidth: 2 }];
  } else {
    const fn =
      indicador === 'apr'
        ? (g: GroupedTotals) => rate(g.a, g.m)
        : indicador === 'des'
        ? (g: GroupedTotals) => rate(g.d, g.m)
        : indicador === 'ret'
        ? (g: GroupedTotals) => rate(g.r, g.m)
        : (g: GroupedTotals) => rate(g.b, g.m);
    datasets = [
      {
        label: indicador === 'apr' ? 'Aprobados' : indicador === 'des' ? 'Desaprobados' : indicador === 'ret' ? 'Retiro' : 'Abandono',
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

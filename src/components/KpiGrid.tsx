import React from 'react';
import { dlt, fmt, pct, rate } from '@/lib/data-utils';
import type { GroupedTotals } from '@/lib/data-utils';

interface Props {
  groups: GroupedTotals[];
}

export default function KpiGrid({ groups }: Props) {
  const tot = groups.reduce(
    (acc, g) => ({ m: acc.m + g.m, a: acc.a + g.a, d: acc.d + g.d, b: acc.b + g.b, r: acc.r + g.r }),
    { m: 0, a: 0, d: 0, b: 0, r: 0 }
  );
  const tA = rate(tot.a, tot.m);
  const tD = rate(tot.d, tot.m);
  const tR = rate(tot.r, tot.m);
  const tB = rate(tot.b, tot.m);
  const tN = rate(tot.r + tot.b, tot.m);

  const prev = groups.length > 1 ? groups[groups.length - 2] : null;
  const last = groups.length ? groups[groups.length - 1] : null;
  const dA = last && prev ? dlt(rate(last.a, last.m), rate(prev.a, prev.m)) : '—';

  const cards = [
    { v: pct(tA), l: 'Aprobación', s: `${fmt(tot.a)} aprobados · ${dA}`, color: 'var(--apr)' },
    { v: pct(tD), l: 'Desaprobación', s: `${fmt(tot.d)} desaprobados`, color: 'var(--des)' },
    { v: pct(tR), l: 'Retiro', s: `${fmt(tot.r)} retiros`, color: 'var(--ret)' },
    { v: pct(tB), l: 'Abandono', s: `${fmt(tot.b)} abandonos`, color: 'var(--abn)' },
    { v: fmt(tot.m), l: 'Matriculados por asignatura', s: `${groups.length} periodos`, color: 'var(--ink)' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {cards.map((c) => (
        <div key={c.l} className="bg-white border border-slate-200 rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold tabular-nums" style={{ color: c.color }}>
            {c.v}
          </div>
          <div className="text-[11px] font-semibold text-slate-700 mt-0.5">{c.l}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{c.s}</div>
        </div>
      ))}
    </div>
  );
}

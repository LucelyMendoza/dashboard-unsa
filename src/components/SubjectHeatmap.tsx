import React from 'react';
import { fmt, hmClass, rate } from '@/lib/data-utils';
import type { DashboardDataset } from '@/types/dashboard';
import type { FilterState } from '@/lib/data-utils';
import { filterSubjectRows } from '@/lib/data-utils';

const HEAT_BG: Record<string, string> = {
  g6: '#dcfce7',
  g5: '#f0fdf4',
  g4: '#fefce8',
  g3: '#fef3c7',
  g2: '#fee2e2',
  g1: '#fecaca',
};

export default function SubjectHeatmap({ dataset, filters }: { dataset: DashboardDataset; filters: FilterState }) {
  const sa = filterSubjectRows(dataset, filters);
  const { an: AN, ps: P } = dataset;

  const byA: Record<string, Record<string, { m: number; a: number }>> = {};
  sa.forEach((r) => {
    const n = AN[r[3]];
    const p = P[r[0]];
    if (!byA[n]) byA[n] = {};
    if (!byA[n][p]) byA[n][p] = { m: 0, a: 0 };
    byA[n][p].m += r[4];
    byA[n][p].a += r[5];
  });

  const periodList =
    filters.periodo !== 'ALL' ? [filters.periodo] : filters.anio !== 'ALL' ? P.filter((p) => p.startsWith(filters.anio)) : P;

  const aggList = Object.keys(byA)
    .map((n) => {
      let tm = 0,
        ta = 0;
      Object.values(byA[n]).forEach((v) => {
        tm += v.m;
        ta += v.a;
      });
      return { n, r: rate(ta, tm), t: tm };
    })
    .filter((a) => a.t >= 30)
    .sort((a, b) => a.r - b.r);

  const shown = aggList.length > 60 ? [...aggList.slice(0, 30), { n: '···', sep: true, r: 0, t: 0 }, ...aggList.slice(-30)] : aggList;

  if (!aggList.length) {
    return <p className="text-center text-slate-400 text-xs py-8">Sin datos para el filtro seleccionado</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] whitespace-nowrap">
        <thead>
          <tr className="text-slate-500 border-b border-slate-200">
            <th className="text-left font-semibold px-2 py-2 min-w-[220px]">Asignatura</th>
            <th className="text-right font-semibold px-2 py-2">Global</th>
            {periodList.map((p) => (
              <th key={p} className="text-right font-semibold px-2 py-2 min-w-[52px] text-[9px]">
                {p}
              </th>
            ))}
            <th className="text-right font-semibold px-2 py-2">Matr.</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((a, i) =>
            'sep' in a && a.sep ? (
              <tr key="sep">
                <td colSpan={periodList.length + 3} className="text-center text-[10px] italic text-slate-400 py-1">
                  ... asignaturas intermedias ...
                </td>
              </tr>
            ) : (
              <tr key={a.n + i} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-2 py-1 text-[10px]">{a.n}</td>
                <td className="text-right px-2 py-1 font-semibold" style={{ background: HEAT_BG[hmClass(a.r)] }}>
                  {a.r.toFixed(1)}%
                </td>
                {periodList.map((p) => {
                  const d = byA[a.n]?.[p];
                  if (!d) return <td key={p} className="text-right px-2 py-1 text-slate-300">—</td>;
                  const v = rate(d.a, d.m);
                  return (
                    <td key={p} className="text-right px-2 py-1" style={{ background: HEAT_BG[hmClass(v)] }} title={`${d.a}/${d.m}`}>
                      {v.toFixed(0)}%
                    </td>
                  );
                })}
                <td className="text-right px-2 py-1">{fmt(a.t)}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

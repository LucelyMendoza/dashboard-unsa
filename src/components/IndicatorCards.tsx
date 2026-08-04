import React from 'react';
import { dlt, fmt, pct, rate } from '@/lib/data-utils';
import type { GroupedTotals } from '@/lib/data-utils';

const INDICATORS: { k: string; l: string; color: string; desc: string; fn: (g: GroupedTotals) => number }[] = [
  { k: 'apr', l: 'Aprobados', color: 'var(--apr)', desc: 'Nota ≥ 11', fn: (g) => rate(g.a, g.m) },
  { k: 'des', l: 'Desaprobados', color: 'var(--des)', desc: 'Nota < 11', fn: (g) => rate(g.d, g.m) },
  { k: 'ret', l: 'Retiro', color: 'var(--ret)', desc: 'Retiro formal', fn: (g) => rate(g.r, g.m) },
  { k: 'abn', l: 'Abandono', color: 'var(--abn)', desc: 'Sin retiro formal', fn: (g) => rate(g.b, g.m) },
];

const ABS: Record<string, (g: GroupedTotals) => number> = {
  apr: (g) => g.a,
  des: (g) => g.d,
  ret: (g) => g.r,
  abn: (g) => g.b,
};

export default function IndicatorCards({ groups }: { groups: GroupedTotals[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {INDICATORS.map((ind) => {
        const vals = groups.map((g) => ({ l: g.k, v: ind.fn(g), abs: ABS[ind.k](g), m: g.m }));
        const last = vals.length ? vals[vals.length - 1] : null;
        const prev = vals.length > 1 ? vals[vals.length - 2] : null;
        const trend = last && prev ? dlt(last.v, prev.v) : '—';

        return (
          <div key={ind.k} className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="text-sm font-bold" style={{ color: ind.color }}>
              {ind.l}
            </h3>
            <p className="text-[11px] text-slate-400 mb-2">{ind.desc}</p>
            <div className="flex items-baseline gap-2.5 mb-2">
              <span className="text-2xl font-bold" style={{ color: ind.color }}>
                {last ? pct(last.v) : '—'}
              </span>
              <span className="text-xs text-slate-400">{trend}</span>
            </div>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-slate-400">
                    <th className="text-left font-semibold px-1 py-1">Periodo</th>
                    <th className="text-right font-semibold px-1 py-1">Cantidad</th>
                    <th className="text-right font-semibold px-1 py-1">Matric.</th>
                    <th className="text-right font-semibold px-1 py-1">Tasa</th>
                  </tr>
                </thead>
                <tbody>
                  {vals.map((v) => (
                    <tr key={v.l} className="border-t border-slate-100">
                      <td className="px-1 py-1">{v.l}</td>
                      <td className="text-right px-1 py-1">{fmt(v.abs)}</td>
                      <td className="text-right px-1 py-1">{fmt(v.m)}</td>
                      <td className="text-right px-1 py-1 font-semibold" style={{ color: ind.color }}>
                        {pct(v.v)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

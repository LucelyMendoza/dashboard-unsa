import React from 'react';
import { fmt, hmClass, pct, riskEmoji, trendLabel, YEARS } from '@/lib/data-utils';
import type { ScorecardRow } from '@/types/dashboard';

const HEAT_BG: Record<string, string> = {
  g6: '#dcfce7',
  g5: '#f0fdf4',
  g4: '#fefce8',
  g3: '#fef3c7',
  g2: '#fee2e2',
  g1: '#fecaca',
};

export default function SchoolScorecard({ rows }: { rows: ScorecardRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[11px] whitespace-nowrap">
        <thead>
          <tr className="text-slate-500 border-b border-slate-200">
            <th className="text-left font-semibold px-2 py-2">Escuela</th>
            <th className="text-left font-semibold px-2 py-2">Facultad</th>
            <th className="text-right font-semibold px-2 py-2">Matr.</th>
            <th className="text-right font-semibold px-2 py-2">Aprob.</th>
            <th className="text-right font-semibold px-2 py-2">Desap.</th>
            <th className="text-right font-semibold px-2 py-2">No Culm.</th>
            <th className="text-right font-semibold px-2 py-2">Tendencia</th>
            <th className="text-right font-semibold px-2 py-2">CV</th>
            <th className="text-right font-semibold px-2 py-2">Brecha</th>
            {YEARS.map((y) => (
              <th key={y} className="text-right font-semibold px-2 py-2">
                {y}
              </th>
            ))}
            <th className="text-center font-semibold px-2 py-2">Riesgo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => {
            const tr = trendLabel(c.sl);
            return (
              <tr key={c.e} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-2 py-1.5 font-semibold">{c.e}</td>
                <td className="px-2 py-1.5 text-[10px] text-slate-400">{c.f}</td>
                <td className="text-right px-2 py-1.5">{fmt(c.tm)}</td>
                <td className="text-right px-2 py-1.5 font-semibold" style={{ background: HEAT_BG[hmClass(c.ta)] }}>
                  {pct(c.ta)}
                </td>
                <td className="text-right px-2 py-1.5">{pct(c.td)}</td>
                <td className="text-right px-2 py-1.5">{pct(c.tn)}</td>
                <td className={`text-right px-2 py-1.5 ${tr.cls}`}>{tr.text}</td>
                <td className={`text-right px-2 py-1.5 ${c.cv > 5 ? 'text-red-600 font-semibold' : ''}`}>{c.cv.toFixed(1)}%</td>
                <td className={`text-right px-2 py-1.5 ${c.br > 20 ? 'text-red-600 font-semibold' : ''}`}>{c.br.toFixed(1)}pp</td>
                {YEARS.map((y) => {
                  const v = c.yr[String(y)];
                  return (
                    <td key={y} className="text-right px-2 py-1.5" style={v != null ? { background: HEAT_BG[hmClass(v)] } : { color: '#ccc' }}>
                      {v != null ? v.toFixed(1) + '%' : '—'}
                    </td>
                  );
                })}
                <td className="text-center px-2 py-1.5">{riskEmoji(c.ta)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!rows.length && <p className="text-center text-slate-400 text-xs py-8">Sin datos para el filtro seleccionado</p>}
    </div>
  );
}

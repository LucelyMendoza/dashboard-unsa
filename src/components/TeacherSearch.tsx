'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { fmt, hmClass, pct, rate } from '@/lib/data-utils';
import type { DashboardDataset } from '@/types/dashboard';
import type { FilterState } from '@/lib/data-utils';

const HEAT_TEXT: Record<string, string> = {
  g6: 'text-emerald-700',
  g5: 'text-emerald-600',
  g4: 'text-amber-600',
  g3: 'text-amber-700',
  g2: 'text-red-600',
  g1: 'text-red-700',
};

export default function TeacherSearch({ dataset, filters }: { dataset: DashboardDataset; filters: FilterState }) {
  const [q, setQ] = useState('');
  const { fs: F, es: E, an: AN, dn: DN, ps: P } = dataset;

  const results = useMemo(() => {
    if (q.trim().length < 3) return null;
    const qu = q.toUpperCase();
    const matches = dataset.dc.filter((r) => {
      if (!DN[r[0]].toUpperCase().includes(qu)) return false;
      if (filters.facultad !== 'ALL' && F[r[2]] !== filters.facultad) return false;
      if (filters.escuela !== 'ALL' && E[r[3]] !== filters.escuela) return false;
      return true;
    });
    if (!matches.length) return [];

    const byTeacher: Record<
      string,
      { p: string; f: string; e: string; a: string; m: number; ap: number; d: number; ab: number; ret: number }[]
    > = {};
    matches.forEach((r) => {
      const name = DN[r[0]];
      if (!byTeacher[name]) byTeacher[name] = [];
      byTeacher[name].push({ p: P[r[1]], f: F[r[2]], e: E[r[3]], a: AN[r[4]], m: r[5], ap: r[6], d: r[7], ab: r[8], ret: r[9] });
    });

    return Object.keys(byTeacher)
      .sort()
      .slice(0, 10)
      .map((name) => {
        const rows = byTeacher[name].sort((a, b) => a.p.localeCompare(b.p));
        const tm = rows.reduce((s, r) => s + r.m, 0);
        const ta = rows.reduce((s, r) => s + r.ap, 0);
        const tab = rows.reduce((s, r) => s + r.ab, 0);
        const tret = rows.reduce((s, r) => s + r.ret, 0);
        const gr = rate(ta, tm);
        const ncr = tm > 0 ? ((tab + tret) / tm) * 100 : 0;
        const subjects = [...new Set(rows.map((r) => r.a))];
        const facEsc = rows[0].f + (rows[0].e && rows[0].e !== rows[0].f ? ' · ' + rows[0].e : '');
        return { name, rows, tm, gr, ncr, subjects, facEsc };
      });
  }, [q, dataset, filters, F, E, AN, DN, P]);

  return (
    <div>
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar docente por apellidos y nombres..."
          className="w-full text-xs border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      {q.trim().length < 3 && <p className="text-xs text-slate-400 py-4">Ingrese al menos 3 caracteres para buscar.</p>}

      {results !== null && results.length === 0 && (
        <p className="text-xs text-slate-400 py-4">
          Sin resultados{filters.facultad !== 'ALL' || filters.escuela !== 'ALL' ? ' en la facultad/escuela seleccionada' : ''} para &quot;{q}&quot;
        </p>
      )}

      <div className="space-y-5">
        {results?.map((t) => (
          <div key={t.name} className="border-b border-slate-100 pb-4">
            <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
              <div>
                <span className="font-bold text-sm">{t.name}</span>
                <span className="text-[11px] text-slate-400 ml-2">{t.facEsc}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap items-center">
                <span className={`text-[11px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold ${HEAT_TEXT[hmClass(t.gr)]}`}>
                  T.Apr: {pct(t.gr)}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">No Culm: {t.ncr.toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">{t.subjects.length} asignatura(s): {t.subjects.slice(0, 4).join(', ')}{t.subjects.length > 4 ? '…' : ''}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] whitespace-nowrap">
                <thead>
                  <tr className="text-slate-400">
                    <th className="text-left px-1 py-1">Periodo</th>
                    <th className="text-left px-1 py-1">Asignatura</th>
                    <th className="text-right px-1 py-1">Matr.</th>
                    <th className="text-right px-1 py-1">Aprob.</th>
                    <th className="text-right px-1 py-1">Tasa</th>
                  </tr>
                </thead>
                <tbody>
                  {t.rows.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-1 py-1">{r.p}</td>
                      <td className="px-1 py-1">{r.a}</td>
                      <td className="text-right px-1 py-1">{fmt(r.m)}</td>
                      <td className="text-right px-1 py-1">{fmt(r.ap)}</td>
                      <td className="text-right px-1 py-1 font-semibold">{pct(rate(r.ap, r.m))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

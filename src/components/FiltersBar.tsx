import React from 'react';
import type { DashboardDataset } from '@/types/dashboard';
import type { FilterState } from '@/lib/data-utils';
import type { RoleScope } from '@/lib/session';
import { YEARS } from '@/lib/data-utils';

interface Props {
  dataset: DashboardDataset;
  filters: FilterState;
  onChange: (next: FilterState) => void;
  scope: RoleScope;
}

const selectCls =
  'w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400';
const labelCls = 'block text-[10px] font-bold uppercase text-slate-500 mb-1 tracking-wide';

export default function FiltersBar({ dataset, filters, onChange, scope }: Props) {
  const escuelaOptions =
    filters.facultad !== 'ALL' && dataset.fe[filters.facultad] ? dataset.fe[filters.facultad] : dataset.es;

  const periodOptions =
    filters.anio === 'ALL' ? dataset.ps : dataset.ps.filter((p) => p.startsWith(filters.anio));

  return (
    <section className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className={labelCls}>Facultad</label>
          <select
            value={filters.facultad}
            disabled={scope.lockFacultad}
            onChange={(e) => onChange({ ...filters, facultad: e.target.value, escuela: 'ALL' })}
            className={selectCls}
          >
            <option value="ALL">— Todas —</option>
            {dataset.fs.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Escuela</label>
          <select
            value={filters.escuela}
            disabled={scope.lockEscuela}
            onChange={(e) => onChange({ ...filters, escuela: e.target.value })}
            className={selectCls}
          >
            <option value="ALL">— Todas —</option>
            {escuelaOptions.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Año</label>
          <select
            value={filters.anio}
            onChange={(e) => onChange({ ...filters, anio: e.target.value, periodo: 'ALL' })}
            className={selectCls}
          >
            <option value="ALL">Todos</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Periodo</label>
          <select value={filters.periodo} onChange={(e) => onChange({ ...filters, periodo: e.target.value })} className={selectCls}>
            <option value="ALL">Todos</option>
            {periodOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Agrupación</label>
          <div className="inline-flex w-full border border-slate-200 rounded-lg overflow-hidden">
            {(['sem', 'anio'] as const).map((g) => (
              <button
                key={g}
                onClick={() => onChange({ ...filters, agrupacion: g })}
                className={`flex-1 py-2 text-[11px] font-medium ${
                  filters.agrupacion === g ? 'bg-[var(--accent)] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {g === 'sem' ? 'Semestral' : 'Anual'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Indicador</label>
          <select
            value={filters.indicador}
            onChange={(e) => onChange({ ...filters, indicador: e.target.value as FilterState['indicador'] })}
            className={selectCls}
          >
            <option value="apr">Aprobación</option>
            <option value="des">Desaprobación</option>
            <option value="nc">Retiro</option>
            <option value="nc">Abandono</option>
            <option value="all">Todos</option>
          </select>
        </div>
      </div>
    </section>
  );
}

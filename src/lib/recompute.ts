import { AggregatedRow, DashboardDataset, ScorecardRow } from '@/types/dashboard';
import { rate, YEARS } from '@/lib/data-utils';

/**
 * Reconstruye `ag` (totales por periodo/facultad/escuela) y `sc` (scorecard por
 * escuela con tendencia/CV/brecha) a partir de las filas crudas `sa`.
 * Se ejecuta cada vez que el administrador carga un Excel nuevo, para que los
 * gráficos y tablas reflejen la información recién agregada sin reabrir la app.
 */
export function recomputeDerived(d: DashboardDataset): DashboardDataset {
  const { ps: P, fs: F, es: E } = d;

  // ── 1. Reconstruir `ag`: totales por PERIODO x FACULTAD x ESCUELA ──
  const aggMap = new Map<string, AggregatedRow>();
  d.sa.forEach((row) => {
    const [periodIdx, facIdx, escIdx, , m, a, desap, aband, ret, prom] = row;
    const periodo = P[periodIdx];
    const facultad = F[facIdx];
    const escuela = E[escIdx];
    const key = `${periodo}|||${facultad}|||${escuela}`;
    if (!aggMap.has(key)) {
      const anio = parseInt(periodo.slice(0, 4), 10);
      aggMap.set(key, { PERIODO: periodo, AÑO: anio, FACULTAD: facultad, ESCUELA: escuela, m: 0, a: 0, d: 0, b: 0, r: 0, n: 0, prom: 0 });
    }
    const acc = aggMap.get(key)!;
    acc.m += m;
    acc.a += a;
    acc.d += desap;
    acc.b += aband;
    acc.r += ret;
    acc.n += 1; // número de grupos/asignaturas agregadas
    // promedio ponderado por matriculados
    acc.prom = acc.m > 0 ? (acc.prom * (acc.m - m) + prom * m) / acc.m : prom;
  });
  const ag = Array.from(aggMap.values()).sort((x, y) => x.PERIODO.localeCompare(y.PERIODO));

  // ── 2. Reconstruir `sc`: scorecard consolidado por escuela ──
  const byEscuela = new Map<string, AggregatedRow[]>();
  ag.forEach((r) => {
    if (!byEscuela.has(r.ESCUELA)) byEscuela.set(r.ESCUELA, []);
    byEscuela.get(r.ESCUELA)!.push(r);
  });

  const sc: ScorecardRow[] = Array.from(byEscuela.entries()).map(([escuela, rows]) => {
    const facultad = rows[0].FACULTAD;
    const tm = rows.reduce((s, r) => s + r.m, 0);
    const ta_ = rows.reduce((s, r) => s + r.a, 0);
    const td_ = rows.reduce((s, r) => s + r.d, 0);
    const tb_ = rows.reduce((s, r) => s + r.b, 0);
    const tr_ = rows.reduce((s, r) => s + r.r, 0);

    // tasa de aprobación por año (para tendencia, CV y brecha)
    const yr: Record<string, number> = {};
    YEARS.forEach((y) => {
      const yrRows = rows.filter((r) => r.AÑO === y);
      if (!yrRows.length) return;
      const ym = yrRows.reduce((s, r) => s + r.m, 0);
      const ya = yrRows.reduce((s, r) => s + r.a, 0);
      if (ym > 0) yr[String(y)] = rate(ya, ym);
    });

    const yearVals = Object.entries(yr).sort(([a], [b]) => a.localeCompare(b));
    // pendiente (regresión lineal simple, en pp/año)
    let sl = 0;
    if (yearVals.length >= 2) {
      const pts = yearVals.map(([, v], i) => ({ x: i, y: v }));
      const n = pts.length;
      const sx = pts.reduce((s, p) => s + p.x, 0);
      const sy = pts.reduce((s, p) => s + p.y, 0);
      const sxy = pts.reduce((s, p) => s + p.x * p.y, 0);
      const sx2 = pts.reduce((s, p) => s + p.x * p.x, 0);
      const denom = n * sx2 - sx * sx;
      sl = denom !== 0 ? (n * sxy - sx * sy) / denom : 0;
    }
    // coeficiente de variación de la tasa anual
    const vals = yearVals.map(([, v]) => v);
    const mean = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
    const variance = vals.length ? vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length : 0;
    const cv = mean !== 0 ? (Math.sqrt(variance) / mean) * 100 : 0;
    // brecha = diferencia entre el año más alto y el más bajo
    const br = vals.length ? Math.max(...vals) - Math.min(...vals) : 0;

    return {
      e: escuela,
      f: facultad,
      tm,
      ta: rate(ta_, tm),
      td: rate(td_, tm),
      tn: rate(tr_ + tb_, tm),
      sl,
      cv,
      yr,
      br,
    };
  });

  return { ...d, ag, sc };
}

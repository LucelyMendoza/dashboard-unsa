import * as XLSX from 'xlsx';
import { DashboardDataset } from '@/types/dashboard';
import { recomputeDerived } from '@/lib/recompute';

// Encabezados esperados en el Excel de carga (fila 1, en cualquier orden)
export interface ExcelRow {
  DOCENTE: string;
  FACULTAD: string;
  ESCUELA: string;
  PERIODO: string;
  ASIGNATURA: string;
  MATRICULADOS: number;
  APROBADOS: number;
  DESAPROBADOS: number;
  RETIRADOS?: number;
  NO_CULMINADOS: number; // abandonos (sin retiro formal)
  NOTA_PROMEDIO: number;
}

export const REQUIRED_HEADERS = [
  'DOCENTE',
  'FACULTAD',
  'ESCUELA',
  'PERIODO',
  'ASIGNATURA',
  'MATRICULADOS',
  'APROBADOS',
  'DESAPROBADOS',
  'NO_CULMINADOS',
  'NOTA_PROMEDIO',
] as const;

export class ExcelParseError extends Error {}

export function parseExcelToDataset(fileBuffer: ArrayBuffer, currentDataset: DashboardDataset): DashboardDataset {
  const workbook = XLSX.read(fileBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, { defval: '' });

  if (!rows.length) {
    throw new ExcelParseError('El archivo no contiene filas de datos.');
  }
  const firstRowKeys = Object.keys(rows[0]);
  const missing = REQUIRED_HEADERS.filter((h) => !firstRowKeys.includes(h));
  if (missing.length) {
    throw new ExcelParseError(`Faltan las columnas: ${missing.join(', ')}`);
  }

  // Copia profunda para no mutar el dataset actual mientras se valida
  const newD: DashboardDataset = JSON.parse(JSON.stringify(currentDataset));

  const getOrAdd = (list: string[], val: string) => {
    const v = val?.trim() || '(sin especificar)';
    let idx = list.indexOf(v);
    if (idx === -1) {
      list.push(v);
      idx = list.length - 1;
    }
    return idx;
  };

  rows.forEach((row) => {
    const facultad = row.FACULTAD?.toString().trim();
    const escuela = row.ESCUELA?.toString().trim();
    const periodo = row.PERIODO?.toString().trim();
    const asignatura = row.ASIGNATURA?.toString().trim();
    const docente = row.DOCENTE?.toString().trim() || '(sin especificar)';

    const idDoc = getOrAdd(newD.dn, docente);
    const idFac = getOrAdd(newD.fs, facultad);
    const idEsc = getOrAdd(newD.es, escuela);
    const idPer = getOrAdd(newD.ps, periodo);
    const idAsi = getOrAdd(newD.an, asignatura);

    // Mapeo Facultad -> Escuelas
    if (!newD.fe[facultad]) newD.fe[facultad] = [];
    if (!newD.fe[facultad].includes(escuela)) newD.fe[facultad].push(escuela);

    const m = Number(row.MATRICULADOS || 0);
    const a = Number(row.APROBADOS || 0);
    const de = Number(row.DESAPROBADOS || 0);
    const ab = Number(row.NO_CULMINADOS || 0);
    const re = Number(row.RETIRADOS || 0);
    const prom = Number(row.NOTA_PROMEDIO || 0);

    // Fila agregada por asignatura (sa) — usada en el mapa de calor y en ag/sc
    newD.sa.push([idPer, idFac, idEsc, idAsi, m, a, de, ab, re, prom]);
    // Fila por docente (dc) — usada en el buscador de docentes
    newD.dc.push([idDoc, idPer, idFac, idEsc, idAsi, m, a, de, ab, re]);
  });

  // Recalcula ag (totales) y sc (scorecard con tendencia/CV/brecha) desde sa
  return recomputeDerived(newD);
}

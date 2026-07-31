export type UserRole = 'ADMIN' | 'VICERRECTOR' | 'DECANO' | 'DIRECTOR';

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  facultad?: string;
  escuela?: string;
}

export interface AggregatedRow {
  PERIODO: string;
  AÑO: number;
  FACULTAD: string;
  ESCUELA: string;
  m: number;
  a: number;
  d: number;
  b: number;
  r: number;
  n: number;
  prom: number;
}

export interface ScorecardRow {
  e: string;
  f: string;
  tm: number;
  ta: number;
  td: number;
  tn: number;
  sl: number;
  cv: number;
  yr: Record<string, number>;
  br: number;
}

export type SubjectRow = [
  periodIndex: number,
  facultyIndex: number,
  schoolIndex: number,
  subjectIndex: number,
  matriculados: number,
  aprobados: number,
  desaprobados: number,
  abandonos: number,
  retirados: number,
  promedio: number
];

export type TeacherRow = [
  teacherIndex: number,
  periodIndex: number,
  facultyIndex: number,
  schoolIndex: number,
  subjectIndex: number,
  matriculados: number,
  aprobados: number,
  desaprobados: number,
  abandonos: number,
  retirados: number
];

export interface DashboardDataset {
  fe: Record<string, string[]>;
  ps: string[];
  fs: string[];
  es: string[];
  an: string[];
  dn: string[];
  ag: AggregatedRow[];
  sa: SubjectRow[];
  dc: TeacherRow[];
  sc: ScorecardRow[];
  cd: unknown[];
}

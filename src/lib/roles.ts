import { UserSession, UserRole, DashboardTab } from '@/types/dashboard';

export const ADMIN_EMAILS = [
  'lmendoza@unsa.edu.pe',
  'wvaldez@unsa.edu.pe',
  'esiug@unsa.edu.pe',
  'jleonq@unsa.edu.pe',
];

/**
 * Registro de correos habilitados y su rol / alcance.
 * Solo los correos listados aquí pueden entrar al panel tras autenticarse
 * (cualquier correo de Google se autentica, pero se le deja entrar sólo si
 * aparece en este mapa con un rol asignado).
 */
export const ROLE_MAP: Record<string, Omit<UserSession, 'email'>> = {
  // Administradores: ven todas las vistas de TODO el sistema.
  'lmendoza@unsa.edu.pe': { name: 'Administrador', role: 'ADMIN' },
  'wvaldez@unsa.edu.pe':  { name: 'Administrador', role: 'ADMIN' },
  'esiug@unsa.edu.pe':    { name: 'Administrador', role: 'ADMIN' },
  'jleonq@unsa.edu.pe':   { name: 'Administrador', role: 'ADMIN' },

  // Rol AUTORIDAD: ve sólo el Resumen general de TODO (filtros libres).
  'vrac@unsa.edu.pe': { name: 'Autoridad', role: 'AUTORIDAD' },
  'rectorado@unsa.edu.pe': { name: 'Autoridad', role: 'AUTORIDAD' },
  'vrai@unsa.edu.pe': { name: 'Autoridad', role: 'AUTORIDAD' },

  // Decanos: ve Resumen + Escuelas de su facultad (filtro de facultad bloqueado).
  // Los valores de `facultad` deben coincidir EXACTAMENTE con los del dataset
  // (public/data/initialData.json) para que el filtro funcione.
  'fad@unsa.edu.pe':        { name: 'Decano', role: 'DECANO', facultad: 'ADMINISTRACIÓN' },
  'fagronomia@unsa.edu.pe': { name: 'Decano', role: 'DECANO', facultad: 'AGRONOMÍA' },
  'fau@unsa.edu.pe':        { name: 'Decano', role: 'DECANO', facultad: 'ARQUITECTURA Y URBANISMO' },
  'fcb@unsa.edu.pe':        { name: 'Decano', role: 'DECANO', facultad: 'CIENCIAS BIOLÓGICAS' },
  'fccf@unsa.edu.pe':       { name: 'Decano', role: 'DECANO', facultad: 'CIENCIAS CONTABLES \u00a0Y FINANCIERAS' },
  'educacion@unsa.edu.pe':  { name: 'Decano', role: 'DECANO', facultad: 'CIENCIAS DE LA EDUCACIÓN' },
  'fchs@unsa.edu.pe':       { name: 'Decano', role: 'DECANO', facultad: 'CIENCIAS HISTÓRICO SOCIALES' },
  'fcnf@unsa.edu.pe':       { name: 'Decano', role: 'DECANO', facultad: 'CIENCIAS NATURALES Y FORMALES' },
  'fderecho@unsa.edu.pe':   { name: 'Decano', role: 'DECANO', facultad: 'DERECHO' },
  'feconomia@unsa.edu.pe':  { name: 'Decano', role: 'DECANO', facultad: 'ECONOMÍA' },
  'fen@unsa.edu.pe':        { name: 'Decano', role: 'DECANO', facultad: 'ENFERMERÏA' },
  'ffh@unsa.edu.pe':        { name: 'Decano', role: 'DECANO', facultad: 'FILOSOFÍA Y HUMANIDADES' },
  'fggm@unsa.edu.pe':       { name: 'Decano', role: 'DECANO', facultad: 'INGENIERÍA GEOLÓGICA, GEOFÍSICA Y MINAS' },
  'fic@unsa.edu.pe':        { name: 'Decano', role: 'DECANO', facultad: 'INGENIERÍA CIVIL' },
  'fip@unsa.edu.pe':        { name: 'Decano', role: 'DECANO', facultad: 'INGENIERÍA DE PROCESOS' },
  'fips@unsa.edu.pe':       { name: 'Decano', role: 'DECANO', facultad: 'INGENIERÍA DE PRODUCCIÓN Y SERVICIOS' },
  'facmed@unsa.edu.pe':     { name: 'Decano', role: 'DECANO', facultad: 'MEDICINA' },
  'fprriicc@unsa.edu.pe':   { name: 'Decano', role: 'DECANO', facultad: 'PSICOLOGÍA, RR.II. Y CS. DE LA COMUNICACIÓN' },

  // Director de Escuela: fijado a su facultad y escuela (sólo ve Asignaturas + Docentes).
  // Los valores de `facultad` y `escuela` deben coincidir EXACTAMENTE con los del
  // dataset (public/data/initialData.json), incluidos acentos y caracteres especiales.
  'administracion@unsa.edu.pe':      { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'ADMINISTRACIÓN', escuela: 'ADMINISTRACIÓN' },
  'alimentaria@unsa.edu.pe':         { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PROCESOS', escuela: 'INGENIERÍA DE INDUSTRIAS ALIMENTARIAS' },
  'ambiental@unsa.edu.pe':           { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PROCESOS', escuela: 'INGENIERÍA AMBIENTAL' },
  'antropologia@unsa.edu.pe':        { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS HISTÓRICO SOCIALES', escuela: 'ANTROPOLOGÍA' },
  'artes@unsa.edu.pe':               { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'FILOSOFÍA Y HUMANIDADES', escuela: 'ARTES' },
  'bancayseguros@unsa.edu.pe':       { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'ADMINISTRACIÓN', escuela: 'BANCA Y SEGUROS' },
  'biologia@unsa.edu.pe':            { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS BIOLÓGICAS', escuela: 'BIOLOGÍA' },
  'ccomunicacion@unsa.edu.pe':       { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'PSICOLOGÍA, RR.II. Y CS. DE LA COMUNICACIÓN', escuela: 'CIENCIAS DE LA COMUNICACIÓN' },
  'civil@unsa.edu.pe':               { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA CIVIL', escuela: 'INGENIERÍA CIVIL' },
  'contabilidad@unsa.edu.pe':        { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS CONTABLES \u00a0Y FINANCIERAS', escuela: 'CONTABILIDAD' },
  'dadp@unsa.edu.pe':                { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'DERECHO', escuela: 'DERECHO' },
  'dadpub@unsa.edu.pe':              { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'DERECHO', escuela: 'DERECHO' },
  'dae@unsa.edu.pe':                 { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'ECONOMÍA', escuela: 'ECONOMÍA' },
  'damed@unsa.edu.pe':               { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'MEDICINA', escuela: 'MEDICINA' },
  'enfermeria@unsa.edu.pe':          { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'ENFERMERÏA', escuela: 'ENFERMERÍA' },
  'epcc@unsa.edu.pe':                { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PRODUCCIÓN Y SERVICIOS', escuela: 'CIENCIA DE LA COMPUTACIÓN' },
  'epf@unsa.edu.pe':                 { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS NATURALES Y FORMALES', escuela: 'FÍSICA' },
  'epie@unsa.edu.pe':                { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PRODUCCIÓN Y SERVICIOS', escuela: 'INGENIERÍA ELECTRÓNICA' },
  'epiel@unsa.edu.pe':               { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PRODUCCIÓN Y SERVICIOS', escuela: 'INGENIERÍA ELÉCTRICA' },
  'epii@unsa.edu.pe':                { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PRODUCCIÓN Y SERVICIOS', escuela: 'INGENIERÍA INDUSTRIAL' },
  'epis@unsa.edu.pe':                { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PRODUCCIÓN Y SERVICIOS', escuela: 'INGENIERÍA DE SISTEMAS' },
  'epit@unsa.edu.pe':                { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PRODUCCIÓN Y SERVICIOS', escuela: 'INGENIERÍA EN TELECOMUNIICACIONES' },
  'fagronomia_secacad@unsa.edu.pe':  { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'AGRONOMÍA', escuela: 'INGENIERÍA AGRONÓMICA' },
  'fau_epa@unsa.edu.pe':             { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'ARQUITECTURA Y URBANISMO', escuela: 'ARQUITECTURA' },
  'filosofia@unsa.edu.pe':           { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'FILOSOFÍA Y HUMANIDADES', escuela: 'FILOSOFÍA' },
  'finanzas@unsa.edu.pe':            { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS CONTABLES \u00a0Y FINANCIERAS', escuela: 'FINANZAS' },
  'geofisica@unsa.edu.pe':           { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA GEOLÓGICA, GEOFÍSICA Y MINAS', escuela: 'INGENIERÍA GEOFÍSICA' },
  'geologia@unsa.edu.pe':            { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA GEOLÓGICA, GEOFÍSICA Y MINAS', escuela: 'INGENIERÍA GEOLÓGICA' },
  'gestion@unsa.edu.pe':             { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'ADMINISTRACIÓN', escuela: 'GESTIÓN' },
  'historia@unsa.edu.pe':            { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS HISTÓRICO SOCIALES', escuela: 'HISTORIA' },
  'iquimica@unsa.edu.pe':            { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PROCESOS', escuela: 'INGENIERÍA QUÍMICA' },
  'literatura@unsa.edu.pe':          { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'FILOSOFÍA Y HUMANIDADES', escuela: 'LITERATURA Y LINGÜÍSTICA' },
  'marketing@unsa.edu.pe':           { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'ADMINISTRACIÓN', escuela: 'MARKETING' },
  'matematicas@unsa.edu.pe':         { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS NATURALES Y FORMALES', escuela: 'MATEMÁTICAS' },
  'materiales@unsa.edu.pe':          { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PROCESOS', escuela: 'INGENIERÍA DE MATERIALES' },
  'mecanica@unsa.edu.pe':            { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PRODUCCIÓN Y SERVICIOS', escuela: 'INGENIERÍA MECÁNICA' },
  'metalurgia@unsa.edu.pe':          { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA DE PROCESOS', escuela: 'INGENIERÍA METALÚRGICA' },
  'minas@unsa.edu.pe':               { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA GEOLÓGICA, GEOFÍSICA Y MINAS', escuela: 'INGENIERÍA  DE MINAS' },
  'nutricion@unsa.edu.pe':           { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS BIOLÓGICAS', escuela: 'CIENCIAS DE LA NUTRICIÓN' },
  'pesquera@unsa.edu.pe':            { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS BIOLÓGICAS', escuela: 'INGENIERÍA PESQUERA' },
  'psicologia@unsa.edu.pe':          { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'PSICOLOGÍA, RR.II. Y CS. DE LA COMUNICACIÓN', escuela: 'PSICOLOGÍA' },
  'quimica@unsa.edu.pe':             { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS NATURALES Y FORMALES', escuela: 'QUÍMICA' },
  'rrii@unsa.edu.pe':                { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'PSICOLOGÍA, RR.II. Y CS. DE LA COMUNICACIÓN', escuela: 'RELACIONES INDUSTRIALES' },
  'sanitaria@unsa.edu.pe':           { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'INGENIERÍA CIVIL', escuela: 'INGENIERÍA SANITARIA' },
  'sociologia@unsa.edu.pe':          { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS HISTÓRICO SOCIALES', escuela: 'SOCIOLOGÍA' },
  'trabajo_social@unsa.edu.pe':      { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS HISTÓRICO SOCIALES', escuela: 'TRABAJO SOCIAL' },
  'turismo@unsa.edu.pe':             { name: 'Director de Escuela', role: 'DIRECTOR', facultad: 'CIENCIAS HISTÓRICO SOCIALES', escuela: 'TURISMO Y HOTELERÍA' },
};

export function getUserByEmail(email: string): UserSession | null {
  const normalizedEmail = email.toLowerCase().trim();
  const role = ROLE_MAP[normalizedEmail];
  if (!role) return null;
  return {
    email: normalizedEmail,
    ...role,
  };
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export const TAB_PERMISSIONS: Record<UserRole, DashboardTab[]> = {
  ADMIN: ['resumen', 'escuelas', 'asignaturas', 'docentes'],
  VICERRECTOR: ['resumen', 'escuelas', 'asignaturas', 'docentes'],
  DECANO: ['resumen', 'escuelas'],
  AUTORIDAD: ['resumen', 'escuelas'],
  DIRECTOR: ['asignaturas', 'docentes'],
};

/** ¿Este rol puede ver la pestaña indicada? */
export function canViewTab(role: UserRole, tab: DashboardTab): boolean {
  return TAB_PERMISSIONS[role]?.includes(tab) ?? false;
}

/** Devuelve las pestañas permitidas para el rol, en el orden canónico del tablero. */
export function getAllowedTabs(role: UserRole): DashboardTab[] {
  const canonical: DashboardTab[] = ['resumen', 'escuelas', 'asignaturas', 'docentes'];
  const allowed = TAB_PERMISSIONS[role] ?? [];
  return canonical.filter((t) => allowed.includes(t));
}

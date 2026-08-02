import { UserSession, UserRole, DashboardTab } from '@/types/dashboard';

export const ADMIN_EMAILS = ['lmendoza@unsa.edu.pe'];

/**
 * Registro de correos habilitados y su rol / alcance.
 * Solo los correos listados aquí pueden entrar al panel tras autenticarse
 * (cualquier correo de Google se autentica, pero se le deja entrar sólo si
 * aparece en este mapa con un rol asignado).
 */
export const ROLE_MAP: Record<string, Omit<UserSession, 'email'>> = {
  'lmendoza@unsa.edu.pe': { name: 'Administrador', role: 'ADMIN' },
  'esiug@unsa.edu.pe': {
    name: 'Decano',
    role: 'DECANO',
    facultad: 'FACULTAD DE CIENCIAS BIOMÉDICAS',
  },
  // Rol AUTORIDAD: ve Resumen + Escuelas.
  // Reemplaza este correo por el de la autoridad correspondiente.
  'autoridad@unsa.edu.pe': { name: 'Autoridad', role: 'AUTORIDAD' },
  // Director de Escuela: fijado a su facultad y escuela (sólo ve Asignaturas + Docentes).
  'jleonq@unsa.edu.pe': {
    name: 'Director de Escuela',
    role: 'DIRECTOR',
    facultad: 'CIENCIAS BIOLÓGICAS',
    escuela: 'BIOLOGÍA',
  },
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

/**
 * Matriz de permisos por pestaña y rol.
 * true  = la pestaña es visible para ese rol.
 * false = la pestaña se oculta y su contenido no se renderiza.
 *
 *   Resumen | Escuelas | Asignaturas | Docentes
 *   ------- | -------- | ----------- | --------
 *   ADMIN      ✅        ✅            ✅        ✅
 *   DECANO     ❌        ✅            ❌        ❌
 *   AUTORIDAD  ✅        ✅            ❌        ❌
 *   DIRECTOR   ❌        ❌            ✅        ✅
 *   VICERRECTOR ✅       ✅            ✅        ✅
 */
export const TAB_PERMISSIONS: Record<UserRole, DashboardTab[]> = {
  ADMIN: ['resumen', 'escuelas', 'asignaturas', 'docentes'],
  VICERRECTOR: ['resumen', 'escuelas', 'asignaturas', 'docentes'],
  DECANO: ['escuelas'],
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

import { UserSession } from '@/types/dashboard';

const STORAGE_KEY = 'unsa_user_session';

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function setSession(session: UserSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export interface RoleScope {
  facultad: string; // valor forzado del filtro, o 'ALL'
  escuela: string;
  lockFacultad: boolean; // true = el usuario no puede cambiar este filtro
  lockEscuela: boolean;
}

/**
 * Resuelve qué puede ver y filtrar cada rol.
 * - ADMIN / VICERRECTOR: acceso total, filtros libres.
 * - DECANO: fijado a su facultad; puede navegar entre las escuelas de esa facultad.
 * - DIRECTOR: fijado a su facultad Y su escuela (no puede salir de ahí).
 */
export function getRoleScope(session: UserSession): RoleScope {
  switch (session.role) {
    case 'DIRECTOR':
      return {
        facultad: session.facultad || 'ALL',
        escuela: session.escuela || 'ALL',
        lockFacultad: true,
        lockEscuela: true,
      };
    case 'DECANO':
      return {
        facultad: session.facultad || 'ALL',
        escuela: 'ALL',
        lockFacultad: true,
        lockEscuela: false,
      };
    case 'VICERRECTOR':
    case 'ADMIN':
    default:
      return { facultad: 'ALL', escuela: 'ALL', lockFacultad: false, lockEscuela: false };
  }
}

export const ROLE_LABELS: Record<UserSession['role'], string> = {
  ADMIN: 'Administrador/a',
  VICERRECTOR: 'Vicerrectorado Académico',
  DECANO: 'Decanato',
  AUTORIDAD: 'Autoridad',
  DIRECTOR: 'Dirección de Escuela',
};

import { UserSession } from '@/types/dashboard';

export const ADMIN_EMAILS = ['lmendoza@unsa.edu.pe'];

export const ROLE_MAP: Record<string, Omit<UserSession, 'email'>> = {
  'lmendoza@unsa.edu.pe': { name: 'Administrador', role: 'ADMIN' },
  'esiug@unsa.edu.pe': {
    name: 'Decano',
    role: 'DECANO',
    facultad: 'FACULTAD DE CIENCIAS BIOMÉDICAS',
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

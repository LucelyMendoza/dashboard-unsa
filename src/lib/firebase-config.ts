export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCtQ_-1CnzEUKNENls7FC8bptg9XlkLBRE',
  authDomain: 'unsa-indicadores.firebaseapp.com',
  projectId: 'unsa-indicadores',
  storageBucket: 'unsa-indicadores.firebasestorage.app',
  messagingSenderId: '54369861268',
  appId: '1:54369861268:web:71478732cfd68211f27e81',
};

/**
 * La fuente de verdad de roles y permisos vive en src/lib/roles.ts.
 * Este archivo se mantiene por compatibilidad; cualquier cambio de roles o
 * permisos debe hacerse en roles.ts.
 */
export const ADMIN_EMAILS = ['lmendoza@unsa.edu.pe'];

export const ROLE_MAP = {
  'lmendoza@unsa.edu.pe': { role: 'admin', facultad: null, escuela: null, label: 'Administrador' },
  'esiug@unsa.edu.pe': {
    role: 'decano',
    facultad: 'FACULTAD DE CIENCIAS BIOMÉDICAS',
    escuela: null,
    label: 'Decano',
  },
  'autoridad@unsa.edu.pe': { role: 'autoridad', facultad: null, escuela: null, label: 'Autoridad' },
} as const;

import React from 'react';
import { LogOut } from 'lucide-react';
import type { UserSession } from '@/types/dashboard';
import { ROLE_LABELS } from '@/lib/session';

export default function TopBar({
  session,
  onLogout,
  adminAction,
}: {
  session: UserSession;
  onLogout: () => void;
  adminAction?: React.ReactNode;
}) {
  return (
    <header className="overflow-hidden rounded-2xl border shadow-[0_8px_24px_rgba(90,22,32,0.12)]" style={{ borderColor: 'var(--granate-oscuro)', backgroundColor: 'var(--papel)' }}>
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b-4" style={{ backgroundColor: 'var(--granate)', borderColor: 'var(--dorado)', color: '#ffffff' }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--dorado)' }}>
              Universidad Nacional de San Agustín de Arequipa
            </p>
            <h1 className="font-serif text-[20px] sm:text-[28px] leading-tight font-normal text-white">
              Tablero de Control - Pregrado
            </h1>
            <p className="font-serif italic text-[13px] sm:text-[15px] opacity-95 mt-1" style={{ color: '#f7efe6' }}>
              Rendimiento académico y seguimiento institucional
            </p>
          </div>

          <div className="text-left md:text-right text-[11px] sm:text-xs leading-relaxed px-3 py-2 rounded-xl border" style={{ backgroundColor: 'rgba(250,247,242,0.12)', borderColor: 'rgba(255,255,255,0.18)' }}>
            <div className="font-semibold text-white">{session.name}</div>
            <div className="font-semibold" style={{ color: 'var(--dorado)' }}>{ROLE_LABELS[session.role]}</div>
            {session.facultad && <div style={{ color: '#f8f1e8' }}>{session.facultad}</div>}
            {session.escuela && <div style={{ color: '#f8f1e8' }}>{session.escuela}</div>}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-3" style={{ backgroundColor: 'var(--crema)', borderTop: '1px solid var(--linea)' }}>
        <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--texto-sec)' }}>
          Panel institucional · acceso restringido
        </div>
        <div className="flex items-center gap-2">
          {adminAction}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-2 rounded-lg border transition"
            style={{ backgroundColor: 'var(--granate)', borderColor: 'var(--granate-oscuro)' }}
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}

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
    <header className="overflow-hidden rounded-2xl border border-[color:var(--linea)] bg-[var(--papel)] shadow-sm">
      <div className="bg-[var(--granate)] text-white px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] opacity-80 mb-1">
              Universidad Nacional de San Agustín de Arequipa
            </p>
            <h1 className="font-serif text-2xl sm:text-[28px] leading-tight font-normal">
              Tablero de Control - Pregrado
            </h1>
            <p className="font-serif italic text-sm sm:text-[15px] opacity-90 mt-1">
              Rendimiento académico y seguimiento institucional
            </p>
          </div>

          <div className="text-right text-[11px] sm:text-xs leading-relaxed opacity-85">
            <div>{session.name}</div>
            <div className="font-semibold text-[color:var(--dorado)]">{ROLE_LABELS[session.role]}</div>
            {session.facultad && <div>{session.facultad}</div>}
            {session.escuela && <div>{session.escuela}</div>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[var(--crema)] border-t border-[color:var(--linea)]">
        <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--texto-sec)]">
          Panel institucional · acceso restringido
        </div>
        <div className="flex items-center gap-2">
        {adminAction}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--texto)] hover:text-[var(--granate)] px-3 py-2 rounded-lg border border-[color:var(--linea)] bg-white transition"
        >
          <LogOut size={14} />
          Salir
        </button>
      </div>
      </div>
    </header>
  );
}

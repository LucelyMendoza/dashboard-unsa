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
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
      <div>
        <h1 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)] leading-tight">
          TABLERO DE CONTROL - PREGRADO
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {session.name} · <span className="font-semibold text-[var(--accent)]">{ROLE_LABELS[session.role]}</span>
          {session.facultad && <span className="text-slate-400"> · {session.facultad}</span>}
          {session.escuela && <span className="text-slate-400"> · {session.escuela}</span>}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {adminAction}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition"
        >
          <LogOut size={14} />
          Salir
        </button>
      </div>
    </header>
  );
}

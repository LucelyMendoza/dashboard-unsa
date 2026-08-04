import React from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import type { UserSession } from '@/types/dashboard';
import { ROLE_LABELS } from '@/lib/session';

export default function TopBar({
  session,
  onLogout,
  adminAction,
  mobileFilters,
  mobileOpen,
  onToggleMobile,
}: {
  session: UserSession;
  onLogout: () => void;
  adminAction?: React.ReactNode;
  mobileFilters?: React.ReactNode;
  mobileOpen: boolean;
  onToggleMobile: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggleMobile}
        className="md:hidden fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 shadow-lg text-white"
        style={{ backgroundColor: 'var(--granate)' }}
        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        <span className="text-xs font-semibold">{mobileOpen ? 'Cerrar' : 'Menú'}</span>
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú lateral"
          onClick={onToggleMobile}
          className="md:hidden fixed inset-0 z-40 bg-black/35"
        />
      )}

      <aside
        className={[
          'fixed md:hidden inset-y-0 left-0 z-50 h-full w-[88vw] max-w-sm',
          'transform transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <header className="relative h-full rounded-r-2xl border-r border-t border-b shadow-[0_8px_24px_rgba(90,22,32,0.12)] flex flex-col overflow-hidden" style={{ borderColor: 'var(--granate-oscuro)', backgroundColor: 'var(--papel)' }}>
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: 'var(--granate)', borderColor: 'var(--dorado)', color: '#ffffff' }}>
            <div className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--dorado)' }}>
              Menú institucional
            </div>
            <button
              type="button"
              onClick={onToggleMobile}
              className="flex items-center justify-center rounded-full w-10 h-10 text-white shadow-md"
              style={{ backgroundColor: 'var(--granate-oscuro)' }}
              aria-label="Cerrar menú lateral"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
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

          <div className="p-4 sm:p-5 bg-white/80">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--texto-sec)]">Filtros</p>
                <p className="text-xs text-[var(--texto)] font-semibold">Desliza y ajusta el tablero</p>
              </div>
            </div>
            {mobileFilters}
          </div>

          <div className="px-4 sm:px-6 py-3 border-t border-[color:var(--linea)]" style={{ backgroundColor: 'var(--crema)' }}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--texto-sec)' }}>
                Sesión
              </div>
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
          </div>
        </header>
      </aside>

      <header className="hidden md:block overflow-hidden rounded-2xl border shadow-[0_8px_24px_rgba(90,22,32,0.12)]" style={{ borderColor: 'var(--granate-oscuro)', backgroundColor: 'var(--papel)' }}>
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b-4" style={{ backgroundColor: 'var(--granate)', borderColor: 'var(--dorado)', color: '#ffffff' }}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--dorado)' }}>
                Universidad Nacional de San Agustín de Arequipa
              </p>
              <h1 className="font-serif text-[24px] lg:text-[30px] leading-tight font-normal text-white">
                Tablero de Control - Pregrado
              </h1>
              <p className="font-serif italic text-[14px] lg:text-[16px] opacity-95 mt-1" style={{ color: '#f7efe6' }}>
                Rendimiento académico y seguimiento institucional
              </p>
            </div>

            <div className="text-right text-xs leading-relaxed px-4 py-3 rounded-xl border" style={{ backgroundColor: 'rgba(250,247,242,0.12)', borderColor: 'rgba(255,255,255,0.18)' }}>
              <div className="font-semibold text-white">{session.name}</div>
              <div className="font-semibold" style={{ color: 'var(--dorado)' }}>{ROLE_LABELS[session.role]}</div>
              {session.facultad && <div style={{ color: '#f8f1e8' }}>{session.facultad}</div>}
              {session.escuela && <div style={{ color: '#f8f1e8' }}>{session.escuela}</div>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3" style={{ backgroundColor: 'var(--crema)', borderTop: '1px solid var(--linea)' }}>
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
    </>
  );
}

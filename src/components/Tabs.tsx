import React from 'react';

export interface TabDef {
  key: string;
  label: string;
}

export default function Tabs({ tabs, active, onChange }: { tabs: TabDef[]; active: string; onChange: (k: string) => void }) {
  return (
    <div className="border-b border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`shrink-0 px-3.5 py-2.5 text-xs font-semibold border-b-2 transition ${
              active === t.key
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

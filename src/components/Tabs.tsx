import React from 'react';

export interface TabDef<K extends string = string> {
  key: K;
  label: string;
}

export default function Tabs<K extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef<K>[];
  active: K;
  onChange: (k: K) => void;
}) {
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

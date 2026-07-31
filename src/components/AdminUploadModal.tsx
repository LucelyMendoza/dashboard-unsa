'use client';

import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
import type { DashboardDataset } from '@/types/dashboard';
import { REQUIRED_HEADERS } from '@/lib/excelParser';

interface Props {
  onDataUpdated: (fileBuffer: ArrayBuffer) => { ok: true } | { ok: false; error: string };
  dataset: DashboardDataset | null;
}

export default function AdminUploadModal({ onDataUpdated, dataset }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // permite volver a subir el mismo archivo si corrige algo

    setStatus({ type: 'ok', text: 'Procesando archivo...' });
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt.target?.result) return;
      const result = onDataUpdated(evt.target.result as ArrayBuffer);
      if (result.ok) {
        setStatus({ type: 'ok', text: 'Datos cargados y actualizados en esta sesión. Descarga el JSON para publicarlo.' });
      } else {
        setStatus({ type: 'error', text: result.error });
      }
    };
    reader.onerror = () => setStatus({ type: 'error', text: 'No se pudo leer el archivo.' });
    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    if (!dataset) return;
    const blob = new Blob([JSON.stringify(dataset)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'initialData.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition"
      >
        <Upload size={15} />
        <span className="hidden sm:inline">Subir Excel / Actualizar</span>
        <span className="sm:hidden">Excel</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
              <FileSpreadsheet className="text-[var(--accent)]" size={18} />
              Cargar Excel de Rendimiento
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              El archivo debe incluir estas columnas (en cualquier orden):
              <br />
              <code className="bg-slate-100 p-1.5 rounded font-mono text-[10px] block mt-1.5 leading-relaxed">
                {REQUIRED_HEADERS.join(' | ')}
              </code>
            </p>

            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
            />

            {status && (
              <p className={`mt-3 text-xs font-semibold flex items-start gap-1.5 ${status.type === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>
                {status.type === 'ok' ? <CheckCircle size={14} className="shrink-0 mt-0.5" /> : <AlertCircle size={14} className="shrink-0 mt-0.5" />}
                {status.text}
              </p>
            )}

            {status?.type === 'ok' && (
              <button
                onClick={handleDownload}
                className="mt-3 w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 text-xs font-semibold py-2 rounded-lg hover:bg-slate-50"
              >
                <Download size={14} />
                Descargar initialData.json actualizado
              </button>
            )}

            <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
              La carga se aplica solo a tu sesión (el sitio no tiene backend propio). Descarga el
              JSON y reemplaza <code>public/data/initialData.json</code> en el proyecto para
              publicar el cambio para todos.
            </p>

            <div className="mt-4 flex justify-end">
              <button onClick={() => setIsOpen(false)} className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

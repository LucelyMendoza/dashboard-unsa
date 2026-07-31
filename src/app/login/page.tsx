'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, LogIn } from 'lucide-react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { ROLE_MAP, getUserByEmail } from '@/lib/roles';
import { setSession } from '@/lib/session';
import { ROLE_LABELS } from '@/lib/session';
import { firebaseAuth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const accounts = Object.entries(ROLE_MAP).map(([email, value]) => ({
    email,
    ...value,
  }));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user?.email) return;
      const mapped = getUserByEmail(user.email);
      if (!mapped) {
        setError('Tu correo autenticado no tiene un rol asignado.');
        return;
      }
      setSession(mapped);
      router.replace('/dashboard');
    });

    return unsubscribe;
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const authEmail = credential.user.email;
      if (!authEmail) throw new Error('No se pudo obtener el correo autenticado.');

      const user = getUserByEmail(authEmail);
      if (!user) {
        setError('Tu correo autenticado no está habilitado para este panel.');
        return;
      }

      setSession(user);
      router.replace('/dashboard');
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'No se pudo iniciar sesión. Verifica tu correo y contraseña.';
      setError(message.includes('auth/') ? 'Correo o contraseña incorrectos.' : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--ink)] flex items-center justify-center mb-4">
            <GraduationCap className="text-[var(--paper)]" size={22} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[var(--ink)]">Panel de Rendimiento Académico</h1>
          <p className="text-xs text-slate-500 mt-1 tracking-wide uppercase">UNSA · Dirección de Servicios Académicos</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4"
        >
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 tracking-wide">
              Correo institucional
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="nombre@unsa.edu.pe"
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              list="demo-accounts"
            />
            <div className="mt-3">
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 tracking-wide">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Tu contraseña de Firebase"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
            <datalist id="demo-accounts">
              {accounts.map((a) => (
                <option key={a.email} value={a.email}>
                  {ROLE_LABELS[a.role]}
                </option>
              ))}
            </datalist>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[var(--ink)] hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded-lg transition"
          >
            <LogIn size={16} />
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-5 leading-relaxed">
          Acceso autenticado con Firebase. Debes crear estos usuarios en Firebase Auth y
          habilitar el inicio por correo/contraseña.
        </p>
      </div>
    </div>
  );
}

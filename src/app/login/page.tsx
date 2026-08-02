'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, LogIn } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getUserByEmail } from '@/lib/roles';
import { setSession } from '@/lib/session';
import { firebaseAuth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const provider = new GoogleAuthProvider();
  // Fuerza la selección de cuenta para no reutilizar una sesión de Google equivocada.
  provider.setCustomParameters({ prompt: 'select_account' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user?.email) return;
      const mapped = getUserByEmail(user.email);
      if (!mapped) {
        // Autenticado con Google pero sin rol asignado: lo sacamos para que
        // no quede una sesión huérfana y mostramos el mensaje en el login.
        setError('Tu correo autenticado no tiene un rol asignado en este panel.');
        void signOut(firebaseAuth);
        return;
      }
      setSession(mapped);
      router.replace('/dashboard');
    });

    return unsubscribe;
  }, [router]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const authEmail = result.user.email;
      if (!authEmail) throw new Error('No se pudo obtener el correo autenticado.');

      const user = getUserByEmail(authEmail);
      if (!user) {
        setError('Tu correo de Google no está habilitado para este panel.');
        await signOut(firebaseAuth);
        return;
      }

      setSession(user);
      router.replace('/dashboard');
    } catch (err) {
      const message =
        err instanceof Error && err.message ? err.message : 'No se pudo iniciar sesión con Google.';
      // auth/popup-closed-by-user, auth/cancelled-popup-request, auth/popup-blocked, etc.
      if (message.includes('auth/popup-closed-by-user') || message.includes('auth/cancelled-popup-request')) {
        setError('Se canceló el inicio de sesión con Google.');
      } else if (message.includes('auth/popup-blocked')) {
        setError('El navegador bloqueó la ventana de Google. Habilita las ventanas emergentes.');
      } else {
        setError('No se pudo iniciar sesión con Google. Intenta nuevamente.');
      }
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

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
          <p className="text-sm text-slate-600 text-center">
            Ingresa con tu cuenta institucional <span className="font-semibold">@unsa.edu.pe</span> de Google.
          </p>

          {error && <p className="text-xs text-red-600 text-center">{error}</p>}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2.5 rounded-lg border border-slate-300 transition disabled:opacity-60"
          >
            <GoogleIcon />
            {loading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          <div className="flex items-center gap-1.5 justify-center text-[var(--ink)]">
            <LogIn size={14} className="opacity-50" />
            <span className="text-[11px] text-slate-400">Acceso restringido a usuarios autorizados</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

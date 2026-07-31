import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TABLERO DE CONTROL - PREGRADO",
  description: "Panel de control de rendimiento académico de pregrado — Dirección de Servicios Académicos, UNSA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--paper)]">{children}</body>
    </html>
  );
}

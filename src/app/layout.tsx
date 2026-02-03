import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GatedAccess from "@/components/GatedAccess";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EIR - Buscador de Repuestos",
  description: "Sistema de localización de repuestos de electromedicina",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="noise-overlay" />
        <div className="aurora-base bg-glow-1" />
        <div className="aurora-base bg-glow-2" />
        <div className="aurora-base bg-glow-3" />
        <GatedAccess>
          {children}
        </GatedAccess>
      </body>
    </html>
  );
}

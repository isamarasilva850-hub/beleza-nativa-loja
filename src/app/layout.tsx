import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beleza Nativa - Lingerie e Moda Praia | Atacado",
  description: "Beleza Nativa - Lingerie e Moda Praia. Atacado para todo Brasil.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative">
        {children}
        <a href="/quero-comecar" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          background: 'linear-gradient(to right, rgb(20, 184, 166), rgb(13, 148, 136))',
          color: 'white',
          borderRadius: '9999px',
          padding: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          animation: 'bounce 2s infinite',
        } as React.CSSProperties}>
          <span style={{fontSize: '24px'}}>💰</span>
          <div style={{fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap'}}>
            <div>GANHE 100%</div>
            <div style={{fontSize: '12px', opacity: 0.9}}>Calcule seu lucro</div>
          </div>
        </a>
        <RegisterServiceWorker />
        <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`}</style>
      </body>
    </html>
  );
}

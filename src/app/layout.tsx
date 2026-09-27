import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

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
        <a href="/quero-comecar" className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full p-4 shadow-2xl flex items-center gap-2 transition-all transform hover:scale-110 animate-bounce">
          <span className="text-2xl">💰</span>
          <div className="text-sm font-bold whitespace-nowrap">
            <div>GANHE 100%</div>
            <div className="text-xs opacity-90">Calcule seu lucro</div>
          </div>
        </a>
      </body>
    </html>
  );
}

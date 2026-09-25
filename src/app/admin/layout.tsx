"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const sections = [
  {
    title: "PRINCIPAL",
    items: [
      { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ],
  },
  {
    title: "MINHA LOJA",
    items: [
      { href: "/admin/pedidos", label: "Painel de Pedidos", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
      { href: "/admin/vendas", label: "Vendas em Tempo Real", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
      { href: "/admin/montar-pedido", label: "📦 Montar Pedido", icon: "M16 11V7a4 4 0 00-4-4H5a4 4 0 00-4 4v10a4 4 0 004 4h2" },
    ],
  },
  {
    title: "GESTÃO DE PRODUTOS",
    items: [
      { href: "/admin/produtos-upload", label: "📸 Upload de Produtos", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
      { href: "/admin/produtos", label: "Gerenciar Produtos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
      { href: "/admin/cores", label: "🎨 Gerenciar Cores", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
      { href: "/admin/estoque", label: "Controle de Estoque", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
      { href: "/admin/etiquetas", label: "Etiquetas", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" },
    ],
  },
  {
    title: "COMERCIAL",
    items: [
      { href: "/admin/crm", label: "📊 CRM Completo", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 000 4m0-2v4m0-11v1m0 0a9 9 0 015.25 2.023M19 19H5a2 2 0 01-2-2V7a2 2 0 012-2h1" },
      { href: "/admin/parceiros", label: "Carteira de Clientes", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
      { href: "/admin/pedidos-revendedoras", label: "📦 Pedidos Revendedoras", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
      { href: "/admin/leads", label: "Gerenciar Leads", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
      { href: "/admin/agenda", label: "Agenda / Telemarketing", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    ],
  },
  {
    title: "FERRAMENTAS",
    items: [
      { href: "/admin/catalogo", label: "Catálogo Digital", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
      { href: "/admin/cupons", label: "Cupons de Desconto", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
      { href: "/admin/tabela-precos", label: "Tabela de Preços", icon: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" },
    ],
  },
  {
    title: "RELATÓRIOS",
    items: [
      { href: "/admin/relatorios", label: "KPIs de Vendas", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
      { href: "/admin/vendedores", label: "Desempenho Vendedores", icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    ],
  },
  {
    title: "CONFIGURAÇÕES",
    items: [
      { href: "/admin/usuarios", label: "Usuários e Permissões", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
      { href: "/admin/configuracoes", label: "Configurações Gerais", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    ],
  },
];

const ADMIN_KEY = "belezanativa_admin_auth";
const ADMIN_PASS = "bn2026";
// Force rebuild 2026-09-24 v2 - varejo changes

function AdminGate({ onAuth }: { onAuth: () => void }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem(ADMIN_KEY, "1");
      onAuth();
    } else {
      setError(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-[#7BC9C2] rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">BN</div>
          <h1 className="text-lg font-bold text-gray-800">Painel Administrativo</h1>
          <p className="text-sm text-gray-500">Digite a senha para acessar</p>
        </div>
        <input
          type="password"
          value={pass}
          onChange={e => { setPass(e.target.value); setError(false); }}
          placeholder="Senha"
          className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7BC9C2] ${error ? "border-red-400" : "border-gray-300"}`}
          autoFocus
        />
        {error && <p className="text-xs text-red-500 text-center">Senha incorreta</p>}
        <button type="submit" className="w-full bg-[#7BC9C2] hover:bg-[#5fb3ac] text-white py-3 rounded-lg text-sm font-semibold transition-colors">
          Entrar
        </button>
        <Link href="/" className="block text-center text-xs text-gray-400 hover:text-gray-600">← Voltar à loja</Link>
      </form>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setAuthenticated(sessionStorage.getItem(ADMIN_KEY) === "1");
    setChecking(false);
  }, []);

  if (checking) return null;
  if (!authenticated) return <AdminGate onAuth={() => setAuthenticated(true)} />;

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#1a1a2e] text-white transform transition-transform md:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7BC9C2] rounded-lg flex items-center justify-center font-bold text-sm">BN</div>
            <div>
              <p className="font-bold text-sm leading-tight">Beleza Nativa</p>
              <p className="text-[10px] text-gray-400">Painel Administrativo</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1">{section.title}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                        isActive ? "bg-[#7BC9C2] text-white font-semibold" : "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar à Loja
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">ISAMARA DE CASSIA SILVA</span>
            <div className="w-8 h-8 bg-[#7BC9C2] rounded-full flex items-center justify-center text-white text-xs font-bold">IS</div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

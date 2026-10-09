"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const APARELHO_KEY = "belezanativa_aparelho";

function getAparelhoId(): string {
  let id = localStorage.getItem(APARELHO_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(APARELHO_KEY, id);
  }
  return id;
}

function getIdentidade(): { nome?: string; telefone?: string } {
  try {
    const auth = JSON.parse(localStorage.getItem("belezanativa_auth") || "null");
    if (auth?.name && auth?.phone) return { nome: auth.name, telefone: auth.phone };
  } catch {}
  try {
    const leads = JSON.parse(localStorage.getItem("belezanativa_leads") || "[]");
    const ultimo = leads[leads.length - 1];
    if (ultimo?.name && ultimo?.phone) return { nome: ultimo.name, telefone: ultimo.phone };
  } catch {}
  return {};
}

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const identidade = getIdentidade();
      fetch("/api/visitas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aparelho: getAparelhoId(),
          nome: identidade.nome,
          telefone: identidade.telefone,
          pagina: pathname,
        }),
      }).catch(() => {});
    } catch {}
  }, [pathname]);

  return null;
}

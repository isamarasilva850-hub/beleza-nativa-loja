"use client";

import { useState, useEffect } from "react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export default function LeadCaptureModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already captured in this session
    const capturedLead = localStorage.getItem("belezanativa_lead_captured");
    if (!capturedLead) {
      // Show after 5 seconds of landing
      const timer = setTimeout(() => setIsOpen(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Preencha nome e telefone");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create lead object
      const lead: Lead = {
        id: `lead_${Date.now()}`,
        name: form.name.trim(),
        phone: form.phone.trim(),
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingLeads = JSON.parse(
        localStorage.getItem("belezanativa_leads") || "[]"
      );
      existingLeads.push(lead);
      localStorage.setItem("belezanativa_leads", JSON.stringify(existingLeads));

      // Mark as captured
      localStorage.setItem("belezanativa_lead_captured", "true");

      // Try to send to backend (optional)
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
      } catch (err) {
        console.log("Lead saved locally (backend unavailable)");
      }

      setIsOpen(false);
      setForm({ name: "", phone: "" });
    } catch (err) {
      setError("Erro ao salvar dados. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-5 animate-slideUp border-2 border-[#7BC9C2]/20 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7BC9C2]/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-200/10 rounded-full -ml-12 -mb-12" />

        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        {/* Header - Premium style */}
        <div className="text-center mb-2 relative z-10">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full p-4 animate-pulse">
              <span className="text-4xl">💎</span>
            </div>
          </div>

          <div className="inline-block mb-3 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-xs font-bold">
            🎁 OFERTA EXCLUSIVA
          </div>

          <h2 className="text-3xl font-black text-gray-900 leading-tight mt-2">
            Pegue seu Cupom Surpresa!
          </h2>

          <p className="text-gray-600 text-sm mt-3 font-medium">
            🎁 Cupom surpresa + Consulte opções de frete
          </p>

          <div className="flex justify-center gap-2 mt-3 text-xs text-gray-700">
            <span className="bg-green-50 px-3 py-1 rounded-full">✓ Sem compromisso</span>
            <span className="bg-green-50 px-3 py-1 rounded-full">✓ Rápido</span>
          </div>
        </div>

        {/* Benefits highlight */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-50 rounded-xl p-4 border-2 border-yellow-300">
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <span className="text-gray-800"><strong>Cupom surpresa</strong> no seu email</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚚</span>
              <span className="text-gray-800"><strong>Confira frete</strong> para seu estado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⏰</span>
              <span className="text-gray-800"><strong>Válido por 48h</strong> - não espere!</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">SEU NOME *</label>
            <input
              type="text"
              placeholder="Ex: Maria Silva"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7BC9C2] focus:ring-2 focus:ring-[#7BC9C2]/20 transition-all font-medium"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">WHATSAPP (COM DDD) *</label>
            <input
              type="tel"
              placeholder="Ex: (35) 99999-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#7BC9C2] focus:ring-2 focus:ring-[#7BC9C2]/20 transition-all font-medium"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg text-center font-medium">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] hover:shadow-2xl text-white font-black py-3.5 rounded-xl transition-all disabled:opacity-50 text-lg shadow-lg hover:scale-105 active:scale-95 transform duration-200 relative overflow-hidden"
          >
            <span className="relative z-10">
              {isSubmitting ? "⏳ Gerando cupom..." : "🔓 DESBLOQUEAR CUPOM"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full text-gray-600 hover:text-gray-800 font-semibold py-2 rounded-lg transition-colors"
          >
            Não, obrigado
          </button>
        </form>

        {/* Trust badges */}
        <div className="text-center space-y-2">
          <p className="text-[11px] text-gray-500 font-semibold">
            ✓ Dados seguros | 100% confidencial
          </p>
          <p className="text-[10px] text-orange-600 font-bold animate-pulse">
            ⚡ Cupom enviado por WhatsApp em segundos!
          </p>
        </div>
      </div>
    </div>
  );
}

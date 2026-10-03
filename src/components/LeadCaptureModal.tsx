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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-br from-[#7BC9C2] to-[#5fb3ac] rounded-full p-3 mb-3">
            <span className="text-2xl">💝</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Ganhe 20% de Desconto!</h2>
          <p className="text-sm text-gray-600 mt-1">Receba ofertas exclusivas e frete grátis</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] focus:ring-1 focus:ring-[#7BC9C2]"
              required
              autoFocus
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder="Seu WhatsApp (com DDD)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2] focus:ring-1 focus:ring-[#7BC9C2]"
              required
            />
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] hover:shadow-lg text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Ganhar 20% OFF"}
          </button>
        </form>

        {/* Footer text */}
        <p className="text-[10px] text-gray-400 text-center">
          ✓ Frete grátis para todo Brasil | ✓ Sem compromisso
        </p>
      </div>
    </div>
  );
}

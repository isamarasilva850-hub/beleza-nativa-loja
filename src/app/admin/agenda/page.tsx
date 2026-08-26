"use client";

import { useState, useEffect } from "react";

interface AgendaItem {
  id: string;
  clientName: string;
  phone: string;
  date: string;
  time: string;
  type: "ligacao" | "whatsapp" | "visita" | "followup";
  notes: string;
  done: boolean;
  vendedor: string;
}

const typeLabels: Record<string, string> = { ligacao: "Ligação", whatsapp: "WhatsApp", visita: "Visita", followup: "Follow-up" };
const typeColors: Record<string, string> = { ligacao: "bg-blue-100 text-blue-700", whatsapp: "bg-green-100 text-green-700", visita: "bg-purple-100 text-purple-700", followup: "bg-orange-100 text-orange-700" };

export default function Agenda() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: "", phone: "", date: new Date().toISOString().split("T")[0], time: "09:00", type: "whatsapp" as AgendaItem["type"], notes: "", vendedor: "Isamara" });
  const [view, setView] = useState<"pendentes" | "concluidos" | "todos">("pendentes");

  useEffect(() => {
    const stored = localStorage.getItem("belezanativa_agenda");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const save = (updated: AgendaItem[]) => {
    setItems(updated);
    localStorage.setItem("belezanativa_agenda", JSON.stringify(updated));
  };

  const addItem = () => {
    if (!form.clientName) return;
    save([{ id: Date.now().toString(), ...form, done: false }, ...items]);
    setForm({ clientName: "", phone: "", date: new Date().toISOString().split("T")[0], time: "09:00", type: "whatsapp", notes: "", vendedor: "Isamara" });
    setShowForm(false);
  };

  const toggleDone = (id: string) => save(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  const removeItem = (id: string) => { if (confirm("Remover?")) save(items.filter((i) => i.id !== id)); };

  const filtered = items.filter((i) => {
    if (view === "pendentes") return !i.done;
    if (view === "concluidos") return i.done;
    return true;
  }).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  const today = new Date().toISOString().split("T")[0];
  const todayCount = items.filter((i) => i.date === today && !i.done).length;
  const overdueCount = items.filter((i) => i.date < today && !i.done).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agenda / Telemarketing</h1>
          <p className="text-sm text-gray-500 mt-1">
            {todayCount} compromissos hoje{overdueCount > 0 && ` · ${overdueCount} atrasados`}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">
          + Agendar
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-bold text-gray-700">Novo Agendamento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input placeholder="Cliente *" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AgendaItem["type"] })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
              <option value="ligacao">Ligação</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="visita">Visita</option>
              <option value="followup">Follow-up</option>
            </select>
            <select value={form.vendedor} onChange={(e) => setForm({ ...form, vendedor: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
              <option value="Rosemari">Rosemari</option>
              <option value="Isamara">Isamara</option>
              <option value="Jaynie">Jaynie</option>
            </select>
          </div>
          <input placeholder="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
          <div className="flex gap-2">
            <button onClick={addItem} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold">Salvar</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {(["pendentes", "concluidos", "todos"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${view === v ? "bg-[#7BC9C2] text-white" : "bg-white text-gray-600 border border-gray-200"}`}>
            {v === "pendentes" ? "Pendentes" : v === "concluidos" ? "Concluídos" : "Todos"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <p className="font-medium">Nenhum agendamento</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${item.date < today && !item.done ? "border-red-200 bg-red-50/30" : "border-gray-200"}`}>
              <button onClick={() => toggleDone(item.id)} className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${item.done ? "bg-[#7BC9C2] border-[#7BC9C2] text-white" : "border-gray-300 hover:border-[#7BC9C2]"}`}>
                {item.done && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold text-sm ${item.done ? "text-gray-400 line-through" : "text-gray-800"}`}>{item.clientName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${typeColors[item.type]}`}>{typeLabels[item.type]}</span>
                  {item.date < today && !item.done && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">ATRASADO</span>}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {new Date(item.date + "T00:00:00").toLocaleDateString("pt-BR")} às {item.time} · {item.vendedor}
                  {item.notes && ` · ${item.notes}`}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {item.phone && (
                  <a href={`https://wa.me/55${item.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  </a>
                )}
                <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "vendedor" | "visualizador";
  active: boolean;
  permissions: string[];
  lastLogin?: string;
}

const defaultUsers: User[] = [
  { id: "1", name: "Rosemari", email: "rosemari@belezanativa.com.br", role: "vendedor", active: true, permissions: ["pedidos", "clientes", "leads", "agenda", "catalogo", "estoque_view"], lastLogin: "2026-08-25T10:30:00" },
  { id: "2", name: "Isamara", email: "isamara@belezanativa.com.br", role: "admin", active: true, permissions: ["all"], lastLogin: "2026-08-26T08:00:00" },
  { id: "4", name: "Jaynie", email: "jaynie@belezanativa.com.br", role: "vendedor", active: true, permissions: ["pedidos", "clientes", "leads", "agenda", "catalogo", "estoque_view"], lastLogin: "2026-08-24T14:15:00" },
];

const roleLabels: Record<string, string> = { admin: "Administrador", vendedor: "Vendedor", visualizador: "Visualizador" };
const roleColors: Record<string, string> = { admin: "bg-purple-100 text-purple-700", vendedor: "bg-blue-100 text-blue-700", visualizador: "bg-gray-100 text-gray-600" };

const allPermissions = [
  { key: "pedidos", label: "Pedidos" },
  { key: "produtos", label: "Produtos" },
  { key: "estoque", label: "Estoque (editar)" },
  { key: "estoque_view", label: "Estoque (ver)" },
  { key: "clientes", label: "Clientes" },
  { key: "leads", label: "Leads" },
  { key: "agenda", label: "Agenda" },
  { key: "catalogo", label: "Catálogo" },
  { key: "cupons", label: "Cupons" },
  { key: "relatorios", label: "Relatórios" },
  { key: "configuracoes", label: "Configurações" },
  { key: "usuarios", label: "Usuários" },
];

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "vendedor" as User["role"], permissions: ["pedidos", "clientes", "leads", "agenda", "catalogo", "estoque_view"] });

  useEffect(() => {
    const stored = localStorage.getItem("belezanativa_users");
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      setUsers(defaultUsers);
      localStorage.setItem("belezanativa_users", JSON.stringify(defaultUsers));
    }
  }, []);

  const save = (updated: User[]) => {
    setUsers(updated);
    localStorage.setItem("belezanativa_users", JSON.stringify(updated));
  };

  const addUser = () => {
    if (!form.name || !form.email) return;
    const newUser: User = { id: Date.now().toString(), ...form, active: true };
    save([...users, newUser]);
    setForm({ name: "", email: "", role: "vendedor", permissions: ["pedidos", "clientes", "leads", "agenda", "catalogo", "estoque_view"] });
    setShowForm(false);
  };

  const toggleActive = (id: string) => save(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));

  const updateRole = (id: string, role: User["role"]) => {
    save(users.map((u) => (u.id === id ? { ...u, role, permissions: role === "admin" ? ["all"] : u.permissions } : u)));
  };

  const togglePermission = (id: string, perm: string) => {
    save(users.map((u) => {
      if (u.id !== id) return u;
      const has = u.permissions.includes(perm);
      return { ...u, permissions: has ? u.permissions.filter((p) => p !== perm) : [...u.permissions, perm] };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Usuários e Permissões</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold hover:bg-[#6ab8b1]">
          + Novo Usuário
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-bold text-gray-700">Cadastrar Usuário</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input placeholder="Nome *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <input placeholder="E-mail *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#7BC9C2]">
              <option value="admin">Administrador</option>
              <option value="vendedor">Vendedor</option>
              <option value="visualizador">Visualizador</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addUser} className="px-4 py-2 bg-[#7BC9C2] text-white rounded-lg text-sm font-bold">Salvar</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className={`bg-white rounded-xl border p-5 ${user.active ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${user.active ? "bg-[#7BC9C2]" : "bg-gray-400"}`}>
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">{user.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColors[user.role]}`}>{roleLabels[user.role]}</span>
                    {!user.active && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">INATIVO</span>}
                  </div>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {user.lastLogin && <p className="text-[10px] text-gray-400 mt-0.5">Último acesso: {new Date(user.lastLogin).toLocaleString("pt-BR")}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select value={user.role} onChange={(e) => updateRole(user.id, e.target.value as User["role"])} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#7BC9C2]">
                  <option value="admin">Administrador</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="visualizador">Visualizador</option>
                </select>
                <button onClick={() => setEditingId(editingId === user.id ? null : user.id)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200">
                  Permissões
                </button>
                <button onClick={() => toggleActive(user.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${user.active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                  {user.active ? "Desativar" : "Ativar"}
                </button>
              </div>
            </div>

            {editingId === user.id && user.role !== "admin" && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Permissões de Acesso</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allPermissions.map((perm) => (
                    <label key={perm.key} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.permissions.includes(perm.key)}
                        onChange={() => togglePermission(user.id, perm.key)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-xs text-gray-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {editingId === user.id && user.role === "admin" && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Administradores têm acesso completo a todas as funcionalidades.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

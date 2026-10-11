'use client';

import { useEffect, useState } from 'react';

const SEGREDO_KEY = 'belezanativa_reset_secret';

export default function ContasPage() {
  const [segredo, setSegredo] = useState('');
  const [login, setLogin] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState<{ nome: string; login: string; senhaTemporaria: string } | null>(null);
  const [contas, setContas] = useState<{ login: string; nome: string | null; telefone: string | null; criado_em: string }[] | null>(null);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    try {
      setSegredo(sessionStorage.getItem(SEGREDO_KEY) || '');
    } catch {
      // sem sessionStorage, o segredo é digitado de novo
    }
  }, []);

  const redefinir = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setResultado(null);
    setCarregando(true);
    try {
      try {
        sessionStorage.setItem(SEGREDO_KEY, segredo);
      } catch {
        // ignora
      }
      const resposta = await fetch('/api/conta/redefinir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': segredo },
        body: JSON.stringify({ login }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.error || 'Não foi possível redefinir a senha.');
        return;
      }
      setResultado(dados);
      setLogin('');
    } catch {
      setErro('Sem conexão. Tente de novo.');
    } finally {
      setCarregando(false);
    }
  };

  const carregarLista = async () => {
    setErro('');
    try {
      sessionStorage.setItem(SEGREDO_KEY, segredo);
    } catch {
      // ignora
    }
    const resposta = await fetch('/api/conta/lista', { headers: { 'x-admin-secret': segredo } });
    const dados = await resposta.json();
    if (!resposta.ok) {
      setErro(dados.error || 'Não foi possível carregar a lista.');
      return;
    }
    setContas(dados);
  };

  const filtradas = (contas || []).filter((c) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;
    return (c.nome || '').toLowerCase().includes(termo) || c.login.toLowerCase().includes(termo) || (c.telefone || '').includes(termo);
  });

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">🔑 Redefinir senha de cliente</h1>
      <p className="text-gray-600 mb-6">
        Use quando a cliente esquecer a senha. O sistema gera uma senha temporária: envie para ela pelo WhatsApp.
      </p>

      <form onSubmit={redefinir} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Segredo do admin</label>
          <input
            type="password"
            required
            value={segredo}
            onChange={(e) => setSegredo(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp ou e-mail da cliente</label>
          <input
            type="text"
            required
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Ex.: 35999181226 ou e-mail"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
        >
          {carregando ? 'Gerando...' : 'Gerar senha temporária'}
        </button>
      </form>

      {erro && (
        <div className="mt-4 bg-red-50 border-2 border-red-400 rounded-lg p-4 text-red-800">{erro}</div>
      )}

      {resultado && (
        <div className="mt-4 bg-green-50 border-2 border-green-500 rounded-lg p-4 text-green-900">
          <p className="font-semibold mb-2">Senha temporária de {resultado.nome || resultado.login}:</p>
          <p className="text-2xl font-mono font-bold tracking-widest mb-3">{resultado.senhaTemporaria}</p>
          <p className="text-sm">Envie para a cliente pelo WhatsApp, para ela entrar em "Minha conta". Esta senha aparece só agora.</p>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">👥 Clientes com conta</h2>
        {contas === null ? (
          <button
            type="button"
            onClick={carregarLista}
            disabled={!segredo}
            className="w-full border-2 border-teal-600 text-teal-700 font-bold py-3 rounded-lg disabled:opacity-50"
          >
            Carregar lista
          </button>
        ) : (
          <>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou WhatsApp"
              className="w-full px-3 py-2 mb-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
            />
            <p className="text-sm text-gray-500 mb-2">{filtradas.length} de {contas.length} clientes</p>
            <div className="bg-white rounded-lg shadow divide-y">
              {filtradas.length === 0 && <p className="p-4 text-sm text-gray-500">Nenhuma cliente encontrada.</p>}
              {filtradas.map((c) => (
                <div key={c.login} className="p-4 flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{c.nome || '(sem nome)'}</p>
                    <p className="text-sm text-gray-600">{c.telefone || c.login}</p>
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(c.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
            <button type="button" onClick={carregarLista} className="mt-3 text-sm text-teal-700 underline">
              Atualizar lista
            </button>
          </>
        )}
      </div>
    </div>
  );
}

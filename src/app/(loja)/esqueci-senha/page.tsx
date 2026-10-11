'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EsqueciSenha() {
  const [passo, setPasso] = useState<1 | 2 | 3>(1);
  const [telefone, setTelefone] = useState('');
  const [codigo, setCodigo] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  const pedirCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const resposta = await fetch('/api/conta/esqueci', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefone }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.error || 'Não foi possível enviar o código.');
        return;
      }
      setAviso(dados.mensagem || '');
      setPasso(2);
    } catch {
      setErro('Sem conexão. Tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  const redefinir = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const resposta = await fetch('/api/conta/redefinir-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefone, codigo, senhaNova }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.error || 'Não foi possível redefinir a senha.');
        return;
      }
      setPasso(3);
    } catch {
      setErro('Sem conexão. Tente de novo.');
    } finally {
      setEnviando(false);
    }
  };

  const campo =
    'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none';

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Esqueci minha senha</h1>

        {passo === 1 && (
          <form onSubmit={pedirCodigo} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Digite o WhatsApp que você usou no cadastro. Vamos enviar um código para ele.
            </p>
            <input
              type="tel"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(35) 99999-0000"
              className={campo}
            />
            <button
              type="submit"
              disabled={enviando}
              className="w-full py-3 bg-teal-600 text-white rounded-lg font-bold disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Enviar código'}
            </button>
          </form>
        )}

        {passo === 2 && (
          <form onSubmit={redefinir} className="space-y-4">
            {aviso && <p className="text-sm text-gray-600 text-center">{aviso}</p>}
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={6}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Código de 6 números"
              className={campo}
            />
            <input
              type="password"
              required
              minLength={4}
              value={senhaNova}
              onChange={(e) => setSenhaNova(e.target.value)}
              placeholder="Nova senha (mínimo 4 caracteres)"
              className={campo}
            />
            <button
              type="submit"
              disabled={enviando}
              className="w-full py-3 bg-teal-600 text-white rounded-lg font-bold disabled:opacity-50"
            >
              {enviando ? 'Salvando...' : 'Criar nova senha'}
            </button>
            <button
              type="button"
              onClick={() => setPasso(1)}
              className="w-full text-sm text-gray-500 underline"
            >
              Não recebi o código
            </button>
          </form>
        )}

        {passo === 3 && (
          <div className="text-center space-y-4">
            <p className="text-green-700 font-semibold">Senha criada com sucesso!</p>
            <Link href="/minha-conta" className="inline-block py-3 px-6 bg-teal-600 text-white rounded-lg font-bold">
              Entrar em Minha conta
            </Link>
          </div>
        )}

        {erro && <p className="mt-4 text-sm text-red-600 text-center">{erro}</p>}
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { conferirSenha } from '@/lib/senha';
import { estaBloqueado, registrarFalha, limparFalhas, chaveLimite } from '@/lib/limite';

// Pedidos da própria cliente: confere e-mail e senha, depois devolve só os pedidos
// feitos com o WhatsApp da conta. Não aceita o número sozinho.
const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const login = String(body.email || '').trim().toLowerCase();
    const senha = String(body.password || '');
    const chave = chaveLimite(request.headers.get('x-forwarded-for'), login);

    if (estaBloqueado(chave)) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente de novo em 15 minutos.' }, { status: 429 });
    }

    const db = supabase();
    const { data: conta } = await db.from('clientes_conta').select('login, telefone, senha_hash').eq('login', login).maybeSingle();
    if (!conta || !(await conferirSenha(senha, conta.senha_hash))) {
      registrarFalha(chave);
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 });
    }
    limparFalhas(chave);

    const whatsapp = String(conta.telefone || '').replace(/\D/g, '');
    if (!whatsapp) return NextResponse.json([]);

    const { data: pedidos, error } = await db
      .from('orders')
      .select('id, partnerphone, date, total, status, items, created_at')
      .order('created_at', { ascending: false });
    if (error) throw error;

    const meus = (pedidos || [])
      .filter((p: any) => String(p.partnerphone || '').replace(/\D/g, '') === whatsapp)
      .map((p: any) => ({
        number: /^\d+$/.test(String(p.id)) ? Number(p.id) : 0,
        date: p.created_at || p.date,
        total: Number(p.total) || 0,
        status: p.status,
        totalItems: (Array.isArray(p.items) ? p.items : []).reduce((s: number, i: any) => s + (Number(i.quantity) || 0), 0),
      }));

    return NextResponse.json(meus);
  } catch (error) {
    console.error('Erro ao listar pedidos da cliente:', error);
    return NextResponse.json({ error: 'Não foi possível carregar os pedidos.' }, { status: 500 });
  }
}

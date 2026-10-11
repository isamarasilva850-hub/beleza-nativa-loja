import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomInt } from 'crypto';
import { gerarHashSenha } from '@/lib/senha';

// Passo 1 do "Esqueci minha senha": envia um código de 6 dígitos por WhatsApp.
// Responde sempre igual, para não revelar se o número tem conta.

const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

const RESPOSTA_PADRAO = {
  ok: true,
  mensagem: 'Se este WhatsApp tiver cadastro, você vai receber um código em instantes.',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const digitos = String(body.telefone || '').replace(/\D/g, '');
    if (digitos.length < 10) {
      return NextResponse.json({ error: 'Informe o WhatsApp com DDD.' }, { status: 400 });
    }

    const login = `${digitos}@belezanativa.local`;
    const db = supabase();
    const { data: conta } = await db.from('clientes_conta').select('login').eq('login', login).maybeSingle();

    if (!conta) return NextResponse.json(RESPOSTA_PADRAO);

    const codigo = String(randomInt(0, 1000000)).padStart(6, '0');
    const { error } = await db
      .from('clientes_conta')
      .update({
        reset_codigo_hash: await gerarHashSenha(codigo),
        reset_expira: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        reset_tentativas: 0,
      })
      .eq('login', login);
    if (error) throw error;

    const apiKey = process.env.WASENDER_API_KEY;
    if (!apiKey) throw new Error('WASENDER_API_KEY não configurada');

    const envio = await fetch('https://wasenderapi.com/api/send-message', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: digitos,
        text: `Beleza Nativa: seu código para criar uma nova senha é ${codigo}. Ele vale por 10 minutos. Se você não pediu, ignore esta mensagem.`,
      }),
    });
    if (!envio.ok) throw new Error(`WaSender respondeu ${envio.status}`);

    return NextResponse.json(RESPOSTA_PADRAO);
  } catch (error) {
    console.error('Erro ao enviar código de senha:', error);
    return NextResponse.json({ error: 'Não foi possível enviar o código agora. Tente de novo em instantes.' }, { status: 500 });
  }
}

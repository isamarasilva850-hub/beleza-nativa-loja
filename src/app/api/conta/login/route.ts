import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { conferirSenha } from '@/lib/senha';
import { estaBloqueado, registrarFalha, limparFalhas, chaveLimite } from '@/lib/limite';

const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entrada = String(body.email || '').trim().toLowerCase();
    // Cliente entra com o WhatsApp; a conta é guardada como "numero@belezanativa.local"
    const digitos = entrada.replace(/\D/g, '');
    const login = !entrada.includes('@') && digitos.length >= 10 ? `${digitos}@belezanativa.local` : entrada;
    const senha = String(body.password || '');
    const chave = chaveLimite(request.headers.get('x-forwarded-for'), login);

    if (estaBloqueado(chave)) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente de novo em 15 minutos.' }, { status: 429 });
    }

    const { data: conta } = await supabase()
      .from('clientes_conta')
      .select('*')
      .eq('login', login)
      .maybeSingle();

    // Mesma resposta para login inexistente e senha errada, para não revelar contas
    if (!conta || !(await conferirSenha(senha, conta.senha_hash))) {
      registrarFalha(chave);
      return NextResponse.json({ error: 'WhatsApp ou senha incorretos.' }, { status: 401 });
    }
    limparFalhas(chave);

    return NextResponse.json({
      email: conta.login,
      name: conta.nome || '',
      phone: conta.telefone || '',
      type: conta.tipo || undefined,
      company: conta.empresa || undefined,
      cnpj: conta.cnpj || undefined,
      city: conta.cidade || undefined,
      state: conta.estado || undefined,
      address: conta.endereco || undefined,
      cep: conta.cep || undefined,
    });
  } catch (error) {
    console.error('Erro ao entrar:', error);
    return NextResponse.json({ error: 'Não foi possível entrar agora.' }, { status: 500 });
  }
}

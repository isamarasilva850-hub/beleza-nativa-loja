import { createHmac, timingSafeEqual } from 'crypto';

// Sessão do admin: um token assinado (HMAC) guardado em cookie httpOnly.
// Precisa da variável ADMIN_SESSION_SECRET (chave secreta escolhida por você, na Vercel).

export const COOKIE_SESSAO = 'bn_admin';
const DURACAO_MS = 12 * 60 * 60 * 1000; // 12 horas

export interface SessaoAdmin {
  usuario: string;
  perfil: 'admin' | 'palmira';
}

function segredo(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error('ADMIN_SESSION_SECRET não configurada');
  return s;
}

export function criarToken(usuario: string, perfil: SessaoAdmin['perfil']): string {
  const corpo = Buffer.from(JSON.stringify({ u: usuario, p: perfil, e: Date.now() + DURACAO_MS })).toString('base64url');
  const assinatura = createHmac('sha256', segredo()).update(corpo).digest('base64url');
  return `${corpo}.${assinatura}`;
}

export function lerToken(token?: string | null): SessaoAdmin | null {
  if (!token) return null;
  try {
    const [corpo, assinatura] = token.split('.');
    if (!corpo || !assinatura) return null;
    const esperada = createHmac('sha256', segredo()).update(corpo).digest('base64url');
    const a = Buffer.from(assinatura);
    const b = Buffer.from(esperada);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const dados = JSON.parse(Buffer.from(corpo, 'base64url').toString());
    if (!dados.e || dados.e < Date.now()) return null;
    if (dados.p !== 'admin' && dados.p !== 'palmira') return null;
    return { usuario: dados.u, perfil: dados.p };
  } catch {
    return null;
  }
}

export const OPCOES_COOKIE = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: DURACAO_MS / 1000,
};

// Confere se quem chama a rota está logado com um dos perfis permitidos.
// Devolve a resposta de erro (401) quando não está, ou null quando está liberado.
export function negarSeNaoAdmin(request: { headers: { get: (n: string) => string | null } }, perfis: SessaoAdmin["perfil"][] = ["admin"]) {
  const cabecalho = request.headers.get("cookie") || "";
  const parte = cabecalho.split(";").map((c) => c.trim()).find((c) => c.startsWith(COOKIE_SESSAO + "="));
  const sessao = lerToken(parte ? decodeURIComponent(parte.slice(COOKIE_SESSAO.length + 1)) : null);
  if (!sessao || !perfis.includes(sessao.perfil)) {
    return { error: "Não autorizado. Entre no admin para continuar.", status: 401 } as const;
  }
  return null;
}

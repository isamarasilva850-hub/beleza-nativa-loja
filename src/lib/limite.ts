// Limite de tentativas de login: depois de 5 senhas erradas, bloqueia por 15 minutos.
// Guardado na memória do servidor: protege bem contra tentativas repetidas, mas o
// contador zera se o servidor reiniciar.

const MAX_FALHAS = 5;
const BLOQUEIO_MS = 15 * 60 * 1000;

const registro = new Map<string, { falhas: number; bloqueadoAte: number }>();

export function estaBloqueado(chave: string): boolean {
  const r = registro.get(chave);
  if (!r) return false;
  if (r.bloqueadoAte && r.bloqueadoAte > Date.now()) return true;
  if (r.bloqueadoAte && r.bloqueadoAte <= Date.now()) registro.delete(chave);
  return false;
}

export function registrarFalha(chave: string): void {
  const r = registro.get(chave) || { falhas: 0, bloqueadoAte: 0 };
  r.falhas += 1;
  if (r.falhas >= MAX_FALHAS) {
    r.bloqueadoAte = Date.now() + BLOQUEIO_MS;
    r.falhas = 0;
  }
  registro.set(chave, r);
}

export function limparFalhas(chave: string): void {
  registro.delete(chave);
}

// Chave do limite: endereço de quem chama + usuário tentado
export function chaveLimite(ip: string | null, usuario: string): string {
  return `${(ip || 'desconhecido').split(',')[0].trim()}|${usuario.toLowerCase()}`;
}

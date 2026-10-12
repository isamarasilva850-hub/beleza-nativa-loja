import { createHmac } from 'crypto';

// Assinatura do link de edição da vitrine. Só quem recebe o link gerado pela equipe consegue salvar.
export function tokenVitrine(pedidoId: string): string {
  const segredo = process.env.ADMIN_SESSION_SECRET || '';
  if (!segredo) throw new Error('ADMIN_SESSION_SECRET não configurado');
  return createHmac('sha256', segredo).update('vitrine:' + pedidoId).digest('hex').slice(0, 32);
}

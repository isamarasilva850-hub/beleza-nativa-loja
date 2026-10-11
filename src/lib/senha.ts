import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCb) as (senha: string, salt: Buffer, tamanho: number) => Promise<Buffer>;

// Formato guardado: scrypt$<sal em hex>$<hash em hex>
export async function gerarHashSenha(senha: string): Promise<string> {
  const sal = randomBytes(16);
  const hash = await scrypt(senha, sal, 64);
  return `scrypt$${sal.toString('hex')}$${hash.toString('hex')}`;
}

export async function conferirSenha(senha: string, guardado: string): Promise<boolean> {
  const [algoritmo, salHex, hashHex] = guardado.split('$');
  if (algoritmo !== 'scrypt' || !salHex || !hashHex) return false;
  const esperado = Buffer.from(hashHex, 'hex');
  const calculado = await scrypt(senha, Buffer.from(salHex, 'hex'), esperado.length);
  return calculado.length === esperado.length && timingSafeEqual(calculado, esperado);
}

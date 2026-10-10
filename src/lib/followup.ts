export type Passo = {
  dias: number;
  titulo: string;
  mensagem: string;
  feito: boolean;
  feitoEm?: string;
};

export type Plano = {
  tipo: "lead" | "revenda";
  nome: string;
  telefone: string;
  inicio: string;
  passos: Passo[];
};

export type Planos = Record<string, Plano>;

const FIM_DO_PLANO = 360;

const passosLead = (): Passo[] => {
  const base: Omit<Passo, "feito">[] = [
    { dias: 0, titulo: "1. Abrir", mensagem: "Oi, [NOME]! 😊 Aqui é a Isa, consultora da Beleza Nativa. Vi que você trabalha com lingerie. Posso te fazer uma perguntinha?" },
    { dias: 2, titulo: "2. Conectar", mensagem: "[NOME], hoje você vende lingerie mais pelo Instagram/WhatsApp ou também tem loja física?" },
    { dias: 5, titulo: "3. Diagnosticar", mensagem: "[NOME], e o que suas clientes costumam procurar mais: peças básicas, conjuntos ou modelos diferenciados?" },
    { dias: 8, titulo: "4. Divulgação", mensagem: "[NOME], na hora de divulgar as peças, como você faz suas postagens? Você mesma cria ou tem dificuldade?" },
    { dias: 11, titulo: "5. Personalizar", mensagem: "[NOME], então deixa eu te contar: na Beleza Nativa você recebe arte e legenda PRONTA com cada peça. Isso faria diferença pra você?" },
    { dias: 15, titulo: "6. Apresentar", mensagem: "[NOME], separei alguns modelos pensando no que você me contou. 😊 Quais desses você consegue imaginar vendendo melhor?" },
    { dias: 20, titulo: "7. Negociar", mensagem: "[NOME], qual desses modelos você acha que teria mais saída aí? Quer começar com um pedido enxuto ou montar um mix?" },
  ];
  for (let d = 50; d <= FIM_DO_PLANO; d += 30) {
    base.push({ dias: d, titulo: "Novidades", mensagem: "Oi, [NOME]! Chegaram novidades na Beleza Nativa. Quer dar uma olhada?" });
  }
  return base.map((p) => ({ ...p, feito: false }));
};

const passosRevenda = (): Passo[] => {
  const base: Omit<Passo, "feito">[] = [
    { dias: 3, titulo: "Pós-venda (entre 3 e 5 dias)", mensagem: "[NOME], seu pedido chegou! Quero muito saber o que você achou das peças. 🥰" },
    { dias: 15, titulo: "Reposição", mensagem: "[NOME], que tal repor as peças que mais saíram? Posso separar um pedido pra você." },
    { dias: 30, titulo: "Próxima compra", mensagem: "Oi, [NOME]! Como estão as vendas? Quer que eu te mostre as novidades para a próxima compra?" },
    { dias: 60, titulo: "Reativação", mensagem: "Oi, [NOME]! Saudades 💛 Chegaram peças novas. Quer que eu te mande?" },
  ];
  for (let d = 90; d <= FIM_DO_PLANO; d += 30) {
    base.push({ dias: d, titulo: "Novidades", mensagem: "Oi, [NOME]! Chegaram novidades na Beleza Nativa. Quer dar uma olhada?" });
  }
  return base.map((p) => ({ ...p, feito: false }));
};

export const criarPlano = (tipo: "lead" | "revenda", nome: string, telefone: string, inicio: string): Plano => ({
  tipo,
  nome,
  telefone,
  inicio,
  passos: tipo === "lead" ? passosLead() : passosRevenda(),
});

export const somarDias = (dataISO: string, dias: number) => {
  const d = new Date(`${dataISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
};

export const dataDoPasso = (plano: Plano, passo: Passo) => somarDias(plano.inicio, passo.dias);

export const preencherNome = (texto: string, nome: string) => texto.replace("[NOME]", nome);

export const passosDeHoje = (planos: Planos, hoje: string) => {
  const lista: { id: string; plano: Plano; indice: number; passo: Passo; data: string }[] = [];
  for (const [id, plano] of Object.entries(planos)) {
    plano.passos.forEach((passo, indice) => {
      const data = dataDoPasso(plano, passo);
      if (!passo.feito && data === hoje) lista.push({ id, plano, indice, passo, data });
    });
  }
  return lista;
};

import { redirect } from "next/navigation";

// Tela antiga, que guardava os produtos só no navegador. Agora vai para o painel da Palmira,
// que grava no servidor.
export default function PalmiraProdutosAntiga() {
  redirect("/admin/palmira/upload");
}

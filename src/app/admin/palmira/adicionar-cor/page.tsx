import { redirect } from "next/navigation";

// Tela antiga, que gravava cores só no navegador. Agora vai para o painel da Palmira,
// que grava no servidor.
export default function PalmiraAdicionarCorAntiga() {
  redirect("/admin/palmira/upload");
}

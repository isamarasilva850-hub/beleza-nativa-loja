import { redirect } from "next/navigation";

// Tela antiga, que lia o estoque só do navegador. Agora vai para o painel da Palmira,
// que grava no servidor.
export default function PalmiraEstoqueAntiga() {
  redirect("/admin/palmira/upload");
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(request: Request) {
  try {
    const { orderedIds } = await request.json();

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds é obrigatório e deve ser um array" },
        { status: 400 }
      );
    }

    const productsPath = path.join(process.cwd(), "src", "data", "products.json");
    const productsData = fs.readFileSync(productsPath, "utf-8");
    let products = JSON.parse(productsData);

    // Reordenar conforme o array enviado
    const reordered = orderedIds.map((id: string) => 
      products.find((p: any) => p.id.toString() === id.toString())
    ).filter((p: any) => p !== undefined);

    // Adicionar qualquer produto que não estava no array (caso tenha sido adicionado enquanto ordenava)
    const reorderedIds = new Set(reordered.map((p: any) => p.id));
    const remaining = products.filter((p: any) => !reorderedIds.has(p.id));

    const finalProducts = [...reordered, ...remaining];

    fs.writeFileSync(productsPath, JSON.stringify(finalProducts, null, 2));

    return NextResponse.json({
      success: true,
      message: "Produtos reordenados com sucesso",
      count: finalProducts.length
    });
  } catch (error) {
    console.error("Erro ao reordenar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao reordenar produtos" },
      { status: 500 }
    );
  }
}

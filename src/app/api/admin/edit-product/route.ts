import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(request: Request) {
  try {
    const { productId, updates } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId é obrigatório" },
        { status: 400 }
      );
    }

    const productsPath = path.join(process.cwd(), "src", "data", "products.json");
    const productsData = fs.readFileSync(productsPath, "utf-8");
    const products = JSON.parse(productsData);

    const productIndex = products.findIndex((p: any) => p.id.toString() === productId.toString());

    if (productIndex === -1) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    products[productIndex] = { ...products[productIndex], ...updates };
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    return NextResponse.json({
      success: true,
      message: "Produto atualizado com sucesso",
      product: products[productIndex]
    });
  } catch (error) {
    console.error("Erro ao editar produto:", error);
    return NextResponse.json(
      { error: "Erro ao editar produto" },
      { status: 500 }
    );
  }
}

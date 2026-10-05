import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(request: Request) {
  try {
    const { productId, coverImageUrl } = await request.json();

    if (!productId || !coverImageUrl) {
      return NextResponse.json(
        { error: "productId e coverImageUrl são obrigatórios" },
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

    // Atualizar a primeira imagem (capa)
    if (products[productIndex].images && products[productIndex].images.length > 0) {
      products[productIndex].images[0] = coverImageUrl;
    } else {
      products[productIndex].images = [coverImageUrl];
    }

    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    return NextResponse.json({
      success: true,
      message: "Capa do produto atualizada com sucesso",
      product: products[productIndex]
    });
  } catch (error) {
    console.error("Erro ao atualizar capa:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar capa" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(request: Request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId é obrigatório" },
        { status: 400 }
      );
    }

    const productsPath = path.join(process.cwd(), "src", "data", "products.json");
    const productsData = fs.readFileSync(productsPath, "utf-8");
    let products = JSON.parse(productsData);

    const productIndex = products.findIndex((p: any) => p.id.toString() === productId.toString());

    if (productIndex === -1) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);

    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    return NextResponse.json({
      success: true,
      message: "Produto deletado com sucesso",
      deleted: deletedProduct
    });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return NextResponse.json(
      { error: "Erro ao deletar produto" },
      { status: 500 }
    );
  }
}

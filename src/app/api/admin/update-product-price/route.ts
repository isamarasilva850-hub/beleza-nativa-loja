import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(request: Request) {
  try {
    const { productId, newPrice } = await request.json();

    if (!productId || newPrice === undefined) {
      return NextResponse.json(
        { error: 'productId e newPrice são obrigatórios' },
        { status: 400 }
      );
    }

    const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(productsData);

    // Encontrar e atualizar o produto
    const product = products.find((p: any) => p.id.toString() === productId.toString());

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    product.price = parseFloat(newPrice);

    // Salvar de volta no arquivo
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Preço atualizado com sucesso',
      product
    });
  } catch (error) {
    console.error('Erro ao atualizar preço:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar preço' },
      { status: 500 }
    );
  }
}

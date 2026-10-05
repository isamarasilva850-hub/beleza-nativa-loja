import { NextResponse } from 'next/server';
import { products } from '@/data/products';
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

    // Encontrar e atualizar o produto
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    product.price = parseFloat(newPrice);

    // Salvar de volta no arquivo (em desenvolvimento)
    // Em produção, isso deveria usar um banco de dados
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const filePath = path.join(dataDir, 'products.json');
    
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

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

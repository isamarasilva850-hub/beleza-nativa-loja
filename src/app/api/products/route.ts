import { NextResponse } from 'next/server';
import { products } from '@/data/products';

export async function GET() {
  try {
    return NextResponse.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

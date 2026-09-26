import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ref, name, category, gender, price, images, color, colorHex, sizes, quantity } = body;

    if (!ref || !name || !price) {
      return NextResponse.json(
        { error: 'Ref, Nome e Preço são obrigatórios' },
        { status: 400 }
      );
    }

    const productId = `${ref}-${Date.now().toString(36)}`;

    const { data, error } = await supabase
      .from('uploaded_products')
      .insert({
        id: productId,
        ref,
        name,
        category: category || 'Lingerie',
        gender: gender || 'Feminino',
        price: typeof price === 'string' ? parseFloat(price) : price,
        images: images || [],
        color: color || '',
        colorHex: colorHex || '#000000',
        sizes: sizes || [],
        quantity: typeof quantity === 'string' ? parseInt(quantity) : quantity || 0,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar produto:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar produto' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('uploaded_products')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar produtos' },
      { status: 500 }
    );
  }
}

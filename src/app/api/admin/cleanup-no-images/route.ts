import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Delete all products where images is null, empty array, or empty string
    const { data, error } = await supabase
      .from('products')
      .delete()
      .or('images.is.null,images.eq.[],"images.eq."""');

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Deleted all products without images');
    return NextResponse.json({
      success: true,
      message: 'Deletados todos os produtos sem imagens'
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('ERROR:', msg);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}

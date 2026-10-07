import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const testRefs = ['TESTCORES', 'PROD_TEST_FINAL', 'MINIMO', 'TESTE_AGORA_1791387346085'];

    // Delete products with these refs
    const { data, error } = await supabase
      .from('products')
      .delete()
      .in('ref', testRefs);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Deleted test products:', testRefs);
    return NextResponse.json({
      success: true,
      message: `Deletados ${testRefs.length} produtos de teste`,
      refs: testRefs
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

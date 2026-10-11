import { NextRequest, NextResponse } from 'next/server';
import { negarSeNaoAdmin } from '@/lib/sessao';
export async function POST(req: Request) {
  { const negado = negarSeNaoAdmin(req, ['admin']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  try {
    const body = await req.json();
    const { method, path, body: erpBody } = body;
    const erpUrl = `http://localhost:3000${path}`;

    const erpResponse = await fetch(erpUrl, {
      method: method || "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(erpBody),
    });

    const responseText = await erpResponse.text();

    if (!erpResponse.ok) {
      throw new Error(`ERP responded with ${erpResponse.status}: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { success: true };
    }

    return Response.json(data);
  } catch (error) {
    console.error("[ERP Proxy Error]", error);
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  { const negado = negarSeNaoAdmin(req, ['admin']); if (negado) return NextResponse.json({ error: negado.error }, { status: negado.status }); }
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "";
  const erpUrl = `http://localhost:3000${path}`;

  try {
    const response = await fetch(erpUrl);
    if (!response.ok) throw new Error(`ERP error: ${response.status}`);
    return Response.json(await response.json());
  } catch (error) {
    console.error("ERP proxy error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { method, path, body } = await req.json();
    const erpUrl = `http://localhost:3000${path}`;

    console.log(`[ERP Proxy] ${method} ${erpUrl}`, JSON.stringify(body).substring(0, 100));

    const response = await fetch(erpUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`ERP error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("ERP proxy error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: Request) {
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

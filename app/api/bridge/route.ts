import { NextRequest, NextResponse } from 'next/server';

const BRIDGE_PORT = process.env.BRIDGE_PORT || 3001;
const BRIDGE_URL = `http://127.0.0.1:${BRIDGE_PORT}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category } = body;
    
    // Les commandes sont routées vers l'endpoint /order dédié
    // qui envoie un embed dans le canal Discord principal
    if (category === 'order') {
      const res = await fetch(`${BRIDGE_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) console.error(`[Bridge] /order error: ${res.status}`);
    }

    // Toujours logger aussi dans le serveur de logs secondaire
    const res = await fetch(`${BRIDGE_URL}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`Bridge error: ${res.status}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Bridge Relay] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


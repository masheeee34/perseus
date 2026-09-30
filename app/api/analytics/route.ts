import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { type, productId, userId, data } = await request.json();

    if (!type) return NextResponse.json({ error: 'Type requis' }, { status: 400 });

    const db = await getDB();
    await db.execute({
      sql: 'INSERT INTO analytics (event_type, product_id, user_id, data) VALUES (?, ?, ?, ?)',
      args: [type, productId || null, userId || null, JSON.stringify(data || {})],
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Analytics API] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

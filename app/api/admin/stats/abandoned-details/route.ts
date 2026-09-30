import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    
    // Find carts that were updated more than 30 mins ago and are not empty
    const result = await db.execute({
      sql: `SELECT c.user_id, u.name, SUM(p.price * c.quantity) as total, 
                   GROUP_CONCAT(p.name || ' (x' || c.quantity || ')') as items_summary,
                   MAX(c.updatedAt) as last_update
            FROM cart_items c
            JOIN users u ON c.user_id = u.id
            JOIN products p ON c.product_id = p.id
            WHERE c.updatedAt <= datetime('now', '-30 minutes')
            GROUP BY c.user_id`,
      args: [],
    });

    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error('[Abandoned Details API] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

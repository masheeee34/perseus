import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const today = new Date().toISOString().split('T')[0];

    // 1. Total Sales & Order Count (Approved/Paid only)
    const salesResult = await db.execute({
      sql: `SELECT SUM(total) as total, COUNT(*) as count 
            FROM orders 
            WHERE (status = 'paid' OR status = 'approved') 
            AND createdAt >= ?`,
      args: [`${today} 00:00:00`],
    });

    // 2. New VIPs
    const vipResult = await db.execute({
      sql: `SELECT COUNT(*) as count FROM users WHERE vip_level != 'standard' AND createdAt >= ?`,
      args: [`${today} 00:00:00`],
    });

    // 3. Top Product (Views today)
    const topProductResult = await db.execute({
      sql: `SELECT p.name, COUNT(a.id) as views 
            FROM analytics a
            JOIN products p ON a.product_id = p.id
            WHERE a.event_type = 'view' AND a.createdAt >= ?
            GROUP BY a.product_id
            ORDER BY views DESC
            LIMIT 1`,
      args: [`${today} 00:00:00`],
    });

    // 4. Abandoned Carts (Updated 30min+ ago, not checked out)
    const abandonedResult = await db.execute({
        sql: `SELECT COUNT(DISTINCT user_id) as count 
              FROM cart_items 
              WHERE updatedAt <= datetime('now', '-30 minutes')`,
        args: [],
    });

    // 5. Unique Visitors (Simple count of distinct users in analytics)
    const visitorsResult = await db.execute({
        sql: `SELECT COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id ELSE data END) as count 
              FROM analytics 
              WHERE createdAt >= ?`,
        args: [`${today} 00:00:00`],
    });

    return NextResponse.json({
      totalSales: salesResult.rows[0]?.total || 0,
      orderCount: salesResult.rows[0]?.count || 0,
      newVips: vipResult.rows[0]?.count || 0,
      topProduct: topProductResult.rows[0]?.name || 'Aucune vue',
      abandonedCarts: abandonedResult.rows[0]?.count || 0,
      visitors: visitorsResult.rows[0]?.count || 0,
    });
  } catch (err: any) {
    console.error('[Stats API] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

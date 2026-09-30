import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/db';
import { getUserFromToken } from '../../../../../lib/auth';
import PerseusLogger from '../../../../../lib/logger';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminUser = await getUserFromToken(authHeader);

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Accès administration requis' }, { status: 401 });
    }

    const { orderId, action } = await request.json();

    if (!orderId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
    }

    const db = await getDB();

    // Récupérer la commande
    const orderResult = await db.execute({
      sql: 'SELECT * FROM orders WHERE id = ?',
      args: [orderId],
    });

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: `Commande ${orderId} introuvable` }, { status: 404 });
    }

    const order = orderResult.rows[0];

    if (order.status !== 'awaiting_payment') {
      return NextResponse.json({ 
        error: `Commande déjà traitée (statut: ${order.status})` 
      }, { status: 409 });
    }

    if (action === 'approve') {
      // Approuver la commande
      await db.execute({
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        args: ['paid', orderId],
      });

      // Créditer les points de fidélité
      const total = typeof order.total === 'number' ? order.total : parseFloat(order.total as string);
      const pointsEarned = Math.max(Math.floor(total / 1000), 10);

      await db.execute({
        sql: 'UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?',
        args: [pointsEarned, order.user_id],
      });

      PerseusLogger.order(`👑 Admin APPROBATION WEB : ${orderId}`, {
        admin: adminUser.email,
        userId: order.user_id,
        total: order.total,
        points: pointsEarned
      });

      return NextResponse.json({ success: true, message: 'Commande approuvée et points crédités' });

    } else {
      // Refuser la commande
      await db.execute({
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        args: ['rejected', orderId],
      });

      PerseusLogger.order(`🚫 Admin REFUS WEB : ${orderId}`, {
        admin: adminUser.email,
        userId: order.user_id
      });

      return NextResponse.json({ success: true, message: 'Commande refusée' });
    }

  } catch (error: any) {
    console.error('[Admin Order Action] Error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

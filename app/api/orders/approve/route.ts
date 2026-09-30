import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import PerseusLogger from '../../../../lib/logger';

const BOT_SECRET = process.env.DISCORD_BOT_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification du bot
    const secret = request.headers.get('x-bot-secret');
    if (secret !== BOT_SECRET) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
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
      // Mettre à jour le statut en "paid"
      await db.execute({
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        args: ['paid', orderId],
      });

      // Calculer et créditer les points de fidélité
      const total = typeof order.total === 'number' ? order.total : parseFloat(order.total as string);
      const pointsEarned = Math.max(Math.floor(total / 1000), 10);

      await db.execute({
        sql: 'UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?',
        args: [pointsEarned, order.user_id],
      });

      // Recalculer le niveau VIP
      const userRes = await db.execute({
        sql: 'SELECT loyalty_points FROM users WHERE id = ?',
        args: [order.user_id]
      });
      const newPoints = userRes.rows[0].loyalty_points as number;
      
      // Import tiers logic
      const { calculateVIPLevel } = await import('../../../../lib/loyalty');
      const newLevel = calculateVIPLevel(newPoints);

      await db.execute({
        sql: 'UPDATE users SET vip_level = ? WHERE id = ?',
        args: [newLevel, order.user_id]
      });

      PerseusLogger.order(`✅ Commande APPROUVÉE : ${orderId}`, {
        userId: order.user_id,
        newPoints,
        newLevel,
        pointsEarned
      });

      return NextResponse.json({
        success: true,
        action: 'approved',
        orderId,
        points_credited: pointsEarned,
        message: `✅ Commande ${orderId} approuvée — ${pointsEarned} points crédités`,
      });

    } else {
      // Refuser la commande
      await db.execute({
        sql: 'UPDATE orders SET status = ? WHERE id = ?',
        args: ['cancelled', orderId],
      });

      PerseusLogger.order(`❌ Commande REFUSÉE : ${orderId}`, {
        userId: order.user_id,
        total: order.total,
      });

      return NextResponse.json({
        success: true,
        action: 'rejected',
        orderId,
        message: `❌ Commande ${orderId} refusée et annulée`,
      });
    }

  } catch (error: any) {
    console.error('[Approve] Error:', error?.message || error);
    PerseusLogger.error(`Échec approbation commande`, { error: error.message });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

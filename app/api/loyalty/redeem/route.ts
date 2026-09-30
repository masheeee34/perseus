import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { getUserFromToken } from '../../../../lib/auth';
import PerseusLogger from '../../../../lib/logger';

// Catalogue des récompenses disponibles
export const REWARDS = [
  {
    id: 'DISCOUNT_5',
    label: 'Réduction de 5%',
    description: 'Code de réduction de 5% sur votre prochaine acquisition',
    cost: 500,
    emoji: '🏷️',
    code: 'ELITE5',
  },
  {
    id: 'DISCOUNT_10',
    label: 'Réduction de 10%',
    description: 'Code de réduction de 10% sur votre prochaine acquisition',
    cost: 1200,
    emoji: '💎',
    code: 'ELITE10',
  },
  {
    id: 'DISCOUNT_15',
    label: 'Réduction de 15%',
    description: 'Code de réduction de 15% — Offre Premium',
    cost: 2500,
    emoji: '👑',
    code: 'ELITE15',
  },
  {
    id: 'FREE_SHIPPING',
    label: 'Livraison Conciergerie Express',
    description: 'Livraison prioritaire offerte sur votre prochaine commande',
    cost: 800,
    emoji: '🚀',
    code: 'SHIP_FREE',
  },
  {
    id: 'PRIVATE_SALE',
    label: 'Accès Vente Privée',
    description: 'Invitation exclusive à notre vente privée collection capsule',
    cost: 3000,
    emoji: '🔐',
    code: 'VIP_ACCESS',
  },
];

// GET: retourne la liste des récompenses
export async function GET(request: NextRequest) {
  return NextResponse.json({ rewards: REWARDS });
}

// POST: échanger des points contre une récompense
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { rewardId } = await request.json();

    const reward = REWARDS.find((r) => r.id === rewardId);
    if (!reward) {
      return NextResponse.json({ error: 'Récompense introuvable' }, { status: 404 });
    }

    const currentPoints: number = user.loyalty_points || 0;

    if (currentPoints < reward.cost) {
      return NextResponse.json(
        { error: `Points insuffisants. Vous avez ${currentPoints} pts, il en faut ${reward.cost}.` },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Déduire les points
    await db.execute({
      sql: 'UPDATE users SET loyalty_points = loyalty_points - ? WHERE id = ?',
      args: [reward.cost, user.id as string],
    });

    PerseusLogger.order(`🎁 Récompense échangée: ${reward.label}`, {
      userId: user.id,
      rewardId,
      cost: reward.cost,
      code: reward.code,
      remaining_points: currentPoints - reward.cost,
    });

    return NextResponse.json({
      success: true,
      reward: reward.label,
      code: reward.code,
      points_spent: reward.cost,
      points_remaining: currentPoints - reward.cost,
      message: `✅ Récompense activée ! Votre code : ${reward.code}`,
    });
  } catch (error: any) {
    console.error('[Loyalty Redeem] Error:', error?.message || error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { getUserFromToken } from '../../../../lib/auth';
import PerseusLogger from '../../../../lib/logger';

/**
 * Gère l'écrin (wishlist) de l'utilisateur en base de données
 */

// GET : Répcupérer les favoris
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const db = await getDB();
    const result = await db.execute({
      sql: `
        SELECT p.* FROM products p
        JOIN favorites f ON p.id = f.product_id
        WHERE f.user_id = ?
        ORDER BY p.name ASC
      `,
      args: [user.id as string]
    });

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('[Wishlist GET] Error:', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST : Toggle (Ajouter/Supprimer)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Produit requis' }, { status: 400 });
    }

    const db = await getDB();

    // Vérifier si déjà présent
    const existing = await db.execute({
      sql: 'SELECT 1 FROM favorites WHERE user_id = ? AND product_id = ?',
      args: [user.id as string, productId]
    });

    if (existing.rows.length > 0) {
      // Supprimer
      await db.execute({
        sql: 'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
        args: [user.id as string, productId]
      });
      PerseusLogger.sendLog('cart', `Retrait favori DB: ${productId}`, { userId: user.id });
      return NextResponse.json({ action: 'removed', productId });
    } else {
      // Ajouter
      await db.execute({
        sql: 'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
        args: [user.id as string, productId]
      });
      PerseusLogger.sendLog('cart', `Ajout favori DB: ${productId}`, { userId: user.id });
      return NextResponse.json({ action: 'added', productId });
    }
  } catch (error: any) {
    console.error('[Wishlist POST] Error:', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT : Sync (Fusionner le localStorage avec la DB)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { productIds } = await request.json();
    if (!Array.isArray(productIds)) {
      return NextResponse.json({ error: 'Liste de IDs requise' }, { status: 400 });
    }

    const db = await getDB();

    // Insérer en ignorant les doublons
    for (const pid of productIds) {
      await db.execute({
        sql: 'INSERT OR IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)',
        args: [user.id as string, pid]
      });
    }

    PerseusLogger.sendLog('system', `Synchronisation Wishlist (${productIds.length} items)`, { userId: user.id });

    // Retourner la liste complète à jour
    const updated = await db.execute({
      sql: `SELECT p.* FROM products p JOIN favorites f ON p.id = f.product_id WHERE f.user_id = ?`,
      args: [user.id as string]
    });

    return NextResponse.json({ success: true, wishlist: updated.rows });
  } catch (error: any) {
    console.error('[Wishlist PUT] Error:', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { getUserFromToken } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    // Vérifier que c'est un admin
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const db = await getDB();
    
    // Récupérer toutes les commandes avec les infos client
    const ordersResult = await db.execute({
      sql: `SELECT o.*, u.name as user_name, u.email as user_email 
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.createdAt DESC`,
      args: [],
    });

    const orders = ordersResult.rows.map(row => ({
      ...row,
      items: JSON.parse((row.items as string) || '[]'),
    }));

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('[Admin Orders API] Error:', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

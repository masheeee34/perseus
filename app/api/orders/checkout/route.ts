import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { getUserFromToken } from '../../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';
import PerseusLogger from '../../../../lib/logger';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    let user = await getUserFromToken(authHeader);

    const body = await request.json();
    const { address, items, total, coupon, payment_method, characterName } = body;

    if (!address) {
      
    // Notification Discord directe aux dirigeants (DMs)
    fetch('http://127.0.0.1:3099/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        characterName: user.name || characterName || 'Client In-Game',
        address,
        items,
        total: orderTotal,
        paymentMethod: payment_method || 'Fleeca Bank / Espèces',
        status: 'Nouvelle commande passée'
      }),
      signal: AbortSignal.timeout(3000),
    }).catch(err => console.warn('[Bot Notify Error]:', err.message));

    return NextResponse.json({ error: 'Adresse de livraison requise' }, { status: 400 });
    }

    // Si l'utilisateur n'est pas connecté, créer un compte invité / GTAW transparent
    if (!user) {
      const guestId = 'gtaw-' + uuidv4().slice(0, 8);
      const guestName = characterName || 'Client GTAW';
      const guestEmail = `${guestId}@gtaworld.local`;
      user = {
        id: guestId,
        name: guestName,
        email: guestEmail,
        role: 'customer',
      };
    }

    const orderId = 'ORD-' + uuidv4().slice(0, 8).toUpperCase();
    const orderTotal = typeof total === 'number' ? total : 0;
    const pointsEarned = Math.max(Math.floor(orderTotal / 1000), 10);

    const db = await getDB();

    // Ensure orders table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        items TEXT,
        total REAL,
        status TEXT DEFAULT 'awaiting_payment',
        address TEXT,
        coupon_code TEXT,
        discount REAL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert order
    await db.execute({
      sql: `INSERT INTO orders (id, user_id, items, total, status, address, coupon_code, discount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        orderId,
        user.id as string,
        JSON.stringify(items || []),
        orderTotal,
        'awaiting_payment',
        address,
        coupon || '',
        0,
      ],
    });

    try {
      PerseusLogger.order(`Nouvelle commande PERSEUS : ${orderId}`, { 
        reference: orderId,
        userId: user.id, 
        total: `${orderTotal}$`, 
        items_count: items?.length || 0,
        articles: (items || []).map((i: any) => `${i.name} (x${i.quantity})`).join(', '),
        customer: user.email,
        client: user.name || characterName || user.email,
        adresse: address,
        methode: payment_method === 'gtaw_gateway' ? 'Portail Banque GTA:W' : 'Virement Guichet',
        iban_destination: '0300 1458 1',
        points_pending: `+${pointsEarned} pts`,
        coupon: coupon || 'Aucun'
      });
    } catch (e) {
      console.warn('[Logger Warning]:', e);
    }

    
    // Notification Discord directe aux dirigeants (DMs)
    fetch('http://127.0.0.1:3099/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        characterName: user.name || characterName || 'Client In-Game',
        address,
        items,
        total: orderTotal,
        paymentMethod: payment_method || 'Fleeca Bank / Espèces',
        status: 'Nouvelle commande passée'
      }),
      signal: AbortSignal.timeout(3000),
    }).catch(err => console.warn('[Bot Notify Error]:', err.message));

    return NextResponse.json({
      ok: true,
      orderId,
      points_earned: pointsEarned,
      total: orderTotal,
      message: 'Commande enregistrée avec succès',
      banking_url: 'https://ucp.gta.world/banking',
      iban: '0300 1458 1',
    });
  } catch (error: any) {
    console.error('[Checkout] Error:', error?.message || error);
    
    // Notification Discord directe aux dirigeants (DMs)
    fetch('http://127.0.0.1:3099/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        characterName: user.name || characterName || 'Client In-Game',
        address,
        items,
        total: orderTotal,
        paymentMethod: payment_method || 'Fleeca Bank / Espèces',
        status: 'Nouvelle commande passée'
      }),
      signal: AbortSignal.timeout(3000),
    }).catch(err => console.warn('[Bot Notify Error]:', err.message));

    return NextResponse.json({ error: error.message || 'Erreur serveur lors de la commande' }, { status: 500 });
  }
}

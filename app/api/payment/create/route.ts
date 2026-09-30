import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { getUserFromToken } from '../../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';

const FLEECA_API_KEY = process.env.FLEECA_API_KEY || process.env.GTAW_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let user = await getUserFromToken(authHeader);

    const body = await req.json();
    const { amount, description, orderId, characterName, address, phone, items } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 });
    }

    const orderRef = orderId || `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    const paymentDesc = description || `Acquisition Perseus - ${orderRef} (${characterName || 'Client'})`;

    // 1. Appel API Fleeca V2 pour générer le lien bancaire
    const fleecaRes = await fetch('https://fleeca.gta.world/api/v2/payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FLEECA_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        mode: 1, // 1 = Live / Réel
        description: paymentDesc.slice(0, 255),
      }),
    });

    const fleecaData = await fleecaRes.json();

    if (!fleecaRes.ok || !fleecaData.payment_link) {
      console.error('[Fleeca API Error]:', fleecaData);
      return NextResponse.json({ 
        error: fleecaData.message || 'Erreur lors de la création du lien Fleeca Bank',
        details: fleecaData
      }, { status: 422 });
    }

    const db = await getDB();

    // 2. Assurer l'existence du client dans la table `users`
    let targetUserId = user?.id;
    if (!targetUserId) {
      targetUserId = 'gtaw-' + uuidv4().slice(0, 8);
      const clientName = characterName || 'Client GTA:World';
      const clientEmail = `${targetUserId}@gtaworld.local`;

      await db.execute({
        sql: `INSERT OR IGNORE INTO users (id, email, password, name, role)
              VALUES (?, ?, ?, ?, ?)`,
        args: [targetUserId, clientEmail, 'OAUTH_GUEST', clientName, 'customer'],
      });
    }

    const fullDeliveryAddress = `${address || 'Portola Drive'} ${phone ? `(Tél: ${phone})` : ''}`;

    // 3. Insérer la commande avec un user_id valide
    await db.execute({
      sql: `INSERT OR REPLACE INTO orders (id, user_id, items, total, status, address, coupon_code, discount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        orderRef,
        targetUserId,
        JSON.stringify(items || []),
        amount,
        'awaiting_payment',
        `${fullDeliveryAddress} (Client: ${characterName || 'Anonyme'})`,
        '',
        0,
      ],
    });

    // 4. Notification instantanée en DM aux dirigeants (zineddine & slither_2)
    // Note: Pas de notification Discord ici pour eviter les fausses alertes. Le bot est alerte uniquement via fleeca-callback quand le virement est reellement effectue.

    return NextResponse.json({
      success: true,
      orderId: orderRef,
      payment_id: fleecaData.payment_id,
      payment_link: fleecaData.payment_link,
      message: 'Lien Fleeca généré avec succès',
    });
  } catch (error: any) {
    console.error('[Create Payment Error]:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur lors du paiement' }, { status: 500 });
  }
}

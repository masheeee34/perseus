import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDB } from '../../../../lib/db';
import PerseusLogger from '../../../../lib/logger';

const FLEECA_API_KEY = process.env.FLEECA_API_KEY || process.env.GTAW_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-fleeca-signature') || '';

    // Vérification de la signature HMAC-SHA256
    const expected = 'sha256=' + crypto
      .createHmac('sha256', FLEECA_API_KEY)
      .update(rawBody)
      .digest('hex');

    if (signature && signature !== expected) {
      console.warn('[Fleeca Webhook] Signature invalide :', signature);
      return new NextResponse('Invalid signature', { status: 403 });
    }

    const payload = JSON.parse(rawBody);
    const { payment_id, amount, payer_routing, payer_name, status, description, paid_at } = payload;

    console.log('[Fleeca Webhook Reçu]:', { payment_id, amount, payer_name, status });

    if (status === 'payment_successful') {
      const db = await getDB();
      await db.execute({
        sql: `UPDATE orders SET status = 'paid' WHERE id LIKE ? OR user_id = ?`,
        args: [`%${payment_id}%`, payment_id],
      });

      // Notification instantanée de paiement validé aux dirigeants
      fetch('http://127.0.0.1:3099/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `FLEECA-${payment_id ? payment_id.slice(0, 8) : 'PAID'}`,
          characterName: payer_name || 'Client In-Game',
          address: `Compte Fleeca: ${payer_routing || 'N/A'}`,
          items: [],
          total: amount,
          paymentMethod: 'FLEECA BANK (Virement Reçu)',
          status: '✅ PAIEMENT VALIDÉ & ENCAISSÉ SUR LA CAISSE'
        }),
        signal: AbortSignal.timeout(3000),
      }).catch(err => console.warn('[Bot Notify Error]:', err.message));

      try {
        PerseusLogger.order(`Paiement FLEECA Validé : ${amount}$`, {
          payment_id,
          montant: `${amount}$`,
          payeur: payer_name || 'Inconnu',
          compte_bancaire: payer_routing || 'N/A',
          statut: 'PAYÉ & ENCAISSÉ',
          date: paid_at || new Date().toISOString(),
          description: description || 'Acquisition Joaillerie',
        });
      } catch (e) {}
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Fleeca Callback Error]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

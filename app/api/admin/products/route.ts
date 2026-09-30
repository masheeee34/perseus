import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';
import PerseusLogger from '../../../../lib/logger';

// Middleware-like check for admin
async function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  // 1. Check for Internal Bot Authorization
  const BOT_SECRET = process.env.DISCORD_BOT_SECRET;
  if (authHeader === `Internal ${BOT_SECRET}`) {
    return 'perseus_bot_system'; // Special ID for bot actions
  }

  // 2. Standard Admin Authorization
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) return null;

  const db = await getDB();
  const result = await db.execute({
    sql: 'SELECT role FROM users WHERE id = ?',
    args: [payload.userId],
  });

  if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
    return null;
  }
  return payload.userId;
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await checkAdmin(request);
    if (!adminId) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const data = await request.json();
    const { id, name, file, cat, price, priceStr, categoryAttr, collection, ribbon, desc, tags } = data;

    if (!id || !name || !file || !cat || !price) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const db = await getDB();
    await db.execute({
      sql: `INSERT INTO products (id, name, file, cat, tags, price, priceStr, size, categoryAttr, collection, ribbon, desc)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, name, file, cat, tags || '', price, priceStr || price.toLocaleString(), 'Unique', categoryAttr, collection || '', ribbon || '', desc || ''],
    });

    PerseusLogger.sendLog('changelog', `🆕 Nouveau produit créé: ${name} (${id})`, { id, price });

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error('[Admin API] Create Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminId = await checkAdmin(request);
    if (!adminId) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const data = await request.json();
    const { id, ...updates } = data;

    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const db = await getDB();
    
    const fields = Object.keys(updates);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const args = [...Object.values(updates), id];

    await db.execute({
      sql: `UPDATE products SET ${setClause} WHERE id = ?`,
      args,
    });

    PerseusLogger.sendLog('changelog', `✏️ Mise à jour produit \`${id}\``, updates);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Admin API] Update Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminId = await checkAdmin(request);
    if (!adminId) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

    const db = await getDB();
    await db.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id],
    });

    PerseusLogger.sendLog('changelog', `🗑️ Produit supprimé définitivement: \`${id}\``);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Admin API] Delete Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

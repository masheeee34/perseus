import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { getUserFromToken } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    // Seul l'admin peut voir la config complète
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const db = await getDB();
    
    // S'assurer que la table existe
    await db.execute(`CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)`);
    
    const result = await db.execute('SELECT * FROM config');
    const config: Record<string, string> = {};
    result.rows.forEach((row: any) => {
      config[row.key as string] = row.value as string;
    });

    return NextResponse.json(config);
  } catch (error: any) {
    console.error('[Admin Config GET] Error:', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { key, value } = await request.json();
    if (!key) return NextResponse.json({ error: 'Clé manquante' }, { status: 400 });

    const db = await getDB();
    await db.execute(`CREATE TABLE IF NOT EXISTS config (key TEXT PRIMARY KEY, value TEXT)`);
    
    await db.execute({
      sql: 'INSERT INTO config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?',
      args: [key, String(value), String(value)],
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Admin Config POST] Error:', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

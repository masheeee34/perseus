import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';

let configCache: Record<string, string> | null = null;
let lastUpdate = 0;
const CACHE_TTL = 30000; // 30 secondes

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    if (configCache && (now - lastUpdate < CACHE_TTL)) {
      return NextResponse.json(configCache);
    }

    const db = await getDB();
    
    // Récupérer uniquement les configs publiques sécurisées
    const result = await db.execute("SELECT * FROM config WHERE key IN ('maintenance_mode', 'site_name', 'contact_email')");
    const config: Record<string, string> = {};
    result.rows.forEach((row: any) => {
      config[row.key as string] = row.value as string;
    });

    configCache = config;
    lastUpdate = now;

    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

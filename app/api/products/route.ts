import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../lib/db';

let productsCache: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 30000; // 30 secondes en mémoire RAM

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const noCache = searchParams.get('no_cache') === 'true';

    if (!noCache && productsCache && (Date.now() - lastCacheTime < CACHE_TTL)) {
      return NextResponse.json(productsCache, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      });
    }

    const db = await getDB();
    const result = await db.execute({ sql: 'SELECT * FROM products ORDER BY name ASC', args: [] });
    
    productsCache = result.rows;
    lastCacheTime = Date.now();

    return NextResponse.json(result.rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (err: any) {
    console.error('[Products API] Error:', err.message);
    return NextResponse.json({ error: 'Erreur catalogue' }, { status: 500 });
  }
}
